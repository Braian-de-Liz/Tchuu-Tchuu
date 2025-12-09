// src/routers/usuario/registrarUsuarios.js
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();
const SALT_ROUNDS = 10;

router.post('/usuarios', async (req, res) => {
    const { nome, cpf, email, senha, RegistroFun, dataNasc } = req.body;

    if (!nome || !cpf || !email || !senha || !RegistroFun || !dataNasc) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha todos os campos'
        });
    }

    const cpfTRUE = cpf.replace(/[^\d]/g, '');

    if (cpfTRUE.length !== 11) {
        console.error("cpf inválido");
        return res.status(400).json({ status: 'erro', mensagem: 'CPF inválido.' });
    }

    const dataNascDate = new Date(dataNasc);
    if (isNaN(dataNascDate.getTime())) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Data de nascimento inválida.'
        });
    }

    const dataFormatada = dataNascDate.toISOString().split('T')[0];


    let db;
    try {
        db = await conectar();

        const existente = await db.query(
            'SELECT cpf, email FROM usuarios WHERE cpf = $1 AND email = $2',
            [cpfTRUE, email]
        );

        if (existente.rows.length > 0) {
            const campo = existente.rows[0].cpf === cpfTRUE ? 'CPF' : 'e-mail';
            return res.status(409).json({
                status: 'erro',
                mensagem: `${campo} já cadastrado.`
            });
        }

        const senha_segura = await bcrypt.hash(senha, SALT_ROUNDS);

        await db.query(
            `INSERT INTO usuarios (nome, cpf, email, senha, registro_fun, data_nasc)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [nome, cpfTRUE, email, senha_segura, RegistroFun, dataFormatada]
        );

        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Usuário cadastrado com sucesso!'
        });

        console.log(`O usuário ${nome} de cpf:${cpf} foi cadastrado com sucesso`);

    } catch (erro) {
        console.error("Erro ao cadastrar", erro);
        res.status(500).json({
            status: 'erro',
            mensagem: "Erro interno do servidor"
        });

    }

    finally {
        if (db) {
            await db.end();
        }
    }

});

export default router;