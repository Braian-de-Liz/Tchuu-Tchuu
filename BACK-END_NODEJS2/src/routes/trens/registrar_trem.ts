// BACK-END_NODEJS2\src\routes\trens\registrar_trem.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface dados_trem {
    nomeTrem: string;
    numero: string;
    fabricante: string;
    cpfUser: string;
    dataRegistro: string;
}

const Schema_trem: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['nomeTrem', 'numero', 'fabricante', 'cpfUser', 'dataRegistro'],
            properties: {
                nomeTrem: { type: 'string', description: 'Nome comercial ou modelo do trem.', minLength: 3, maxLength: 100 },
                numero: { type: 'string', description: 'Número de registro ou identificação do trem.', minLength: 1, maxLength: 50 },
                fabricante: { type: 'string', description: 'Nome do fabricante do trem.', minLength: 3, maxLength: 100 },
                cpfUser: { type: 'string', description: 'CPF do usuário que está registrando este trem.', pattern: '^\\d{11}$' },
                dataRegistro: { type: 'string', description: 'Data de registro ou aquisição do trem (Formato ISO 8601, ex: YYYY-MM-DD).', format: 'date' }
            },
            additionalProperties: false
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' }
                }
            },
            400: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' }
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
}

const cadastroTREM: FastifyPluginAsync = async (app, option) => {

    app.post<{ Body: dados_trem }>("/trem", Schema_trem, async (request, reply) => {
        const { nomeTrem, numero, fabricante, cpfUser, dataRegistro } = request.body;
        console.log("captando informações do Body");

        try {

            const usuarioExiste = await app.pg.query('SELECT cpf FROM usuarios WHERE cpf = $1', [cpfUser]);

            if (usuarioExiste.rowCount === 0) {
                console.error("usuário não encontrado");
                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'usuário não encontrado'
                });
            }

            console.log("Inserindo trem no banco...");

            await app.pg.query(`INSERT INTO trens (nome_trem, numero, fabricante, cpf_user, data_registro)
                VALUES ($1, $2, $3, $4, $5)`, [nomeTrem, numero, fabricante, cpfUser, dataRegistro]
            );

            console.log("Trem inserido com sucesso!");

            return reply.status(201).send({
                status: 'sucesso',
                mensagem: 'Trem registrado com sucesso!'
            })
        }
        catch (erro) {
            console.error("Erro ao registrar trem: " + erro);
            const dbError = erro as any;

            
            if (dbError.code === '23505') {
                return reply.status(400).send({
                    status: 'erro',
                    mensagem: 'Violação de dado. O número do trem ou registro de fábrica já existe.'
                });
            }

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao registrar o trem.'
            });
        }


    });
}


export default cadastroTREM;