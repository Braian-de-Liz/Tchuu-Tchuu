// BACK-END_NODEJS2/src/routes/rotas_e_estacoes/excluirEstacao.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import { autenticarJWT } from "../../hooks/autenticar_id_jwt.js";
import { PoolClient } from "pg"; // Importa o tipo do cliente do pool

interface DecodedUser {
    id: string; // Esperamos ID como string do JWT
}

interface ParamsID {
    id: string; // ID da estação da URL
}

const deletarEstacaoOptions: RouteShorthandOptions = {
    preHandler: autenticarJWT,
}

const excluirEstacao: FastifyPluginAsync = async (app, options) => {

    app.delete<{ Params: ParamsID }>("/estacoes/:id", deletarEstacaoOptions, async (request, reply) => {

        const idEstacao = parseInt(request.params.id);
        const idUsuarioLogadoString = (request.user as DecodedUser).id;
        const idUsuarioLogado = idUsuarioLogadoString;



        let client: PoolClient | null = null; 

        try {
            client = await app.pg.connect();
            await client.query('BEGIN'); 

            const checkUser = await client.query('SELECT id_usuario_criador FROM estacoes WHERE id = $1', [idEstacao]);

            if (checkUser.rowCount === 0) {
                await client.query('ROLLBACK');
                return reply.status(404).send({ status: 'erro', mensagem: 'Estação não encontrada.' });
            }

            if (checkUser.rows[0].id_usuario_criador !== idUsuarioLogado) {
                await client.query('ROLLBACK');
                return reply.status(403).send({ status: 'erro', mensagem: 'Você não tem permissão para excluir esta estação.' });
            }

            const queryUso: string = 'SELECT COUNT(*) FROM rota_estacoes WHERE id_estacao = $1';
            const resultadoUso = await client.query(queryUso, [idEstacao]);

            if (parseInt(resultadoUso.rows[0].count) > 0) {
                await client.query('ROLLBACK');
                return reply.status(400).send({
                    status: 'erro',
                    mensagem: 'Não é possível excluir a estação pois ela está sendo usada em uma ou mais rotas.'
                });
            }

            const queryDelete: string = 'DELETE FROM estacoes WHERE id = $1 AND id_usuario_criador = $2';
            const resultadoDelete = await client.query(queryDelete, [idEstacao, idUsuarioLogado]);

            if (resultadoDelete.rowCount === 0) {
                await client.query('ROLLBACK');
                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Estação não encontrada ou falha na exclusão.'
                });
            }

            await client.query('COMMIT');

            return reply.status(200).send({
                status: 'sucesso',
                mensagem: 'Estação excluída com sucesso!',
                id: idEstacao
            });


        } catch (erro) {
            if (client) {
                await client.query('ROLLBACK').catch(rollbackErr => {
                    app.log.error(rollbackErr, 'Erro ao tentar ROLLBACK da exclusão de estação.');
                });
            }

            app.log.error(erro, 'Erro ao excluir estação');

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao excluir a estação.'
            });

        } finally {
            if (client) {
                client.release();
            }
        }
    });
}

export default excluirEstacao;