import { Router } from "express";
import jwt from "jsonwebtoken";
import { conectar } from "../../databases/conectar_banco.js";


const router = Router();

router.post("/estacoes", async (req, res) => {

    const { nome, endereco, latitude, longitude } = req.body;

    if (!nome || !endereco || !latitude || !longitude) {
        console.error("Dados não diponiveis, faltou preencheer ou enviar");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Dados incompletos: nome, latitude e longitude são obrigatórios.'
        });
    }


    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token de autenticação não fornecido.'
        });
    }

    let id_user_stattion

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        idUsuarioCriador = decoded.id;




    }
    catch (erro) {
        console.error('Erro ao verificar token JWT:', erroToken);
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

    let db

    try {
        db = await conectar();
        db.query("", []);


    }

    catch (erro) {

    }

});

export default router;