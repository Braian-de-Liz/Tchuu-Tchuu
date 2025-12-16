// BACK-END_NODEJS/src/routers/rotas_estacoes/excluirEstacao.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.delete('/estacoes/:id', async (req, res) => {
    const idEstacao = parseInt(req.params.id);

    if (isNaN(idEstacao)) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'ID de estação inválido.'
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

    let db;
    try {
        db = await conectar();
        await db.query('BEGIN'); 

        const checkUser = await db.query('SELECT id_usuario_criador FROM estacoes WHERE id = $1', [idEstacao]);
        
        if (checkUser.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ status: 'erro', mensagem: 'Estação não encontrada.' });
        }

        if (checkUser.rows[0].id_usuario_criador !== idUsuarioLogado) {
            await db.query('ROLLBACK');
            return res.status(403).json({ status: 'erro', mensagem: 'Você não tem permissão para excluir esta estação.' });
        }


        const queryUso = 'SELECT COUNT(*) AS count FROM rota_estacoes WHERE id_estacao = $1';
        const resultadoUso = await db.query(queryUso, [idEstacao]);

        if (parseInt(resultadoUso.rows[0].count) > 0) {
            await db.query('ROLLBACK');
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Não é possível excluir a estação pois ela está sendo usada em uma ou mais rotas.'
            });
        }

        const queryDelete = 'DELETE FROM estacoes WHERE id = $1 AND id_usuario_criador = $2';
        const resultadoDelete = await db.query(queryDelete, [idEstacao, idUsuarioLogado]);

        if (resultadoDelete.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ status: 'erro', mensagem: 'Estação não encontrada ou não pertence ao usuário.' });
        }

        await db.query('COMMIT'); 
        
        res.status(200).json({
            status: 'sucesso',
            mensagem: 'Estação excluída com sucesso!',
            id: idEstacao
        });

    } catch (erro) {
        console.error('Erro ao excluir estação:', erro);
        if (db) await db.query('ROLLBACK');
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao excluir a estação.'
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;