// BACK-END_NODEJS/src/routers/rotas_estacoes/salvarRota.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { conectar } from '../../databases/conectar_banco.js';
    
const router = Router();

function calcularDistancia(lat1, lon1, lat2, lon2) {
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

router.post('/rota', async (req, res) => {
    const { nome, descricao, estacoes: idsEstacoes } = req.body;
    if (!nome || !idsEstacoes || !Array.isArray(idsEstacoes) || idsEstacoes.length < 2) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Dados incompletos: nome da rota e pelo menos duas estações são obrigatórios.'
        });
    }

    for (const id of idsEstacoes) {
        if (typeof id !== 'number' || isNaN(id)) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'IDs das estações devem ser números válidos.'
            });
        }
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
        idUsuarioLogado = decoded.id;

        if (!idUsuarioLogado) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Token inválido: ID do usuário não encontrado no payload.'
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


        const placeholders = idsEstacoes.map((_, i) => `$${i + 1}`).join(', '); 
        const queryCoords = `
            SELECT id, latitude, longitude
            FROM estacoes
            WHERE id = ANY(ARRAY[${placeholders}])
            ORDER BY id = ANY(ARRAY[${placeholders}])
        `;
        const resultadoCoords = await db.query(queryCoords, idsEstacoes);

        if (resultadoCoords.rows.length !== idsEstacoes.length) {
            await db.query('ROLLBACK'); 
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Alguma das estações fornecidas não foi encontrada.'
            });
        }

        let distanciaTotalKm = 0;
        for (let i = 0; i < resultadoCoords.rows.length - 1; i++) {
            const estacao1 = resultadoCoords.rows[i];
            const estacao2 = resultadoCoords.rows[i + 1];
            const lat1Rad = estacao1.latitude * Math.PI / 180;
            const lon1Rad = estacao1.longitude * Math.PI / 180;
            const lat2Rad = estacao2.latitude * Math.PI / 180;
            const lon2Rad = estacao2.longitude * Math.PI / 180;

            distanciaTotalKm += calcularDistancia(lat1Rad, lon1Rad, lat2Rad, lon2Rad);
        }

        const velocidadeMediaKmh = 60; 
        const tempoEstimadoHoras = distanciaTotalKm / velocidadeMediaKmh;
        const tempoEstimadoMinutos = Math.round(tempoEstimadoHoras * 60);

        const queryInsertRota = `
            INSERT INTO rotas (nome, descricao, distancia_km, tempo_estimado_min)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        const paramsRota = [nome, descricao || null, distanciaTotalKm.toFixed(2), tempoEstimadoMinutos];
        const resultadoRota = await db.query(queryInsertRota, paramsRota);
        const idNovaRota = resultadoRota.rows[0].id;

        const queryInsertAssoc = 'INSERT INTO rota_estacoes (id_rota, id_estacao, ordem) VALUES ($1, $2, $3)';
        for (let i = 0; i < idsEstacoes.length; i++) {
            await db.query(queryInsertAssoc, [idNovaRota, idsEstacoes[i], i]);
        }

        await db.query('COMMIT'); 

        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Rota criada com sucesso!',
            id: idNovaRota
        });

        console.log(`Rota "${nome}" (ID: ${idNovaRota}) criada com sucesso pelo usuário (ID: ${idUsuarioLogado}).`);

    } catch (erro) {
        console.error('Erro ao salvar rota:', erro);
        if (db) {
            await db.query('ROLLBACK');
        }
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao salvar a rota.'
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;