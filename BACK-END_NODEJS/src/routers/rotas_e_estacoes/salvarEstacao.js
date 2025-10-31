import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";


const router = Router();

router.post("/estacoes", (req, res) => {

    const { id, nome, endereco, latitude, longitude } = req.body;

    if (!id || !nome || !endereco || !latitude || !longitude) {
        console.error("Dados não diponiveis, faltou preencheer ou enviar");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Dados incompletos: nome, latitude e longitude são obrigatórios.'
        });
    }

    let db

    try {
        db = await conectar();
    }

});

export default router;