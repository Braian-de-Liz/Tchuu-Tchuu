// BACK-END_NODEJS/src/routers/rotas_e_estacoes/salvarRota.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

function calcularDistancia(lat1, lon1, lat2, lon2) {
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

router.post('/rotas', async (req, res) => {
    const { nome, descricao, estacoes: idsEstacoes } = req.body;


    if (!nome || !idsEstacoes || !Array.isArray(idsEstacoes) || idsEstacoes.length < 2) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Dados incompletos: nome da rota e pelo menos duas estações são obrigatórios.'
        });
    }

    const idsEstacoesNumericos = idsEstacoes.map(id => Number(id)).filter(id => !isNaN(id) && id > 0);

    if (idsEstacoesNumericos.length !== idsEstacoes.length) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Todos os IDs das estações devem ser números inteiros positivos válidos.'
        });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token de autenticação não fornecido.'
        });
    }

    let idUsuarioLogado;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        idUsuarioLogado = Number(decoded.id);

        if (isNaN(idUsuarioLogado) || idUsuarioLogado <= 0) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Token inválido: ID do usuário não é um número válido.'
            });
        }
    } catch (erroToken) {
        console.error('Erro ao verificar token JWT:', erroToken);
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

    let db;
    try {
        db = await conectar();
        await db.query('BEGIN');


        const queryCoords = `
            SELECT id, latitude, longitude
            FROM estacoes
            WHERE id = ANY($1) 
            ORDER BY id;
        `;
        const resultadoCoords = await db.query(queryCoords, [idsEstacoesNumericos]);

        if (resultadoCoords.rows.length !== idsEstacoesNumericos.length) {
            await db.query('ROLLBACK');
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Alguma das estações fornecidas não foi encontrada no sistema.'
            });
        }

        const coordsMap = resultadoCoords.rows.reduce((map, estacao) => {
            map[estacao.id] = estacao;
            return map;
        }, {})

        const estacoesOrdenadas = idsEstacoesNumericos.map(id => {
            const estacao = coordsMap[id]
            return {
                id: estacao.id,
                latitude: parseFloat(estacao.latitude),
                longitude: parseFloat(estacao.longitude)
            };
        });

        let distanciaTotalKm = 0;
        for (let i = 0; i < estacoesOrdenadas.length - 1; i++) {
            const estacao1 = estacoesOrdenadas[i];
            const estacao2 = estacoesOrdenadas[i + 1];

            distanciaTotalKm += calcularDistancia(
                estacao1.latitude, estacao1.longitude,
                estacao2.latitude, estacao2.longitude
            );
        }

        const velocidadeMediaKmh = 60;
        const distanciaFormatada = parseFloat(distanciaTotalKm.toFixed(2));
        const tempoEstimadoHoras = distanciaFormatada / velocidadeMediaKmh;
        const tempoEstimadoMinutos = Math.round(tempoEstimadoHoras * 60);

        if (isNaN(distanciaFormatada) || isNaN(tempoEstimadoMinutos)) {
            await db.query('ROLLBACK');
            console.error('Erro de Cálculo: Distância ou Tempo resultou em NaN.');
            return res.status(500).json({
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
            descricao || null,
            distanciaFormatada,
            tempoEstimadoMinutos,
            idUsuarioLogado
        ];

        const resultadoRota = await db.query(queryInsertRota, paramsRota);
        const idNovaRota = resultadoRota.rows[0].id;

        const queryInsertAssoc = 'INSERT INTO rota_estacoes (id_rota, id_estacao, ordem) VALUES ($1, $2, $3)';

        // CORREÇÃO: Removemos o 's' solto no final da linha!
        const insertsAssoc = idsEstacoesNumericos.map((idEstacao, i) => {
            return db.query(queryInsertAssoc, [idNovaRota, idEstacao, i]);
        });

        await Promise.all(insertsAssoc); // <--- AQUI ESTAVA O PROBLEMA!

        await db.query('COMMIT');

        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Rota criada com sucesso!',
            id: idNovaRota
        });

        console.log(`Rota "${nome}" (ID: ${idNovaRota}) criada com sucesso.`);

    } catch (erro) {
        console.error('ERRO CRÍTICO (POST /rotas) -- Detalhe do erro:', erro);

        if (db) {
            try {
                await db.query('ROLLBACK');
                console.log('Transação desfeita (ROLLBACK).');
            } catch (rollbackError) {
                console.error('Erro durante ROLLBACK:', rollbackError);
            }
        }

        let statusCode = 500;
        let mensagemErro = 'Erro interno do servidor ao salvar a rota.';

        if (erro.code === '23503' || erro.code === '23502') {
            statusCode = 400;
            mensagemErro = 'Falha de integridade: Verifique se o usuário criador ou todas as estações existem.';
        } else if (erro.code === '23505') {
            statusCode = 400;
            mensagemErro = 'O nome da rota já está em uso. Por favor, escolha outro nome.';
        }

        res.status(statusCode).json({
            status: 'erro',
            mensagem: mensagemErro,
            detalhe: erro.message
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;