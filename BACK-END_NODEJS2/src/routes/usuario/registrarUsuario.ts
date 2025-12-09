import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import bcrypt from 'bcryptjs'

interface usercadastro {
    nome: string;
    cpf: string;
    email: string;
    senha: string;
    RegistroFun: string;
    dataNasc: string;
}

const schema_cadastro: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['nome', 'cpf', 'email', 'senha', 'RegistroFun', 'dataNasc'],
            properties: {
                nome: { type: 'string', minLength: 2 },
                cpf: { type: 'string', minLength: 11, maxLength: 14, pattern: '^[0-9]+$' },
                email: { type: 'string', format: 'email' },
                senha: { type: 'string', minLength: 8 },
                RegistroFun: { type: 'string' },
                dataNasc: { type: 'string', format: 'date' }
            }
        }
    }
};

const cadastrar_user: FastifyPluginAsync = async (app, options) => {

    app.post<{ Body: usercadastro }>("/usuarios", schema_cadastro, async (request, reply) => {
        const { nome, cpf, email, senha, RegistroFun, dataNasc } = request.body;

        const cpfTRUE: string = cpf.replace(/[^\d]/g, '');
        const dataNascDate = new Date(dataNasc);


        try {
            const buscar_usuario = await app.pg.query("SELECT cpf, email FROM usuarios WHERE cpf = $1 OR email = $2", [cpfTRUE, email]);

            if (buscar_usuario.rowCount !== 0) {
                return reply.status(409).send({
                    status: 'erro',
                    mensagem: 'CPF e ou email já cadastrado.'
                });
            }

            const senha_segura: string = await bcrypt.hash(senha, 10);

            await app.pg.query(
                'INSERT INTO usuarios (nome, cpf, email, senha, registro_fun, data_nasc) VALUES ($1, $2, $3, $4, $5, $6)',
                [nome, cpfTRUE, email, senha_segura, RegistroFun, dataNascDate]
            );

            return reply.status(201).send({
                status: 'sucesso',
                mensagem: 'Usuário cadastrado com sucesso!'
            });
        }
        catch (erro) {
            app.log.error(erro);
            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno no servidor.'
            });
        }

    });
}

export default cadastrar_user;