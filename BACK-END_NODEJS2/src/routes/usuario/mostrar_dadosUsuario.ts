import { FastifyPluginAsync } from "fastify";
import { autenticarJWT } from '../../hooks/autenticar_id_jwt.js';

const schema_mostrar_usuario = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    usuario: {
                        type: 'object',
                        properties: {
                            nome: { type: 'string' },
                            cpf: { type: 'string' },
                            email: { type: 'string' },
                            data_nasc: { type: 'string' },
                            registro_fun: { type: 'string' }
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

const Mostrar_usuario: FastifyPluginAsync = async (app, options) => {

    app.get("/usuario_get", { preHandler: [autenticarJWT], ...schema_mostrar_usuario }, async (request, reply) => {
        const usuarioId: string = (request.user as { id: string }).id;

        try {
            const resultado = await app.pg.query(
                'SELECT nome, cpf, email, data_nasc, registro_fun FROM usuarios WHERE id = $1',
                [usuarioId]
            );

            if (resultado.rows.length === 0) {
                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Usuário não encontrado.'
                });
            }

            return reply.send({
                status: 'sucesso',
                usuario: resultado.rows[0]
            });
        }
        catch (erro) {
            app.log.error(erro);
            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor.'
            });
        }
    });
}

export default Mostrar_usuario;