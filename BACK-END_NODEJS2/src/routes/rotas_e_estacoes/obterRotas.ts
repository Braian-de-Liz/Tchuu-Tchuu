// BACK-END_NODEJS2\src\routes\rotas_e_estacoes\obterRotas.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import { autenticarJWT } from "../../hooks/autenticar_id_jwt.js";


interface DecodedUser {
    id: number;
}

const ObterRotasOptions: RouteShorthandOptions = {
    preHandler: autenticarJWT,
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nome: { type: 'string' },
                        descricao: { type: 'string' },
                        distancia_km: { type: 'number' },
                        tempo_estimado_min: { type: 'integer' },
                        data_criacao: { type: 'string' },
                        estacoes: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer' },
                                    nome: { type: 'string' },
                                    endereco: { type: 'string' },
                                    latitude: { type: 'number' },
                                    longitude: { type: 'number' },
                                    cidade: { type: 'string' },
                                    estado: { type: 'string' },
                                    data_criacao: { type: 'string' },
                                    ordem: { type: 'integer' }
                                }
                            }
                        }
                    }
                }
            },
            404: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    menssagem: { type: 'string' },
                    rotas: { type: 'array', items: {} }
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

const OObterRotas: FastifyPluginAsync = async (app, options) => {

    app.get("/rotas", ObterRotasOptions, async (request, reply) => {

        const idUsuarioLogado: number = (request.user as DecodedUser).id;

        try {
            const queryRotas: string = `
                SELECT id, nome, descricao, distancia_km, tempo_estimado_min, data_criacao
                FROM rotas
                WHERE id_usuario_criador = $1
                ORDER BY nome
            `;

            const resultadoRotas = await app.pg.query(queryRotas, [idUsuarioLogado]);


            if (resultadoRotas.rowCount === 0) {
                console.error("rotas não encontradas");

                return reply.status(404).send({
                    status: 'erro',
                    menssagem: 'rotas não encontradas',
                    rotas: []
                });
            }
            const rotas = resultadoRotas.rows;

            const idsRotas = rotas.map(r => r.id);

            const queryEstacoes = `
                SELECT re.id_rota, e.id, e.nome, e.endereco, e.latitude, e.longitude, e.cidade, e.estado, e.data_criacao, re.ordem
                FROM rota_estacoes re
                JOIN estacoes e ON re.id_estacao = e.id
                WHERE re.id_rota = ANY($1::int[]) 
                ORDER BY re.id_rota, re.ordem
            `;

            const resultadoEstacoes = await app.pg.query(queryEstacoes, [idsRotas]);
            const estacoesPorRota = resultadoEstacoes.rows;

            rotas.forEach(rota => {
                rota.estacoes = estacoesPorRota
                    .filter(e => e.id_rota === rota.id)
                    .sort((a, b) => a.ordem - b.ordem);
            });

            reply.status(200).send(rotas);

        }
        catch (erro) {
            console.error('ERRO INTERNO NO OBTEM ROTAS:', erro);

            reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao obter as rotas.'
            });
        }
    });
}

export default OObterRotas;