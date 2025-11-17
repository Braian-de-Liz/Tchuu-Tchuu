// BACK-END_NODEJS\src\routers\trens_manutencao\tirar_manutencao.js
import { Router } from "express";
import jwt from 'jsonwebtoken';
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.delete("/manutencao", async (req, res) => {
    const {id_trem, id_user_trem} = req.body;

    
});

export default router;