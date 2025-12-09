// src/routes/usuario/mostrar_dadosUsuario.ts
import { FastifyPluginAsync } from "fastify";
import { autenticarJWT } from '../../hooks/autenticar_id_jwt.js';


const Mostrar_usuario: FastifyPluginAsync = async (app, options) => {

    app.get("/usuario_get", { preHandler: [autenticarJWT] }, async (request, reply) => {
        const usuarioId: string = (request.user as { id: string }).id;

        try {
            const resultado = await app.pg.query(
                'SELECT nome, cpf, email, data_nasc, registro_fun FROM usuarios WHERE id = $1',
                [usuarioId]
            );

            if (resultado.rows.length === 0) {
                console.error("usuario não encontrado no banco de dados");

                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Usuário não encontrado.'
                });
            }

            reply.send({
                status: 'sucesso',
                usuario: resultado.rows[0]
            });
            console.log("usuário encontrado e enviado");
        }
        catch (erro) {
            console.error('Erro ao buscar dados do usuário:', erro);
            reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor.'
            });

        }
    })
}

export default Mostrar_usuario;