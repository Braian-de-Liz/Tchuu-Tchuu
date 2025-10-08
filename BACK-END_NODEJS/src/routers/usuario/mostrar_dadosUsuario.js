import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.get("/usuario", async (req, res) => {
    const { nome, cpf, email, RegistroFun, dataNasc } = req.body;

    let db;

    try {
        db = conectar();

        const consulta = await db.query("",);
    }
    catch {
        
    }
});

export default router;
