// BACK-END_NODEJS/src/modulos/ESP_Server.js (ou src/extra/ESP_Server.js, como tu tiver)
import mqtt from 'mqtt';
import { conectar } from '../databases/conectar_banco.js';
import dotenv from 'dotenv';

dotenv.config();
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

let clientMqtt = null;

function iniciarServidorEsp() {
    if (!MQTT_BROKER_URL || !MQTT_USERNAME || !MQTT_PASSWORD) {
        console.error("Erro: Variáveis de ambiente MQTT_BROKER_URL, MQTT_USERNAME ou MQTT_PASSWORD não definidas.");
        return;
    }

    console.log("Tentando conectar o ESP_Server ao broker MQTT do HiveMQ...");

    const options = {
        clientId: 'tchuu-tchuu-esp-server-nodejs',
        clean: true,
        connectTimeout: 4000,
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,

    };

    clientMqtt = mqtt.connect(MQTT_BROKER_URL, options);

    clientMqtt.on('connect', () => {
        console.log("ESP_Server conectado ao broker MQTT do HiveMQ com sucesso!");

        clientMqtt.subscribe('sensor/+/dados', (err) => {
            if (err) {
                console.error("Erro ao se inscrever no tópico de sensores genéricos:", err);
            } else {
                console.log("ESP_Server inscrito nos tópicos de sensores (sensor/*/dados).");
            }
        });


        clientMqtt.subscribe('trem/+/sensor/+', (err) => {
            if (err) {
                console.error("Erro ao se inscrever no tópico de sensores de trem:", err);
            } else {
                console.log("ESP_Server inscrito nos tópicos de sensores de trem (trem/*/sensor/*).");
            }
        });

        clientMqtt.subscribe('trem/+/gps', (err) => {
            if (err) {
                console.error("Erro ao se inscrever no tópico de GPS de trem:", err);
            } else {
                console.log("ESP_Server inscrito nos tópicos de GPS de trem (trem/*/gps).");
            }
        });


    });

    clientMqtt.on('error', (error) => {
        console.error("Erro de conexão do ESP_Server com o HiveMQ MQTT:", error);
    });

    clientMqtt.on('message', async (topic, messageBuffer) => {
        console.log(`[ESP_SERVER] Mensagem MQTT recebida no tópico '${topic}':`, messageBuffer.toString());

        try {

            const dadosRecebidos = JSON.parse(messageBuffer.toString());

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
            console.error("[ESP_SERVER] Erro ao processar mensagem MQTT (não é JSON ou formato inválido):", parseError, "Mensagem:", messageBuffer.toString());

        }
    });


}

async function salvarLeituraSensorGenerico(idSensor, valor, timestamp) {
    let db;
    try {
        db = await conectar();


        const query = `
            INSERT INTO leituras_sensores (id_sensor, tipo_sensor, valor, timestamp_leitura)
            VALUES ($1, 'desconhecido', $2, $3) -- 'desconhecido' como tipo padrão, ou tu pode inferir de outro lugar
        `;
        const params = [parseInt(idSensor), valor, timestamp];

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

async function salvarLeituraSensorTrem(idTrem, tipo, valor, timestamp) {
    let db;
    try {
        db = await conectar();

        const query = `
            INSERT INTO leituras_sensores (id_trem, tipo_sensor, valor, timestamp_leitura)
            VALUES ($1, $2, $3, $4)
        `;
        const params = [parseInt(idTrem), tipo, valor, timestamp];

        await db.query(query, params);
        console.log(`[ESP_SERVER] Leitura de sensor de trem salva: Trem ${idTrem}, Tipo ${tipo}, Valor ${valor}`);

    } catch (erro) {
        console.error("[ESP_SERVER] Erro ao salvar leitura do sensor de trem no banco:", erro);
    } finally {
        if (db) {
            await db.end();
        }
    }
}

async function atualizarPosicaoTremNoBanco(idTrem, latitude, longitude, velocidade, timestamp) {
    let db;
    try {
        db = await conectar();

        const query = `
            UPDATE trens
            SET latitude_atual = $1, longitude_atual = $2, velocidade_atual = $3, ultima_atualizacao_gps = $4
            WHERE id = $5
        `;
        const params = [latitude, longitude, velocidade || null, timestamp, parseInt(idTrem)];

        const resultado = await db.query(query, params);

        if (resultado.rowCount === 0) {
            console.warn(`[ESP_SERVER] Trem com ID ${idTrem} não encontrado para atualizar posição.`);
        } else {
            console.log(`[ESP_SERVER] Posição do trem ${idTrem} atualizada: Lat ${latitude}, Lng ${longitude}, Vel ${velocidade}`);
        }

    } catch (erro) {
        console.error("[ESP_SERVER] Erro ao atualizar posição do trem no banco:", erro);
    } finally {
        if (db) {
            await db.end();
        }
    }
}


export { iniciarServidorEsp };