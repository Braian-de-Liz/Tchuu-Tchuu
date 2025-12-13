// BACK-END_NODEJS/src/connections/ESP_Server.ts

import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import * as mqtt from 'mqtt';
import type { MqttClient, IClientOptions } from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

interface CustomFastifyInstance extends FastifyInstance {
    pg: any; 
}

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

let clientMqtt: MqttClient | null = null;
let isFirstConnection = true;
const CLIENT_ID = `tchuu-tchuu-server-${Math.random().toString(16).substring(2, 10)}`;


async function verificarAlertas(app: CustomFastifyInstance, idSensor: number, valorLido: string | number): Promise<void> {
    const sql = `
        SELECT id_alerta, valor_limite
        FROM alertas
        WHERE id_sensor = $1 AND ativo = TRUE AND tipo_alerta = 'acima_limite';
    `;

    try {
        const regras = await app.pg.pool.query(sql, [idSensor]);

        if (regras.rowCount === 0) return;

        for (const regra of regras.rows) {
            const limite = parseFloat(regra.valor_limite);
            const valor = typeof valorLido === 'string' ? parseFloat(valorLido) : valorLido;

            if (valor > limite) {
                await app.pg.pool.query(
                    `INSERT INTO ocorrencias_alertas (id_alerta, valor_lido) VALUES ($1, $2)`,
                    [regra.id_alerta, valorLido]
                );

                app.log.warn(`Alerta disparado no sensor ${idSensor}: ${valor} > ${limite}`);
            }
        }
    } catch (error) {
        app.log.error({ err: error }, `Erro ao verificar alertas para o sensor ${idSensor}`);
    }
}

async function salvarLeituraSensorTrem(
    app: CustomFastifyInstance,
    idTrem: string,
    tipo: string,
    valor: string | number,
    timestamp: string | Date
): Promise<void> {

    try {
        const result = await app.pg.pool.query(
            `SELECT id_sensor FROM sensores WHERE id_trem = $1 AND tipo_sensor = $2`,
            [parseInt(idTrem), tipo]
        );

        if (result.rowCount === 0) {
            app.log.warn(`[ESP_SERVER] Sensor não encontrado: Trem ${idTrem}, Tipo ${tipo}`);
            return;
        }

        const idSensor = result.rows[0].id_sensor;

        await app.pg.pool.query(
            `INSERT INTO leituras_sensores (id_trem, tipo_sensor, valor, timestamp_leitura)
             VALUES ($1, $2, $3, $4)`,
            [parseInt(idTrem), tipo, valor, timestamp]
        );

        await verificarAlertas(app, idSensor, valor);

    } catch (err) {
        app.log.error({ err }, "[ESP_SERVER] Erro ao salvar leitura de trem");
    }
}

async function salvarLeituraSensorGenerico(
    app: CustomFastifyInstance,
    idSensor: string,
    valor: string | number,
    timestamp: string | Date
): Promise<void> {

    try {
        await app.pg.pool.query(
            `INSERT INTO leituras_sensores (id_sensor, tipo_sensor, valor, timestamp_leitura)
             VALUES ($1, 'desconhecido', $2, $3)`,
            [parseInt(idSensor), valor, timestamp]
        );
    } catch (err) {
        app.log.error({ err }, "[ESP_SERVER] Erro ao salvar sensor genérico");
    }
}

async function atualizarPosicaoTremNoBanco(
    app: CustomFastifyInstance,
    idTrem: string,
    lat: number,
    lon: number,
    vel: number,
    timestamp: string | Date
): Promise<void> {

    try {
        await app.pg.pool.query(
            `UPDATE trens 
             SET latitude=$1, longitude=$2, velocidade=$3, timestamp_posicao=$4
             WHERE id_trem=$5`,
            [lat, lon, vel, timestamp, parseInt(idTrem)]
        );
    } catch (err) {
        app.log.error({ err }, `[ESP_SERVER] Erro ao atualizar GPS do trem ${idTrem}`);
    }
}



const espServerPlugin: FastifyPluginAsync = async (app, _opts) => {
    const fastifyApp = app as CustomFastifyInstance;

    if (!MQTT_BROKER_URL || !MQTT_USERNAME || !MQTT_PASSWORD) {
        fastifyApp.log.error("Variáveis MQTT não configuradas no .env");
        return;
    }

    fastifyApp.log.info("Conectando ao broker MQTT...");

    const mqttOptions: IClientOptions = {
        clientId: CLIENT_ID,
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        clean: true,
        connectTimeout: 4000
    };

    const connectFn = mqtt.connect || (mqtt as any).default?.connect;
    if (typeof connectFn !== 'function') {
        throw new Error("Função connect do MQTT não encontrada.");
    }

    clientMqtt = connectFn(MQTT_BROKER_URL, mqttOptions);

    clientMqtt.on("connect", () => {
        if (isFirstConnection) {
            fastifyApp.log.info("ESP_Server conectado ao broker MQTT!");
        } else {
            fastifyApp.log.warn("ESP_Server reconectado. Reinscrevendo tópicos...");
        }

        const topics = ["sensor/+/dados", "trem/+/sensor/+", "trem/+/gps"];

        clientMqtt!.subscribe(topics, (err) => {
            if (err) {
                fastifyApp.log.error({ err }, "Erro no subscribe MQTT");
            } else {
                fastifyApp.log.info(`Inscrito nos tópicos: ${topics.join(', ')}`);
            }
        });

        isFirstConnection = false;
    });

    clientMqtt.on("error", (err) => {
        fastifyApp.log.error({ err }, "Erro MQTT");
    });

    clientMqtt.on("message", async (topic: string, payload: Buffer) => {
        try {
            const mensagemString = payload.toString();
            const json = JSON.parse(mensagemString);
            const partes = topic.split("/");

            if (partes.length < 3) return;

            const nivel = partes[0];
            const id = partes[1]; 
            const sub = partes[2];
            const tipoSensor = partes[3];

            if (!id) {
                fastifyApp.log.warn(`Tópico inválido ou ID ausente: ${topic}`);
                return;
            }

            if (nivel === "sensor" && sub === "dados") {
                await salvarLeituraSensorGenerico(fastifyApp, id, json.valor, json.timestamp);
            }

            else if (nivel === "trem" && sub === "sensor" && tipoSensor) {
                await salvarLeituraSensorTrem(fastifyApp, id, tipoSensor, json.valor, json.timestamp);
            }

            else if (nivel === "trem" && sub === "gps") {
                if (json.latitude != null && json.longitude != null) {
                    await atualizarPosicaoTremNoBanco(
                        fastifyApp,
                        id,
                        json.latitude,
                        json.longitude,
                        json.velocidade,
                        json.timestamp
                    );
                }
            }

        } catch (err) {
            fastifyApp.log.error({ err }, `[ESP_SERVER] Erro ao processar mensagem do tópico ${topic}`);
        }
    });

    fastifyApp.addHook("onClose", async () => {
        if (clientMqtt) {
            await new Promise<void>((resolve) => {
                clientMqtt!.end(false, () => {
                    fastifyApp.log.info("Conexão MQTT encerrada.");
                    resolve();
                });
            });
        }
    });
};

export default fp(espServerPlugin, {
    name: "esp-mqtt-server",
    dependencies: ["pg"]
});