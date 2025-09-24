import { Router } from "express";
import bcrypt from "bcrypt";
import { conectar } from "../../databases/conectar_banco";

const router = Router();

router.post('/usu_login', async (req, res) => {

    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Email e senha são obrigatórios.'
        });
    }



    let db;

    try {
        db = await conectar();
        db = await db.query('SELECT cpf, email FROM usuarios WHERE cpf = $1 OR email = $2', [email, senha]);

        const resultado = await db.query('SELECT id, email, senha FROM usuarios WHERE email = $1',[email]);

        if(resultado.rows.length === 0) {

        }

    } catch {

    }

});


export default router;