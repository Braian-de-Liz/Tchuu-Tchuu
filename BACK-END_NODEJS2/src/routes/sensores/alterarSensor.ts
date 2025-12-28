// BACK-END_NODEJS2\src\routes\sensores\alterarSensor.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";


interface req_atualizarSensor {
    cpf_user: string;
    nome_sensor: string;
    nome_novo: string;
    TipoSensor_novo: string;
}

const schema_atualizarSensor: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['cpf_user', 'nome_sensor'],
            properties: {
                cpf_user: { type: 'string', pattern: '^\\d{11}$', description: 'CPF do usuário proprietário do sensor.' },
                nome_sensor: { type: 'string', description: 'Nome atual do sensor que será atualizado.' },
                nome_novo: { type: 'string', description: 'O novo nome a ser atribuído ao sensor.' },
                TipoSensor_novo: { type: 'string', description: 'O novo tipo de medição a ser atribuído ao sensor (Ex: Voltagem).' }
            },
            additionalProperties: false,
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' },
                    sensor: {
                        type: 'object',
                        properties: {
                            id_sensor: { type: 'integer' },
                            nome_sensor: { type: 'string' },
                            tipo_sensor: { type: 'string' },
                            id_trem: { type: 'integer' },
                            data_registro: { type: 'string' },
                            cpf_user: { type: 'string' }
                        }
                    }
                }
            },
            '4xx': {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' }
                }
            }
        }
    }
};


const alterarSensor: FastifyPluginAsync = async (app, options) => {

    app.patch<{ Body: req_atualizarSensor }>("/sensores", schema_atualizarSensor, async (request, reply) => {

        console.log("rota de patch dos sensores iniciados");
        const { cpf_user, nome_sensor, nome_novo, TipoSensor_novo } = request.body;
        
        const cpf_limpo = cpf_user.replace(/[^\d]/g, '');

        let resultado;
        try {
            const sql: string = `UPDATE sensores SET nome_sensor = $1, tipo_sensor = $4 WHERE nome_sensor = $2 AND cpf_user = $3 RETURNING *;`;

            const params: string[] = [nome_novo, nome_sensor, cpf_limpo, TipoSensor_novo];

            resultado = await app.pg.query(sql, params);
            if (resultado.rowCount === 0) {
                console.log("sensor não encontrado");

                return reply.status(404).send({
                    status: 'erro',
                    mensagem: `Sensor '${nome_sensor}' não encontrado`
                });
            }

            return reply.status(200).send({
                status: 'sucesso',
                mensagem: `Sensor '${nome_sensor}' renomeado com sucesso para '${nome_novo}'.`,
                sensor: resultado.rows[0]
            });
        }
        catch (erro) {
            console.error("Erro ao atualizar o sensor no banco de dados:", erro);

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao tentar atualizar o sensor.'
            });
        }
    })
}

export default alterarSensor;