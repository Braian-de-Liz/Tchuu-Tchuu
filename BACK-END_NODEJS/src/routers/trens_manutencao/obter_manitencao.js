import {Router} from 'express';
import { conectar } from '../../databases/conectar_banco.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.get("/manutencao", async (req, res) => {
    
});


export default router;