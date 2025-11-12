// BACK-END_NODEJS/src/routers/rotas_estacoes/atualizarRota.js
import { Router } from "express";
import jwt from 'jsonwebtoken';
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

// Reutilizando a função de cálculo de distância (Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    // Converte de graus para radianos
    const lat1Rad = lat1 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;
    
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}


router.patch("/rotas/:id", async (req, res) => {
    const idRota = parseInt(req.params.id);
    const { nome, descricao, estacoes: idsEstacoes } = req.body; 

    if (isNaN(idRota)) {
        return res.status(400).json({ status: 'erro', mensagem: 'ID de rota inválido.' });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ status: 'erro', mensagem: 'Token de autenticação não fornecido.' });
    }
    let idUsuarioLogado;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        idUsuarioLogado = decoded.id; 
    } catch (erroToken) {
        return res.status(401).json({ status: 'erro', mensagem: 'Token inválido ou expirado.' });
    }
    // ---------------------------

    let db;
    try {
        db = await conectar();
        await db.query('BEGIN');

        const checkUser = await db.query('SELECT id FROM rotas WHERE id = $1 AND id_usuario_criador = $2', [idRota, idUsuarioLogado]);
        if (checkUser.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ status: 'erro', mensagem: 'Rota não encontrada ou você não tem permissão para editá-la.' });
        }


        let setClauses = [];
        let params = [];
        let paramIndex = 1;
        let distanciaTotalKm = null;
        let tempoEstimadoMinutos = null;

        if (idsEstacoes && Array.isArray(idsEstacoes) && idsEstacoes.length >= 2) {
            // Validação básica dos IDs
            for (const id of idsEstacoes) {
                if (typeof id !== 'number' || isNaN(id)) {
                    await db.query('ROLLBACK');
                    return res.status(400).json({ status: 'erro', mensagem: 'IDs das estações devem ser números válidos.' });
                }
            }
            
            const placeholders = idsEstacoes.map((_, i) => `$${i + 1}`).join(', '); 
            const queryCoords = `
                SELECT id, latitude, longitude
                FROM estacoes
                WHERE id = ANY(ARRAY[${placeholders}])
            `;
            const resultadoCoords = await db.query(queryCoords, idsEstacoes);

            if (resultadoCoords.rows.length !== idsEstacoes.length) {
                await db.query('ROLLBACK');
                return res.status(400).json({ status: 'erro', mensagem: 'Alguma das estações fornecidas não foi encontrada.' });
            }

            distanciaTotalKm = 0;
            const coordsMap = {};
            resultadoCoords.rows.forEach(row => coordsMap[row.id] = row);

            for (let i = 0; i < idsEstacoes.length - 1; i++) {
                const estacao1 = coordsMap[idsEstacoes[i]];
                const estacao2 = coordsMap[idsEstacoes[i + 1]];
                
                distanciaTotalKm += calcularDistancia(
                    estacao1.latitude, estacao1.longitude, 
                    estacao2.latitude, estacao2.longitude
                );
            }

            const velocidadeMediaKmh = 60; 
            const tempoEstimadoHoras = distanciaTotalKm / velocidadeMediaKmh;
            tempoEstimadoMinutos = Math.round(tempoEstimadoHoras * 60);

            const queryDeleteAssoc = 'DELETE FROM rota_estacoes WHERE id_rota = $1';
            await db.query(queryDeleteAssoc, [idRota]);

            const queryInsertAssoc = 'INSERT INTO rota_estacoes (id_rota, id_estacao, ordem) VALUES ($1, $2, $3)';
            for (let i = 0; i < idsEstacoes.length; i++) {
                await db.query(queryInsertAssoc, [idRota, idsEstacoes[i], i]);
            }
            
            setClauses.push(`distancia_km = $${paramIndex++}`);
            params.push(distanciaTotalKm.toFixed(2));
            setClauses.push(`tempo_estimado_min = $${paramIndex++}`);
            params.push(tempoEstimadoMinutos);
        }

        if (nome !== undefined) {
            setClauses.push(`nome = $${paramIndex++}`);
            params.push(nome);
        }
        if (descricao !== undefined) {
            setClauses.push(`descricao = $${paramIndex++}`);
            params.push(descricao || null);
        }

        if (setClauses.length === 0) {
            await db.query('ROLLBACK');
            return res.status(400).json({ status: 'erro', mensagem: 'Nenhum dado válido para atualização fornecido.' });
        }
        
        params.push(idRota); 
        params.push(idUsuarioLogado);

        const queryUpdateRota = `
            UPDATE rotas 
            SET ${setClauses.join(', ')}, data_atualizacao = NOW()
            WHERE id = $${paramIndex++} AND id_usuario_criador = $${paramIndex}
        `;

        const resultado = await db.query(queryUpdateRota, params);

        if (resultado.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ status: 'erro', mensagem: 'Rota não encontrada ou não pertence ao usuário.' });
        }

        await db.query('COMMIT');
        
        res.status(200).json({
            status: 'sucesso',
            mensagem: 'Rota atualizada com sucesso!',
            id: idRota
        });

    } catch (erro) {
        console.error('Erro ao atualizar rota:', erro);
        if (db) await db.query('ROLLBACK');
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao atualizar a rota.'
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;