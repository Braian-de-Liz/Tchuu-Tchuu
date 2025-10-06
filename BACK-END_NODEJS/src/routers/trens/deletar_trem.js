import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.delete("/trem/:cpf_user", async (req, res) => {

    const { cpf_user } = req.params;

    if (!cpf_user || cpf_user !== 11) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'CPF inválido. Deve conter 11 dígitos.'
        });

    }


    let db;

    try {
        
        db = await conectar();
        const consulta =  await db.query("", [])
    }
    catch {

    }




    
});


export default router
