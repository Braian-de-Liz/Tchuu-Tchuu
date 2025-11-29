// BACK-END_NODEJS/src/connections/ESP_Server.js
import mqtt from 'mqtt';
import { conectar } from '../databases/conectar_banco.js';
import dotenv from 'dotenv';

dotenv.config();


let clientMqtt = null;
let isFirstConnection = true; 

const CLIENT_ID = `tchuu-tchuu-server-${Math.random().toString(16).substr(2, 8)}`; 

function iniciarServidorEsp() {
    if (!MQTT_BROKER_URL || !MQTT_USERNAME || !MQTT_PASSWORD) {
        console.error("Erro: Variáveis de ambiente MQTT_BROKER_URL, MQTT_USERNAME ou MQTT_PASSWORD não definidas.");
        return;
    }

    console.log("Tentando conectar o ESP_Server ao broker MQTT do HiveMQ...");

    const options = {
        clientId: CLIENT_ID, 
        clean: true,
        connectTimeout: 4000,
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
    };

    if (clientMqtt) {
        console.warn("ESP_Server já está conectado ao broker MQTT.");
        return;
    }

    clientMqtt = mqtt.connect(MQTT_BROKER_URL, options);

    clientMqtt.on('connect', () => {
        if (isFirstConnection) {
            console.log("ESP_Server conectado ao broker MQTT do HiveMQ com sucesso!");
        } else {
            console.warn("ESP_Server RECONECTADO ao broker MQTT do HiveMQ. Re-inscrevendo nos tópicos..."); 
        }

        clientMqtt.subscribe('sensor/+/dados', (err) => {
            if (err) {
                console.error("Erro ao se inscrever no tópico de sensores genéricos:", err);
            } else if (isFirstConnection) {
                console.log("ESP_Server inscrito nos tópicos de sensores (sensor/*/dados).");
            }
        });

        clientMqtt.subscribe('trem/+/sensor/+', (err) => {
            if (err) {
                console.error("Erro ao se inscrever no tópico de sensores de trem:", err);
            } else if (isFirstConnection) { 
                console.log("ESP_Server inscrito nos tópicos de sensores de trem (trem/*/sensor/*).");
            }
        });

        clientMqtt.subscribe('trem/+/gps', (err) => {
            if (err) {
                console.error("Erro ao se inscrever no tópico de GPS de trem:", err);
            } else if (isFirstConnection) { 
                console.log("ESP_Server inscrito nos tópicos de GPS de trem (trem/*/gps).");
            }
        });
        
        isFirstConnection = false; 
    });

    clientMqtt.on('error', (error) => {
        console.error("Erro de conexão do ESP_Server com o HiveMQ MQTT:", error);
    });

    clientMqtt.on('message', async (topic, message) => { 
        console.log(`[ESP_SERVER] Mensagem MQTT recebida no tópico '${topic}':`, message.toString());

        try {
            const dadosRecebidos = JSON.parse(message.toString());

            const partes = topic.split('/');
            if (partes.length >= 3) {
                const nivel = partes[0];
                const identificador = partes[1];
                const subNivel = partes[2];
                const tipoSensor = partes[3];

                if (nivel === 'sensor' && subNivel === 'dados') {
                    const idSensor = identificador;
                    const valor = dadosRecebidos.valor;
                    const timestamp = dadosRecebidos.timestamp || new Date();

                    await salvarLeituraSensorGenerico(idSensor, valor, timestamp);

                } else if (nivel === 'trem' && subNivel === 'sensor' && tipoSensor) {
                    const idTrem = identificador;
                    const tipo = tipoSensor;
                    const valor = dadosRecebidos.valor;
                    const timestamp = dadosRecebidos.timestamp || new Date();

                    await salvarLeituraSensorTrem(idTrem, tipo, valor, timestamp); 

                } else if (nivel === 'trem' && subNivel === 'gps') {
                    const idTrem = identificador;
                    const latitude = dadosRecebidos.latitude;
                    const longitude = dadosRecebidos.longitude;
                    const velocidade = dadosRecebidos.velocidade;
                    const timestamp = dadosRecebidos.timestamp || new Date();

                    if (latitude !== undefined && longitude !== undefined) {
                        await atualizarPosicaoTremNoBanco(idTrem, latitude, longitude, velocidade, timestamp);
                    } else {
                        console.warn("[ESP_SERVER] Dados de GPS incompletos recebidos:", dadosRecebidos);
                    }
                } else {
                    console.warn("[ESP_SERVER] Tópico MQTT não reconhecido ou incompleto:", topic);
                }
            } else {
                console.warn("[ESP_SERVER] Tópico MQTT fora do padrão esperado (ex: sensor/X/dados, trem/X/sensor/Y, trem/X/gps):", topic);
            }
        } catch (parseError) {
            console.error("[ESP_SERVER] Erro ao processar mensagem MQTT (não é JSON ou formato inválido):", parseError, "Mensagem:", message.toString());
        }
    });
}


