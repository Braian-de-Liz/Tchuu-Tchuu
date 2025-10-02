import {Router} from 'express';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.post("/trem_Cadastro", async (req, res) => {
    
    console.log("registrando term");

    const {nome, cpf, email, senha, dataNasc} = req.body;

});






export default router;