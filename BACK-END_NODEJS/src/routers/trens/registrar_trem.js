import {Router} from 'express';
import bycrypt from 'bcrypt';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();


router.post("/trem_Cadastro", async (req, res) => {
    
    
    console.log("registrando trem");
    const {nomeTrem, numero_de_Trem, fabricante, cpfUser, dataRegistro, NomeUser } = req.body;

    if(!nomeTrem ||!numero_de_Trem || !fabricante || !cpfUser || !dataRegistro || !NomeUser ){
        return res.status(400).json({
            status:'erro',
            mensagem: 'Preencha  todos os campos'
        });
    };

const cpfTRUE = cpf.replace(/[^\d]/g, '');

    if (cpfTRUE.length !== 11) {
        return res.status(400).json({ status: 'erro', mensagem: 'CPF inválido.' });
    }
    

});






export default router;