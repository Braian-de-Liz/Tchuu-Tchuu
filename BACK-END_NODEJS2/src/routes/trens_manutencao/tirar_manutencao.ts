import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface req_tirarManu {
    nome_trem: string;
    cpf_user: string;
}

const schemaAuth: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['nome_trem', 'cpf_user'],
            properties: {
                nome_trem: { type: 'string', description: 'Nome do trem para remover o chamado.' },
                cpf_user: { type: 'string', description: 'CPF do usuário proprietário.', pattern: '^\\d{11}$' }
            },
            additionalProperties: false
        }
    }
}

const tirar_trem_manu: FastifyPluginAsync = async (app, optins) => {

    app.delete<{ Body: req_tirarManu }>("/manutencao", schemaAuth, async (request, reply) => {

        const { nome_trem, cpf_user } = request.body;
        console.log("dados recebidos com sucesso");

        const cpf_limpo = cpf_user.replace(/[^\d]/g, '');
        console.log("cpf limpo de pontos caso já não estivesse");

        try {
            const consulta = await app.pg.query("SELECT id FROM trens WHERE nome_trem = $1 AND cpf_user = $2", [nome_trem, cpf_limpo]);
            console.log("procurando o trem em manutenção no banco de dados");

            if (consulta.rowCount === 0) {
                console.error("DB RESULTADO: 0 linhas afetadas. Retornando 404 (Trem em manutenção não encontrado).");

                return reply.status(404).send({
                    status: 'erro',
                    messagem: "Trem em manutenção não encontrado"
                });
            }

            const id_trem = consulta.rows[0].id;

            const query_delete: string = `
            DELETE FROM chamados_manutencao 
            WHERE cpf_usuario_abertura = $1 AND id_trem = $2;`;

            const params_delete: (string | number)[] = [cpf_limpo, id_trem];

            const resultado_delete = await app.pg.query(query_delete, params_delete);
            console.log("trem procurando trem para deletar")

            if (resultado_delete.rowCount === 0) {
                 console.error("Chamado de manutenção não encontrado para o trem.");

                 return reply.status(404).send({
                    status: 'erro',
                    messagem: "Chamado de manutenção não encontrado para este trem."
                });
            }

            console.log("trem deleta com sucesso");
            return reply.status(201).send({
                status: "sucesso",
                menssagem: "Trem em manutenção tirado da manutenção com sucesso"
            });
        }
        catch (erro) {
            console.error("Erro, não foi possível deletar trem", erro);

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno desse servidor que alunos do ensino médio programaram'
            });
        }

    });
}

export default tirar_trem_manu;