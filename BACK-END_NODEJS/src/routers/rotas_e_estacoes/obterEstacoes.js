import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.get("/estacoes", async (req, res) => {
    const authHeader = req.header.authorizations;
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

        const consulta = `SELECT id, nome, endereco, latitude, longitude, cidade, estado, data_criacao
            FROM estacoes
            ORDER BY nome
        `;

        db.query(consulta);
    }

    catch (erro) {

    }

    finally{
        console.log(`fechar conexão com o banco de dados`);
        await db.end();
    }
});

export default router;