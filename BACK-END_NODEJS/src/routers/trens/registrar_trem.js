import { Router } from 'express';
import bcrypt from 'bcrypt';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();


router.post("/trem", async (req, res) => {


    console.log("registrando trem");
    const { nomeTrem, numero_de_Trem, fabricante, cpfUser, dataRegistro, NomeUser } = req.body;

    if (!nomeTrem || !numero_de_Trem || !fabricante || !cpfUser || !dataRegistro || !NomeUser) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha  todos os campos'
        });
    };

    
    let db;
    
    try {
        const cpfTRUE = cpfUser.replace(/[^\d]/g, '');
    
        if (cpfTRUE.length !== 11) {
            return res.status(400).json({ status: 'erro', mensagem: 'CPF inválido.' });
        }
        db = await conectar();

        const existe = await db.query("SELECT cpf FROM trens WHERE cpf = $1", [cpfTRUE]);
    }
    catch {
        console.log("é");
    }

});






export default router;