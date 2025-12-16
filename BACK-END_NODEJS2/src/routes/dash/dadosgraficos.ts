// BACK-END_NODEJS2\src\routes\dash\dadosgraficos.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface HistoricoParams {
    id_sensor: string;
}

interface HistoricoQuerystring {
    limite?: string;
}

const HistoricoSchema: RouteShorthandOptions = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id_sensor: { type: 'string', description: 'ID do sensor para o qual o histórico será buscado.' }
            },
            required: ['id_sensor'],
            additionalProperties: false
        },
        querystring: {
            type: 'object',
            properties: {
                limite: { type: 'string', description: 'Número máximo de registros a serem retornados. Padrão: 20.' }
            },
            additionalProperties: false
        }
    }
};

const dadosgraficos: FastifyPluginAsync = async (app, optios) => {

    app.get<{ Params: HistoricoParams, Querystring: HistoricoQuerystring }>("/historico/sensor/:id_sensor", HistoricoSchema, async (request, reply) => {

        const id_sensor: number = parseInt(request.params.id_sensor);
        const limiteString = request.query.limite ?? '20';
        const limite: number = parseInt(limiteString, 10);


        try {
            const sql: string = `
                SELECT valor, timestamp_leitura
                FROM leituras_sensores
                WHERE id_sensor = $1
                ORDER BY timestamp_leitura DESC
                LIMIT $2
            `;


            const resultado = await app.pg.query(sql, [id_sensor, limite]);

            if (resultado.rowCount === 0) {
                app.log.warn("nada encontrado");


            }

            const dadosOrdenados = resultado.rows.reverse();

            app.log.info("dados encontradps com sucesso");
            
            return reply.status(200).send({
                status: 'sucesso',
                mensagem: 'histórico encontrado com sucesso',
                dados: dadosOrdenados
            });
        }
        catch (erro) {
            app.log.warn("Erro interno ao buscar dados do gráfico.");

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno ao buscar dados do gráfico.'
            });
        }

    });
}

export default dadosgraficos;