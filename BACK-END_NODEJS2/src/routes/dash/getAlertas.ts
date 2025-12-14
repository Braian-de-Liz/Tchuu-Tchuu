// BACK-END_NODEJS2\src\routes\dash\getAlertas.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";


interface reqAlert {
    cpf: string;
}

const schema_listarPorCpf: RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            required: ['cpf'],
            properties: {
                cpf: { type: 'string', pattern: '^\\d{11}$', description: 'CPF do usuário para filtrar os resultados.' }
            },
            additionalProperties: false
        }
    }
};

const getAlertas: FastifyPluginAsync = async (app, options) => {

    app.get<{ Querystring: reqAlert }>("/ocorrencias", schema_listarPorCpf, async (request, reply) => {
        const { cpf } = request.query

        const cpfLimpo: string = cpf.replace(/\D/g, '');


        try {
            const sql: string = `
            SELECT 
                oa.id_ocorrencia,
                oa.valor_lido,
                oa.timestamp_disparo,
                a.tipo_alerta,
                s.nome_sensor
                FROM ocorrencias_alertas oa
                JOIN alertas a ON oa.id_alerta = a.id_alerta
                JOIN sensores s ON a.id_sensor = s.id_sensor
                WHERE oa.status_alerta = 'ABERTO' 
                AND s.cpf_user = $1
                ORDER BY oa.timestamp_disparo DESC
            `;

            const resultado = await app.pg.query(sql, [cpfLimpo]);

            if (resultado.rowCount === 0) {
                app.log.warn(`Alertas abertos não encontrados para o CPF: ${cpf}`);

                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'alertas desse usuário não encontrados'
                })
            }

            return reply.status(200).send({
                status: 'sucesso',
                ocorrencias: resultado.rows
            });
        }
        catch (erro) {
            console.error("Erro ao listar ocorrências:", erro);
            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Falha interna ao buscar alertas.'
            });
        }
    });
}

export default getAlertas;