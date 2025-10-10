import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';
import bcrypr from 'bcrypt';

const router = Router();

router.patch("/usuario:id", async (req, res) => {

    const { id_user } = req.params;
    const { email_novo, senha_novo } = req.body;


    let db;

    try {
        db = conectar();

        const consulta = db.query("", [id_user]);
    }
    catch (erro) {

    }
});

export default router;