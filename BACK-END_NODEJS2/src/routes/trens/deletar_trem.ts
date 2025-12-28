// BACK-END_NODEJS2\src\routes\trens\deletar_trem.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface query_deleteTrem {
    cpf_user: string;
    nome_trem: string;
}

const schema_tremDEL: RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            required: ['cpf_user', 'nome_trem'],
            properties: {
                cpf_user: { type: 'string', pattern: '^\\d{11}$' },
                nome_trem: { type: 'string', minLength: 1 }
            },
            additionalProperties: false
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    menssagem: { type: 'string' }
                }
            },
            '4xx': {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    menssagem: { type: 'string' }
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
}

const deletar_trem: FastifyPluginAsync = async (app, options) => {

    app.delete<{ Querystring: query_deleteTrem }>("/trens", schema_tremDEL, async (request, reply) => {
        const { cpf_user, nome_trem } = request.query;

        try {
            const sql: string = "DELETE FROM trens WHERE cpf_user = $1 AND nome_trem = $2";
            const valores: string[] = [cpf_user, nome_trem];

            const consulta = await app.pg.query(sql, valores);

            if (consulta.rowCount === 0) {
                console.error("Trem não encontrado");

                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'Trem não encontrado'
                });
            }

            return reply.status(200).send({
                status: "sucesso",
                menssagem: "trem deletado com sucesso"
            })
        }
        catch (erro) {
            console.error("Erro, não foi possível deletar trem", erro);

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno desse servidor que alunos do ensino médio programaram'
            });
        }

    })
}

export default deletar_trem;