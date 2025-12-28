// BACK-END_NODEJS2/src/routes/estacao/salvarEstacao.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import { autenticarJWT } from "../../hooks/autenticar_id_jwt.js";


interface EstacaoBody {
    nome: string;
    endereco: string;
    latitude: string;
    longitude: string;
    cidade: string;
    estado: string;
}

const EstacaoOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['nome', 'endereco', 'latitude', 'longitude', 'cidade', 'estado'],
            properties: {
                nome: { type: 'string', minLength: 1 },
                endereco: { type: 'string', minLength: 1 },
                latitude: { type: 'string', description: 'Latitude em formato string para conversão' },
                longitude: { type: 'string', description: 'Longitude em formato string para conversão' },
                cidade: { type: 'string', minLength: 1 },
                estado: { type: 'string', minLength: 2, maxLength: 2 },
            },
            additionalProperties: false
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' },
                    id: { type: 'integer' }
                }
            },
            400: {
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
    },
    preHandler: autenticarJWT
};

const salvarEstacao: FastifyPluginAsync = async (app, options) => {

    app.post<{ Body: EstacaoBody }>("/estacao", EstacaoOptions, async (request, reply) => {

        const { nome, endereco, latitude, longitude, cidade, estado } = request.body;

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        const idUsuarioCriador = (request.user as { id: number }).id;

        try {
            const query: string = `
                INSERT INTO estacoes (nome, endereco, latitude, longitude, cidade, estado, id_usuario_criador)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id;
            `;

            
            const parametros: (string | number)[] = [nome, endereco, lat, lng, cidade, estado, idUsuarioCriador];

            const resultado = await app.pg.query(query, parametros);

            const idNovaEstacao = resultado.rows[0].id_estacao;

            app.log.info(`Estação cadastrada. ID: ${idNovaEstacao} pelo Usuário: ${idUsuarioCriador}`);

            return reply.status(201).send({
                status: 'sucesso',
                mensagem: 'Estação criada com sucesso!',
                id: idNovaEstacao
            });

        } catch (erro) {
            app.log.error(erro, 'Erro ao salvar estação');

            if ((erro as any).code === '23503') {
                return reply.status(400).send({
                    status: 'erro',
                    mensagem: 'Erro: O usuário criador associado ao token não foi encontrado no banco de dados.'
                });
            }

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao salvar a estação.'
            });
        }
    });
}

export default salvarEstacao;