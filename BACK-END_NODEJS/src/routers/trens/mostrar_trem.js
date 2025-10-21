import { Router } from "express";
import { conectar } from '../../databases/conectar_banco.js'

const router = Router();

router.get("/Trem_mostrar", async (req, res) => {

    // const { cpf_user } = req.body;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    



});

export default router;