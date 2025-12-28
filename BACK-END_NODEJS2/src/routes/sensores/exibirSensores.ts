import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface listSensor {
    cpf: string
}


const schema_listarPorCpf: RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            required: ['cpf'],
            properties: {
                cpf: { type: 'string', pattern: '^\\d{11}$', description: 'CPF do usuário para filtrar os resultados.' }
            },
            additionalProperties: false
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' },
                    sensores: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id_sensor: { type: 'integer' },
                                nome_sensor: { type: 'string' },
                                tipo_sensor: { type: 'string' },
                                data_registro: { type: 'string' },
                                nome_trem: { type: 'string' }
                            }
                        }
                    }
                }
            },
            404: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' },
                    sensores: { type: 'array', items: {} }
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


const listar_sensores: FastifyPluginAsync = async (app, optios) => {

    app.get<{ Querystring: listSensor }>("/sensores", schema_listarPorCpf, async (request, reply) => {
        console.log("Rota GET para listar sensores iniciada");
        const { cpf } = request.query;

        const cpfTRUE = cpf.replace(/[^\d]/g, '');
        console.log("CPF limpo de qualquer ponto ou traço");

        try {
            const sql: string = `
            SELECT 
                s.id_sensor,
                s.nome_sensor,
                s.tipo_sensor,
                s.data_registro,
                t.nome_trem 
            FROM sensores s JOIN trens t ON s.id_trem = t.id WHERE s.cpf_user = $1 ORDER BY s.id_sensor;`;

            console.log("iniciando procura pelos sensores do usuário no banco de dados");
            const resultado = await app.pg.query(sql, [cpfTRUE]);

            if (resultado.rowCount === 0) {
                console.error("sensores do usuário não encontrado");

                return reply.status(404).send({
                    status: 'sucesso',
                    mensagem: 'Nenhum sensor cadastrado para este usuário.',
                    sensores: []
                });
            }

            return reply.status(200).send({
                status: 'sucesso',
                mensagem: `${resultado.rows.length} sensores encontrados.`,
                sensores: resultado.rows
            });
        }
        catch (erro) {
            console.error("Erro ao buscar sensores no banco de dados:", erro);

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao tentar listar sensores.'
            });
        }
    });
}


export default listar_sensores;