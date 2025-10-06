import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';
import router from './registrarUsuarios.js';

const router = Router();

router.patch("/usuario:cpf", async (req, res) => {

});

export default router;