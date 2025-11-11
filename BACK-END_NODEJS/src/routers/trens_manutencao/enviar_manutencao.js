// BACK-END_NODEJS\src\routers\trens_manutencao\enviar_manutencao.js
import { Router } from "express";
import jwt from 'jsonwebtoken';
import { conectar } from "../../databases/conectar_banco.js";
import { defaultMaxListeners } from "ws";

const router = Router();

router.post("/manutencao", async (req, res) => {
    
});

export default router;