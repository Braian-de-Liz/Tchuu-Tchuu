// BACK-END_NODEJS2\src\routes\dash\getAlertas.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface reqAlertParams {
    cpf: string;
}

const schema_listarPorCpf: RouteShorthandOptions = {
    schema: {
        params: { 
            type: 'object',
            required: ['cpf'],
            properties: {
                cpf: { 
                    type: 'string', 
                    pattern: '^\\d{11}$', 
                    description: 'CPF do usuário na URL.' 
                }
            },
            additionalProperties: false
        }
    }
};

const getAlertas: FastifyPluginAsync = async (app, options) => {
    app.get<{ Params: reqAlertParams }>("/ocorrencias/:cpf", schema_listarPorCpf, async (request, reply) => {
        
        const { cpf } = request.params; 

        const cpfLimpo = cpf.replace(/\D/g, '');

        try {
            const sql = `
                SELECT 
                    oa.id_ocorrencia,
                    oa.valor_lido,
                    oa.timestamp_disparo,
                    a.tipo_alerta,
                    a.valor_limite, -- Adicionei aqui para sua tabela do front não ficar vazia
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
                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Nenhum alerta ativo encontrado para este usuário.'
                });
            }

            return reply.status(200).send({
                status: 'sucesso',
                ocorrencias: resultado.rows
            });
        } catch (erro) {
            app.log.error(erro);
            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Falha interna ao buscar alertas.'
            });
        }
    });
}

export default getAlertas;