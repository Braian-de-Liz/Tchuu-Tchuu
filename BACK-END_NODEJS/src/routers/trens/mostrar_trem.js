import { Router } from "express";
import { conectar } from '../../databases/conectar_banco.js'

const router = Router();

router.get("/Trem_mostrar", async (req, res) => {

    const {cpf_user} = req.body;

    


});

export default router;