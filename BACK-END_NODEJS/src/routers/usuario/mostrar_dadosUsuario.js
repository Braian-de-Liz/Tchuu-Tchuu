// src/routers/usuario/mostrar_dadosUsuario.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.get("/usuario_get", async (req, res) => {


    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token não fornecido.'
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (erro) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

    const usuarioId = decoded.id;

    let db;
    try {
        db = await conectar();

        const resultado = await db.query(
            'SELECT nome, cpf, email, data_nasc FROM usuarios WHERE id = $1',
            [usuarioId]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                status: 'erro',
                mensagem: 'Usuário não encontrado.'
            });
        }

        res.json({
            status: 'sucesso',
            usuario: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao buscar dados do usuário:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor.'
        });
    }

    finally {
        if (db) db.end();
    }
});

export default router;