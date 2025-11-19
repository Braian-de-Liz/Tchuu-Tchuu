// BACK-END_NODEJS/src/routers/trens_manutencao/obter_manutencao.js
import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.get("/manutencao", async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token de autenticação não fornecido.'
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
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

    const idUsuarioLogado = decoded.id; 

    let db;
    try {
        db = await conectar();
        console.log("Banco de dados acessado com o cliente PostgreSQL");


        const query = `
            SELECT 
                cm.id AS id_chamado,
                cm.id_trem,
                cm.descricao_problema,
                cm.descricao_detalhada,
                cm.status,
                cm.data_inicio,
                cm.data_conclusao,
                t.nome_trem,
                t.numero,
                t.fabricante
            FROM chamados_manutencao cm
            JOIN trens t ON cm.id_trem = t.id
            WHERE cm.cpf_usuario_abertura = $1
            ORDER BY cm.data_inicio DESC;
        `;
        const params = [idUsuarioLogado]; 

        const resultado = await db.query(query, params);

        
        res.json(resultado.rows); 

        console.log(`Chamados de manutenção retornados para o usuário com ID ${idUsuarioLogado}.`);

    } catch (erro) {
        console.error('Erro ao obter chamados de manutenção:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao obter os chamados de manutenção.'
        });
    } finally {
        if (db) {
            await db.end();
            console.log("Conexão com o banco de dados encerrada.");
        }
    }
});

export default router;