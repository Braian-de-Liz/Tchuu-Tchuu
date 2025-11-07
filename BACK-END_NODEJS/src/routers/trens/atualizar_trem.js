import { Router } from "express"
import { conectar } from "../../databases/conectar_banco.js"


const router = Router();

router.patch('/trens', async (req, res) => {

    const { cpf_user, nome_trem } = req.body;

    if (!cpf_user || !nome_trem) {
        console.log("dados com erros ");

        return res.status(401).json({
            status: 'erro',
            menssagem: 'dados não recebidos ou não enviados'
        });
    }

    let db;

    try {
        db = await conectar();

        const consulta = await db.query("");
    }
     catch(erro){
        
     }


});

export default router;