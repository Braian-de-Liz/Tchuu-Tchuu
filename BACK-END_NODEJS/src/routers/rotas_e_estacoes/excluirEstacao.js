// BACK-END_NODEJS\src\routers\rotas_e_estacoes\excluirEstacao.js
import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";


const router = Router();

router.delete("/estacoes", async (req, res) => {
    const { id, cpf } = req.body

    if (!id || !cpf) {
        return res.status(400).json({
            status: 'Erro',
            menssagem: 'dados não recebidos'
        });
    } else if (cpf.length !== 11) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'CPF inválido. Deve conter 11 dígitos.'
        })
    }

    let db;

    try {
        db =  await conectar();

        const user_estacao = db.query('SELECT FROM usuarios WHERE id = $1 AND cpf = $2 RETURNING id', [id, cpf]);

        


    }
    catch (erro) {

    }


});

// https://tchuu-tchuu-server-chat.onrender.com/api/estacoes method: DELETE

export default router;