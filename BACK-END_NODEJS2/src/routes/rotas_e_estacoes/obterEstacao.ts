import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import { autenticarJWT } from "../../hooks/autenticar_id_jwt.js";


interface DecodedUser {
    id: number;
}

const ObterEstacoesOptions: RouteShorthandOptions = {
    preHandler: autenticarJWT,
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nome: { type: 'string' },
                        endereco: { type: 'string' },
                        latitude: { type: 'number' },
                        longitude: { type: 'number' },
                        cidade: { type: 'string' },
                        estado: { type: 'string' },
                        data_criacao: { type: 'string' }
                    }
                }
            },
            404: {
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
};

const obterEstacoes: FastifyPluginAsync = async (app, options) => {


    app.get("/estacoes", ObterEstacoesOptions, async (request, reply) => {

        const idUsuarioLogado: number = (request.user as DecodedUser).id;

        try {
            const sql: string = `
                SELECT id, nome, endereco, latitude, longitude, cidade, estado, data_criacao
                FROM estacoes
                WHERE id_usuario_criador = $1 
                ORDER BY nome
            `;

            const consulta = await app.pg.query(sql, [idUsuarioLogado]);

            if (consulta.rowCount === 0) {
                app.log.warn("estações do usuário não encontradas, ou não existentes");

                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'estações do usuário não encontradas, ou não existentes'
                })
            }

            return reply.status(200).send(consulta.rows);
        }
        catch (erro) {

            app.log.error(erro, 'Erro ao obter estações do usuário');

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao obter as estações.'
            });

        }
    });
}

export default obterEstacoes;