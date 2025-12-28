// BACK-END_NODEJS2/src/routes/rotas/salvarRota.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import { autenticarJWT } from "../../hooks/autenticar_id_jwt.js";

interface RotaBody {
    nome: string;
    descricao: string;
    estacoes: string[];
}

interface DecodedUser {
    id: number;
}


function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const lat1Rad = lat1 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}


const RotaOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['nome', 'descricao', 'estacoes'], 
            properties: {
                nome: { type: 'string', minLength: 1 },
                descricao: { type: 'string', minLength: 1 },
                estacoes: {
                    type: 'array',
                    minItems: 2, 
                    items: { type: 'string' }
                }
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
                    mensagem: { type: 'string' },
                    detalhe: { type: 'string' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' },
                    detalhe: { type: 'string' }
                }
            }
        }
    },
    preHandler: autenticarJWT
};
const salvarRota: FastifyPluginAsync = async (app, options) => {

    app.post<{ Body: RotaBody }>("/rotas", RotaOptions, async (request, reply) => {

        const { nome, descricao, estacoes: idsEstacoes } = request.body;
        const idUsuarioLogado = (request.user as DecodedUser).id;

        const idsEstacoesNumericos = idsEstacoes
            .map(id => Number(id))
            .filter(id => !isNaN(id) && id > 0);

        if (idsEstacoesNumericos.length !== idsEstacoes.length) {
            return reply.status(400).send({
                status: 'erro',
                mensagem: 'Todos os IDs das estações devem ser números inteiros positivos válidos.'
            });
        }

        try {
            const queryCoords = `
                SELECT id, latitude, longitude
                FROM estacoes
                WHERE id = ANY($1) 
            `;


            const resultadoCoords = await app.pg.query(queryCoords, [idsEstacoesNumericos]);

            if (resultadoCoords.rows.length !== idsEstacoesNumericos.length) {
                return reply.status(400).send({
                    status: 'erro',
                    mensagem: 'Alguma das estações fornecidas não foi encontrada no sistema.'
                });
            }

            const coordsMap = resultadoCoords.rows.reduce((map, estacao) => {
                map[estacao.id] = estacao;
                return map;
            }, {} as Record<number, { id: number, latitude: string | number, longitude: string | number }>);

            const estacoesOrdenadas = idsEstacoesNumericos.map(id => {
                const estacao = coordsMap[id];
                return {
                    id: estacao.id,
                    latitude: parseFloat(String(estacao.latitude)),
                    longitude: parseFloat(String(estacao.longitude))
                };
            });

            let distanciaTotalKm = 0;
            for (let i = 0; i < estacoesOrdenadas.length - 1; i++) {
                const estacao1 = estacoesOrdenadas[i];
                const estacao2 = estacoesOrdenadas[i + 1];

                distanciaTotalKm += calcularDistancia(
                    estacao1!.latitude, estacao1!.longitude,
                    estacao2!.latitude, estacao2!.longitude 
                );
            }

            const velocidadeMediaKmh = 60;
            const distanciaFormatada = parseFloat(distanciaTotalKm.toFixed(2));
            const tempoEstimadoHoras = distanciaFormatada / velocidadeMediaKmh;
            const tempoEstimadoMinutos = Math.round(tempoEstimadoHoras * 60);

            if (isNaN(distanciaFormatada) || isNaN(tempoEstimadoMinutos)) {
                app.log.error('Erro de Cálculo: Distância ou Tempo resultou em NaN. Coordenadas inválidas?');
                return reply.status(500).send({
                    status: 'erro',
                    mensagem: 'Erro de cálculo interno. Verifique as coordenadas das estações.'
                });
            }

            const queryInsertRota = `
                INSERT INTO rotas (nome, descricao, distancia_km, tempo_estimado_min, id_usuario_criador)
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING id;
            `;

            const paramsRota = [
                nome,
                descricao,
                distanciaFormatada,
                tempoEstimadoMinutos,
                idUsuarioLogado
            ];

            const resultadoRota = await app.pg.query(queryInsertRota, paramsRota);
            const idNovaRota = resultadoRota.rows[0].id;

            // --- 5. INSERÇÃO DA ASSOCIAÇÃO ROTA-ESTAÇÃO (USANDO app.pg.query()) ---
            const queryInsertAssoc = 'INSERT INTO rota_estacoes (id_rota, id_estacao, ordem) VALUES ($1, $2, $3)';

            const insertsAssoc = idsEstacoesNumericos.map((idEstacao, i) => {
                // Cada inserção ocorre em uma conexão separada, fora de uma transação.
                return app.pg.query(queryInsertAssoc, [idNovaRota, idEstacao, i]);
            });

            await Promise.all(insertsAssoc);

            app.log.info(`Rota "${nome}" (ID: ${idNovaRota}) criada (NÃO ATOMICAMENTE) pelo Usuário ${idUsuarioLogado}.`);

            return reply.status(201).send({
                status: 'sucesso',
                mensagem: 'Rota criada com sucesso!',
                id: idNovaRota
            });

        } catch (erro) {
            app.log.error(erro, 'ERRO CRÍTICO (POST /rotas)');

            let statusCode = 500;
            let mensagemErro = 'Erro interno do servidor ao salvar a rota.';

            if ((erro as any).code === '23503' || (erro as any).code === '23502') {
                statusCode = 400;
                mensagemErro = 'Falha de integridade: Verifique se o usuário criador ou todas as estações existem.';
            }
            else if ((erro as any).code === '23505') {
                statusCode = 400;
                mensagemErro = 'O nome da rota já está em uso. Por favor, escolha outro nome.';
            }

            return reply.status(statusCode).send({
                status: 'erro',
                mensagem: mensagemErro,
                detalhe: (erro as Error).message
            });
        }
    });
};

export default salvarRota;