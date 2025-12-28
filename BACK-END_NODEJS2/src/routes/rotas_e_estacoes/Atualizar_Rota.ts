// BACK-END_NODEJS2\src\routes\rotas_e_estacoes\Atualizar_Rota.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import { autenticarJWT } from "../../hooks/autenticar_id_jwt.js";
import { PoolClient } from "pg";

interface UpdateRotaParams { id: string; }
interface UpdateRotaBody {
    nome?: string;
    descricao?: string;
    estacoes?: number[];
}
interface DecodedUser { id: string; }
interface EstacaoRow {
    id: number;
    latitude: string | number;
    longitude: string | number;
}

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const AtualizarRota: FastifyPluginAsync = async (app) => {
    const options: RouteShorthandOptions = { 
    preHandler: autenticarJWT,
    schema: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', pattern: '^[0-9]+$' }
            }
        },
        body: {
            type: 'object',
            properties: {
                nome: { type: 'string', minLength: 1 },
                descricao: { type: 'string' },
                estacoes: { 
                    type: 'array', 
                    minItems: 2,
                    items: { type: 'integer' } 
                }
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

    app.patch<{ Params: UpdateRotaParams; Body: UpdateRotaBody }>("/rotas/:id", options, async (request, reply) => {
            const idRota = parseInt(request.params.id);
            const idUsuarioLogado = (request.user as DecodedUser).id;
            const { nome, descricao, estacoes: idsEstacoes } = request.body;

            let client: PoolClient | null = null;

            try {
                client = await app.pg.connect();
                await client.query('BEGIN');

                const checkUser = await client.query(
                    'SELECT id FROM rotas WHERE id = $1 AND id_usuario_criador = $2', 
                    [idRota, idUsuarioLogado]
                );

                if (checkUser.rowCount === 0) {
                    await client.query('ROLLBACK');
                    return reply.status(404).send({ status: 'erro', mensagem: 'Rota não encontrada.' });
                }

                let setClauses: string[] = [];
                let params: any[] = [];
                let pIndex = 1;

                if (idsEstacoes && Array.isArray(idsEstacoes) && idsEstacoes.length >= 2) {
                    const idsUnicos = [...new Set(idsEstacoes.map(id => Number(id)))];
                    const resEst = await client.query<EstacaoRow>(
                        'SELECT id, latitude, longitude FROM estacoes WHERE id = ANY($1::int[])', 
                        [idsUnicos]
                    );
                    
                    const coordsMap = new Map<number, EstacaoRow>();
                    resEst.rows.forEach(r => coordsMap.set(Number(r.id), r));

                    let distTotal = 0;
                    for (let i = 0; i < idsEstacoes.length - 1; i++) {
                        const e1 = coordsMap.get(Number(idsEstacoes[i]));
                        const e2 = coordsMap.get(Number(idsEstacoes[i + 1]));

                        if (!e1 || !e2) {
                            await client.query('ROLLBACK');
                            return reply.status(400).send({ status: 'erro', mensagem: 'Estação não encontrada.' });
                        }
                        distTotal += calcularDistancia(Number(e1.latitude), Number(e1.longitude), Number(e2.latitude), Number(e2.longitude));
                    }

                    await client.query('DELETE FROM rota_estacoes WHERE id_rota = $1', [idRota]);
                    for (let i = 0; i < idsEstacoes.length; i++) {
                        await client.query(
                            'INSERT INTO rota_estacoes (id_rota, id_estacao, ordem) VALUES ($1, $2, $3)', 
                            [idRota, idsEstacoes[i], i]
                        );
                    }

                    setClauses.push(`distancia_km = $${pIndex++}`, `tempo_estimado_min = $${pIndex++}`);
                    params.push(distTotal.toFixed(2), Math.round((distTotal / 60) * 60));
                }

                if (nome) { setClauses.push(`nome = $${pIndex++}`); params.push(nome); }
                if (descricao !== undefined) { setClauses.push(`descricao = $${pIndex++}`); params.push(descricao); }

                if (setClauses.length > 0) {
                    params.push(idRota, idUsuarioLogado);
                    const queryUpdate = `
                        UPDATE rotas 
                        SET ${setClauses.join(', ')} 
                        WHERE id = $${pIndex++} AND id_usuario_criador = $${pIndex}
                    `;
                    await client.query(queryUpdate, params);
                }

                await client.query('COMMIT');
                return reply.send({ status: 'sucesso', mensagem: 'Rota atualizada!' });

            } catch (erro) {
                if (client) await client.query('ROLLBACK');
                app.log.error(erro);
                return reply.status(500).send({ status: 'erro', mensagem: 'Erro interno.' });
            } finally {
                if (client) client.release();
            }
        }
    );
};

export default AtualizarRota;