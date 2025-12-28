// BACK-END_NODEJS2\src\routes\usuario\deletarUsuario.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface req_deleteuser {
    cpf: string;
    id: string;
}


const Schema_deletaruser: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['cpf', 'id'],
            properties: {
                cpf: { type: 'string', pattern: '^[0-9]{11}$' },
                id: { type: 'string', pattern: "^[0-9]+$" }
            },
            additionalProperties: false
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' }
                }
            },
            403: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' }
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


const deletar_user: FastifyPluginAsync = async (app, option) => {

    app.delete<{ Body: req_deleteuser }>("/usuarios", Schema_deletaruser, async (request, reply) => {
        console.log("usuario solicita delete")
        const { cpf, id } = request.body;

        const fundadores: string[] = [1, 5, 49, 14].map(String);
        console.log("garantindo que o usuario não seja um dos fundadores");

        if (fundadores.includes(String(id))) {
            console.error("Não pode deletar os fundadores");

            return reply.status(403).send({
                status: 'proteção',
                mensagem: 'Impossível deletar esse usuário, ele é um fundador do tchuu-tchuu.'
            });

        }

        try {
            const resultado = await app.pg.query("DELETE FROM usuarios WHERE id = $1 AND cpf = $2 RETURNING id", [id, cpf]);
            console.log("procurando usuário no banco de dados");

            if (resultado.rowCount === 0) {
                console.error("usuario não encontrado");

                reply.status(404).send({
                    status: 'erro',
                    menssagem: 'Usuário não encontrado.'
                })
            }

            reply.status(200).send({
                status: 'sucesso',
                mensagem: 'Usuário excluído com sucesso !'
            });
            console.log("usuario encontrado e deletado");
        }
        catch (erro) {
            console.error('Erro ao excluir usuário:', erro);
            reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao tentar excluir o usuário..'
            });
        }

    });
}


export default deletar_user;