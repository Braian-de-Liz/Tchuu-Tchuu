// BACK-END_NODEJS/src/routers/trens/registrar_trem.js
import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.post("/trem", async (req, res) => {

    console.log("Registrando trem");
    const { nomeTrem, numero, fabricante, cpfUser, dataRegistro, NomeUser } = req.body;

    if (!nomeTrem || !numero || !fabricante || !cpfUser || !dataRegistro || !NomeUser) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha todos os campos'
        });
    }

    let db;

    try {
        const cpfTRUE = cpfUser.replace(/[^\d]/g, '');

        if (cpfTRUE.length !== 11) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'CPF inválido.'
            });
        }

        db = await conectar();



        await db.query(`INSERT INTO trens (nome_trem, numero_trem, fabricante, cpf_usuario, data_registro, nome_usuario) VALUES ($1, $2, $3, $4, $5, $6)`, [nomeTrem, numero, fabricante, cpfTRUE, dataRegistro, NomeUser]);

        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Trem registrado com sucesso!'
        });

    } catch (erro) {
        console.error("Erro ao registrar trem:", erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao registrar o trem.'
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;