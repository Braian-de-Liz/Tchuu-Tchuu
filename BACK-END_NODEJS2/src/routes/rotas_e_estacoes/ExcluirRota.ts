// BACK-END_NODEJS2\src\routes\rotas_e_estacoes\ExcluirRota.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import { autenticarJWT } from "../../hooks/autenticar_id_jwt.js";
import { PoolClient } from "pg";

interface DecodedUser {
    id: string;
}

interface ParamsID {
    id: string;
}

const deletarRotaOptions: RouteShorthandOptions = {
    preHandler: autenticarJWT,
    schema: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', pattern: '^[0-9]+$', description: 'ID numérico da rota' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' },
                    id: { type: 'integer' }
                }
            },
            404: {
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
}
const ExcluirRota: FastifyPluginAsync = async (app, options) => {

    app.delete<{ Params: ParamsID }>("/rotas/:id", deletarRotaOptions, async (request, reply) => {
        const idRota = parseInt(request.params.id);
        const idUsuarioLogado = (request.user as DecodedUser).id;

        let client: PoolClient | null = null;

        try {
            client = await app.pg.connect();
            await client.query('BEGIN');

            const checkRota = await client.query(
                'SELECT id FROM rotas WHERE id = $1 AND id_usuario_criador = $2',
                [idRota, idUsuarioLogado]
            );

            if (checkRota.rowCount === 0) {
                await client.query('ROLLBACK');
                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Rota não encontrada ou você não tem permissão para excluí-la.'
                });
            }

            const queryDeleteAssoc = 'DELETE FROM rota_estacoes WHERE id_rota = $1';
            await client.query(queryDeleteAssoc, [idRota]);

            const queryDeleteRota = 'DELETE FROM rotas WHERE id = $1';
            await client.query(queryDeleteRota, [idRota]);

            await client.query('COMMIT');

            return reply.status(200).send({
                status: 'sucesso',
                mensagem: 'Rota excluída com sucesso!',
                id: idRota
            });

        } catch (erro) {
            if (client) await client.query('ROLLBACK');
            
            app.log.error(erro, 'Erro ao excluir rota');

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao excluir a rota.'
            });
        } finally {
            if (client) client.release();
        }
    })
}

export default ExcluirRota;