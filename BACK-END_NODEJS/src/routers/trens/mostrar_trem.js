import { Router } from "express";
import { conectar } from '../../databases/conectar_banco.js'

const router = Router();

router.get("/Trem_mostrar:cpf_user", async (req, res) => {

    const {cpf_user} = req.params;

    


});

export default router;