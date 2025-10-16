import { Router } from "express"
import { conectar } from "../../databases/conectar_banco.js"

const router = Router();

router.path('/trens', async (req, res) => {

    const {cpf_user} = req.body;
    


    console.log("rotinha");
});

export default router;