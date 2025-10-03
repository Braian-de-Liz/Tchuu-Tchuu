import {Router} from 'express';
import bycrypt from 'bcrypt';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();


router.post("/trem_Cadastro", async (req, res) => {
    
    
    console.log("registrando trem");
    const {nomeTrem, numero_de_Trem, fabricante, cpfUser, dataRegistro, NomeUser } = req.body;

    

});






export default router;