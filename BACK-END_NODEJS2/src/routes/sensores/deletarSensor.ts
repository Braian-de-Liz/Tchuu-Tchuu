// BACK-END_NODEJS2\src\routes\sensores\deletarSensor.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface dados_delete_sensor {
    cpf_user: string;
    nome_sensor: string;
}

const schema_deletarSensor: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['cpf_user', 'nome_sensor'],
            properties: {
                cpf_user: { type: 'string', pattern: '^\\d{11}$', description: 'CPF do usuário proprietário do sensor.' },
                nome_sensor: { type: 'string', description: 'Nome do sensor que deve ser removido.' }
            },
            additionalProperties: false
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    menssagem: { type: 'string' }
                }
            },
            404: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    messagem: { type: 'string' }
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

const deletar_sensor: FastifyPluginAsync = async (app, options) => {

    app.delete<{ Body: dados_delete_sensor }>("/sensores", schema_deletarSensor, async (request, reply) => {

        console.log("iniciando rota delete de sensores");
        const { cpf_user, nome_sensor } = request.body;


        try {
            console.log("iniciando busca por sensor no banco de dados para deletar");
            const procurar_sensor = await app.pg.query("DELETE FROM sensores WHERE cpf_user = $1 AND nome_sensor = $2", [cpf_user, nome_sensor]);

            if (procurar_sensor.rowCount === 0) {
                console.error("DB RESULTADO: 0 linhas afetadas. Retornando 404 (sensor não encontrado).");

                return reply.status(404).send({
                    status: 'erro',
                    messagem: "Trem não encontrado"
                });
            }

            console.log("sensor deletado com sucesso");
            return reply.status(200).send({
                status: "sucesso",
                menssagem: "sensor deletado com sucesso"
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

export default deletar_sensor;