import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';
import bcrypt from 'bcrypt';

const router = Router();

router.patch("/usuario", async (req, res) => {

    // const { id_user } = req.params;
    const { email, senha, id } = req.body;

    if (!id) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'ID do usuário é obrigatório.'
        })
    }

    if (!email && !senha) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Pelo menos um campo (email ou senha) deve ser fornecido.'
        });
    }

    let db;

    try {
        db = await conectar();

        const consulta = db.query("", [id_user]);
    }
    catch (erro) {

    }
});

export default router;