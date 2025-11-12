// BACK-END_NODEJS/src/routers/rotas_estacoes/excluirRota.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.delete('/rotas/:id', async (req, res) => {
    const idRota = parseInt(req.params.id);

    if (isNaN(idRota)) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'ID de rota inválido.'
        });
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

        const queryDeleteAssoc = 'DELETE FROM rota_estacoes WHERE id_rota = $1';
        await db.query(queryDeleteAssoc, [idRota]);
        
        const queryDeleteRota = 'DELETE FROM rotas WHERE id = $1 AND id_usuario_criador = $2';
        const resultadoDelete = await db.query(queryDeleteRota, [idRota, idUsuarioLogado]);

        if (resultadoDelete.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ 
                status: 'erro', 
                mensagem: 'Rota não encontrada ou você não tem permissão para excluí-la.' 
            });
        }

        await db.query('COMMIT'); 

        res.status(200).json({
            status: 'sucesso',
            mensagem: 'Rota excluída com sucesso!',
            id: idRota
        });

    } catch (erro) {
        console.error('Erro ao excluir rota:', erro);
        if (db) await db.query('ROLLBACK');
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao excluir a rota.'
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;