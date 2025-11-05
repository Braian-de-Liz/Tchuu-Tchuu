import { Router } from "express";
import jwt from 'jsonwebtoken';
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.get("/estacoes", async (req, res) => {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'não está logado',
            menssage: 'tolken não recebido'
        });
    }

    let idUsuarioLogado;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        idUsuarioLogado = decoded.id;


    } catch (erro) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

    let db
    try {
        db = await conectar();

        const consulta = `
            SELECT id, nome, endereco, latitude, longitude, cidade, estado, data_criacao
            FROM estacoes
            WHERE id_usuario_criador = $1  -- Filtra pelas estações do usuário logado
            ORDER BY nome
        `;

        const parametro = [idUsuarioLogado];

        const resultado = await db.query(consulta, parametro);

        res.json(
            resultado.rows
        );
    }

    catch (erro) {
        console.error('Erro ao obter estações do usuário:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao obter as estações.'
        });
    }

    finally {
        console.log(`fechar conexão com o banco de dados`);

        if (db) {
            await db.end();
        }
    }
});

export default router;