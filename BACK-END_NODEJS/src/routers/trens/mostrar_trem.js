import { Router } from "express";
import { conectar } from '../../databases/conectar_banco.js'

const router = Router();

router.get("/Trem_mostrar", async (req, res) => {

    // const { cpf_user } = req.body;

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



    let db;
    const usuarioId = decoded.id;
    try {
        db = await conectar();
        
        const buscar = await db.query("SELECT FROM trens WHERE", [usuarioId]);


    }

    catch (erro) {

    }


});

export default router;