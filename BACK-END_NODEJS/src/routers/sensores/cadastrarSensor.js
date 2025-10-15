import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.post("/sensores", async (req, res) => {
    console.log("rota iniciada para cadastro de sensor");
    const {tipo_sensor, marca_sensor, data} = req.body;

    if(!tipo_sensor || !marca_sensor || !data){
        console.error("erro ao receber ou preencher dados");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'preencha os campos'
        });
    }

});

export default router;