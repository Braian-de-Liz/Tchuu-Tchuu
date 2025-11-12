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
            SELECT 
                id, nome, descricao, distancia_km, tempo_estimado_min, data_criacao
            FROM rotas
            WHERE id_usuario_criador = $1
            ORDER BY nome
        `;
        const resultadoRotas = await db.query(queryRotas, [idUsuarioLogado]);
        const rotas = resultadoRotas.rows;

        if (rotas.length === 0) {
            return res.status(200).json([]);
        }

        const idsRotas = rotas.map(r => r.id);


        const queryEstacoes = `
            SELECT 
                re.id_rota, 
                e.id, e.nome, e.endereco, e.latitude, e.longitude, e.cidade, e.estado, e.data_criacao, re.ordem
            FROM rota_estacoes re
            JOIN estacoes e ON re.id_estacao = e.id
            WHERE re.id_rota = ANY($1::int[]) 
            ORDER BY re.id_rota, re.ordem
        `;
        
        const resultadoEstacoes = await db.query(queryEstacoes, [idsRotas]); 
        const estacoesPorRota = resultadoEstacoes.rows;

        rotas.forEach(rota => {
            rota.estacoes = estacoesPorRota
                .filter(e => e.id_rota === rota.id)
                .sort((a, b) => a.ordem - b.ordem); 
        });

        res.status(200).json(rotas); 

    } catch (erro) {
        console.error('ERRO INTERNO NO OBTEM ROTAS:', erro); 
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