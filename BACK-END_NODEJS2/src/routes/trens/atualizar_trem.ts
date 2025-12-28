// BACK-END_NODEJS2\src\routes\trens\atualizar_trem.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface req_atuaTrem {
    cpf_user: string;
    nome_trem: string;
    novoNome_trem: string;
}

const schema_atuaTrem: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['cpf_user', 'nome_trem', 'novoNome_trem'],
            properties: {
                cpf_user: { type: 'string', description: 'CPF do usuário proprietário do trem.', pattern: '^\\d{11}$' },
                nome_trem: { type: 'string', description: 'Nome do trem associado.', minLength: 1 },
                novoNome_trem: { type: 'string', minLength: 1 }
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

const atualizarTrem: FastifyPluginAsync = async (app, option) => {

    app.patch<{ Body: req_atuaTrem }>("/trens", schema_atuaTrem, async (request, reply) => {
        const { cpf_user, nome_trem, novoNome_trem } = request.body;

        try {
            const consulta = await app.pg.query("SELECT 1 FROM trens WHERE cpf_user = $1 AND nome_trem = $2", [cpf_user, nome_trem]);

            if (consulta.rowCount === 0) {
                return reply.status(404).send({
                    status: 'erro',
                    menssagem: `trem "${nome_trem}", não encontrado ou não pertence ao usuário.`
                })
            }


            await app.pg.query("UPDATE trens SET nome_trem = $1 WHERE cpf_user = $2 AND nome_trem = $3", [novoNome_trem, cpf_user, nome_trem]);

            return reply.status(200).send({
                status: 'sucesso',
                menssagem: `Trem atualizado de "${nome_trem}" para "${novoNome_trem}", com sucesso!`
            })

        }
        catch (erro) {
            console.error("Erro ao tentar atualizar trem", erro);

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao tentar atualizar o trem.'
            });
        }

    })
}

export default atualizarTrem;