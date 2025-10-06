import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.delete("/trem/:cpf_user", async (req, res) => {
    
    const {cpf_user} = req.params;

    if (!cpf_user || cpf_user !== 11) {
        
    }


    
});


export default router
