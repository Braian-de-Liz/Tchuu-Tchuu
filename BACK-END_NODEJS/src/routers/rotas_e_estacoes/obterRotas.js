// BACK-END_NODEJS/src/routers/rotas_estacoes/obterRotas.js (CORRIGIDO NOVAMENTE)

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.get('/rotas', async (req, res) => {
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

        const queryRotas = `
            SELECT id, nome, descricao, distancia_km, tempo_estimado_min, data_criacao 
            FROM rotas 
            WHERE id_usuario_criador = $1 -- Filtra por usuário logado
            ORDER BY nome
        `;
        const resultadoRotas = await db.query(queryRotas, [idUsuarioLogado]);
        const rotas = resultadoRotas.rows;

        for (const rota of rotas) {
            const queryEstacoes = `
                SELECT e.id, e.nome, e.endereco, e.latitude, e.longitude, e.cidade, e.estado, e.data_criacao, re.ordem
                FROM estacoes e
                JOIN rota_estacoes re ON e.id = re.id_estacao
                WHERE re.id_rota = $1
                ORDER BY re.ordem ASC
            `;
            const resultadoEstacoes = await db.query(queryEstacoes, [rota.id]);
            rota.estacoes = resultadoEstacoes.rows; 
        }

        res.status(200).json(rotas); 

    } catch (erro) {
        console.error('Erro ao obter rotas:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao obter as rotas.'
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;