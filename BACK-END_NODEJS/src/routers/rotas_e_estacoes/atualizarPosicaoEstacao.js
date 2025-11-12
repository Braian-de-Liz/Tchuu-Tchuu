// BACK-END_NODEJS/src/routers/rotas_estacoes/atualizarEstacao.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.patch('/estacoes/:id', async (req, res) => {
    const idEstacao = parseInt(req.params.id);
    const { nome, endereco, latitude, longitude, cidade, estado } = req.body; 

    if (isNaN(idEstacao)) {
        return res.status(400).json({ status: 'erro', mensagem: 'ID de estação inválido.' });
    }

    // --- 1. Autenticação JWT ---
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

    let db;
    try {
        db = await conectar();

        let setClauses = [];
        let params = [];
        let paramIndex = 1;

        if (nome !== undefined) {
            setClauses.push(`nome = $${paramIndex++}`);
            params.push(nome);
        }
        if (endereco !== undefined) {
            setClauses.push(`endereco = $${paramIndex++}`);
            params.push(endereco);
        }
        if (latitude !== undefined) {
            const lat = parseFloat(latitude);
            if (isNaN(lat)) return res.status(400).json({ status: 'erro', mensagem: 'Latitude inválida.' });
            setClauses.push(`latitude = $${paramIndex++}`);
            params.push(lat);
        }
        if (longitude !== undefined) {
            const lng = parseFloat(longitude);
            if (isNaN(lng)) return res.status(400).json({ status: 'erro', mensagem: 'Longitude inválida.' });
            setClauses.push(`longitude = $${paramIndex++}`);
            params.push(lng);
        }
        if (cidade !== undefined) {
            setClauses.push(`cidade = $${paramIndex++}`);
            params.push(cidade);
        }
        if (estado !== undefined) {
            setClauses.push(`estado = $${paramIndex++}`);
            params.push(estado);
        }

        if (setClauses.length === 0) {
            return res.status(400).json({ status: 'erro', mensagem: 'Nenhum campo para atualizar fornecido.' });
        }

        setClauses.push(`data_atualizacao = NOW()`); 
        params.push(idEstacao); 
        params.push(idUsuarioLogado);

        const queryUpdate = `
            UPDATE estacoes 
            SET ${setClauses.join(', ')} 
            WHERE id = $${paramIndex++} AND id_usuario_criador = $${paramIndex}
        `;

        const resultado = await db.query(queryUpdate, params);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ 
                status: 'erro', 
                mensagem: 'Estação não encontrada ou você não tem permissão para editá-la.' 
            });
        }

        res.status(200).json({
            status: 'sucesso',
            mensagem: 'Estação atualizada com sucesso!',
            id: idEstacao
        });

    } catch (erro) {
        console.error('Erro ao atualizar estação:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao atualizar a estação.'
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;