async function verificarAlertas(db, idSensor, valorLido) {
    const sqlRegras = `
        SELECT id_alerta, tipo_alerta, valor_limite 
        FROM alertas 
        WHERE id_sensor = $1 AND ativo = TRUE;
    `;
    const regras = await db.query(sqlRegras, [idSensor]);

    if (regras.rowCount === 0) {
        return; // Sem regras ativas
    }

    for (const regra of regras.rows) {
        const { id_alerta, valor_limite } = regra;
        const limite = parseFloat(valor_limite);
        const valor = parseFloat(valorLido);
        
        let alertaDisparado = false;
        
        if (valor > limite) {
            alertaDisparado = true;
        } 
        

        if (alertaDisparado) {
            const sqlRegistrarOcorrencia = `
                INSERT INTO ocorrencias_alertas (id_alerta, valor_lido)
                VALUES ($1, $2);
            `;

            await db.query(sqlRegistrarOcorrencia, [id_alerta, valorLido]);
            console.warn(`\n!!! ALERTA DISPARADO !!! Regra ID ${id_alerta} violada no Sensor ${idSensor}: Valor Lido (${valorLido}) > Limite (${limite}).\n`);
        }
    }
}



async function salvarLeituraSensorTrem(idTrem, tipo, valor, timestamp) {
    let db;
    let id_sensor_cadastrado = null;
    
    try {
        db = await conectar();

        const sqlBuscaIdSensor = `
            SELECT id_sensor 
            FROM sensores 
            WHERE id_trem = $1 AND tipo_sensor = $2;
        `;
        const resultadoBusca = await db.query(sqlBuscaIdSensor, [parseInt(idTrem), tipo]);

        if (resultadoBusca.rowCount === 0) {
            console.warn(`[ESP_SERVER] Leitura ignorada: Sensor de Trem (ID ${idTrem}, Tipo ${tipo}) não cadastrado na tabela 'sensores'.`);
            return;
        }
        
        id_sensor_cadastrado = resultadoBusca.rows[0].id_sensor;

        const queryLeitura = `
            INSERT INTO leituras_sensores (id_trem, tipo_sensor, valor, timestamp_leitura)
            VALUES ($1, $2, $3, $4)
        `;
        const paramsLeitura = [parseInt(idTrem), tipo, valor, timestamp]; 
        await db.query(queryLeitura, paramsLeitura);
        console.log(`[ESP_SERVER] Leitura de sensor de trem salva: Trem ${idTrem}, Tipo ${tipo}, Valor ${valor}`);



        await verificarAlertas(db, id_sensor_cadastrado, valor);

    } catch (erro) {
        console.error("[ESP_SERVER] Erro ao salvar leitura ou verificar alertas no banco:", erro);
    } finally {
        if (db) {
            await db.end();
        }
    }
}

async function salvarLeituraSensorGenerico(idSensor, valor, timestamp) {
    let db;
    try {
        db = await conectar();

        const query = `
            INSERT INTO leituras_sensores (id_sensor, tipo_sensor, valor, timestamp_leitura)
            VALUES ($1, 'desconhecido', $2, $3)
        `;
        const params = [idSensor, valor, timestamp]; 

        await db.query(query, params);
        console.log(`[ESP_SERVER] Leitura de sensor genérico salva: Sensor ${idSensor}, Valor ${valor}`);


    } catch (erro) {
        console.error("[ESP_SERVER] Erro ao salvar leitura do sensor genérico no banco:", erro);
    } finally {
        if (db) {
            await db.end();
        }
    }
}

export { iniciarServidorEsp };