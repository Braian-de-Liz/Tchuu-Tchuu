// BACK-END_NODEJS2\src\routes\usuario\loginUsuario.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import bcrypt from 'bcryptjs';


interface logar_req {
    email: string
    senha: string
}

const schema_login: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['email', 'senha'],
            properties: {
                email: { type: 'string', format: 'email' },
                senha: { type: 'string', minLength: 8 }
            },
            additionalProperties: false
        }
    }
};


const logar_usario: FastifyPluginAsync = async (app, options) => {

    app.post<{ Body: logar_req }>('/usu_login', schema_login, async (request, reply) => {
        const { email, senha } = request.body;

        try {
            const resultado = await app.pg.query("SELECT id, email, nome, senha, cpf FROM usuarios WHERE email = $1", [email]);

            if (resultado.rows.length === 0) {
                console.error("Usuário não encontrado");

                return reply.status(401).send({
                    status: 'erro',
                    mensagem: 'Email ou senha incorretos.'
                });
            }

            console.log("usuario encontrado");

            const usuario = resultado.rows[0];

            const senhaCerta = await bcrypt.compare(senha, usuario.senha);

            if (!senhaCerta) {
                console.error("Não foi encontrado senha correta no banco de dados");
                return reply.status(401).send({
                    status: 'erro',
                    mensagem: 'Email ou senha incorretos.'
                });
            }


            const payload = {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome,
                cpf: usuario.cpf
            };

            const token = app.jwt.sign(payload, { expiresIn: '24h' });

            return reply.send({
                status: 'sucesso',
                mensagem: 'Login realizado com sucesso!',
                token: token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email,
                    nome: usuario.nome,
                    cpf: usuario.cpf
                }
            });

        }
        catch (erro) {
            console.error('Erro no login:', erro);
            reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor.'
            });
        }
    });
}


export default logar_usario