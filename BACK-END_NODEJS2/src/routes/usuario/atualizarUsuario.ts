import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import bcrypt from 'bcryptjs'

interface alterar_email_senha {
    id: string;
    email?: string;
    senha?: string;
}

const schema_patch: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', pattern: '^[0-9]+$', description: 'ID do usuário logado' },
                email: { type: 'string', format: 'email', description: 'Novo email do usuário' },
                senha: { type: 'string', minLength: 8, description: 'Nova senha do usuário' }
            },
            additionalProperties: false
        }
    }
};

const alterar_user: FastifyPluginAsync = async (app, option) => {

    app.patch<{ Body: alterar_email_senha }>("/usuario", schema_patch, async (request, reply) => {

        const { id, email, senha } = request.body;
        console.log("requisição para alterar email e ou senha");

        if (!email && !senha) {
            return reply.status(400).send({
                status: 'erro',
                mensagem: 'Forneça o email ou a senha para atualizar.'
            });
        }



        try {
            console.log("procurando usuario");
            const consulta = await app.pg.query("SELECT id FROM usuarios WHERE id = $1", [id]);

            if (consulta.rowCount === 0) {
                console.error("usuario não encontrado no banco de dados");

                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Usuário não encontrado.'
                });
            }

            let updates = [];
            let params = [];
            let paramIndex = 1;

            if (email) {
                const checkEmail = await app.pg.query("SELECT id FROM usuarios WHERE email = $1 AND id != $2", [email, id]);

                if (checkEmail.rowCount !== 0) {
                    return reply.status(409).send({
                        status: 'erro',
                        mensagem: 'O novo email já está cadastrado por outro usuário.'
                    });
                }

                updates.push(`email = $${paramIndex}`);
                params.push(email);
                paramIndex++;
            }

            if (senha) {
                const senha_segura = await bcrypt.hash(senha, 10);

                updates.push(`senha = $${paramIndex}`);
                params.push(senha_segura);
                paramIndex++;
            }

            params.push(id);

            const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${paramIndex}`;

            const resultado = await app.pg.query(query, params);

            if (resultado.rowCount === 0) {
                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Falha ao atualizar. Usuário não encontrado ou sem permissão.'
                });
            }

            console.log(`Dados atualizados. Query: ${query}`);

            return reply.status(200).send({
                status: 'sucesso',
                mensagem: 'Dados atualizados com sucesso!'
            });

        }
        catch (erro) {
            console.error("erro ao conectar");

            reply.status(500).send({
                status: 'erro',
                menssagem: 'erro interno, não foi possível atualizar'
            });
        }

    });
}

export default alterar_user;