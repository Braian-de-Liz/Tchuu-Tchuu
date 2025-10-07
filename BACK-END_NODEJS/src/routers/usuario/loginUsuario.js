import { Router } from 'express';
import bcrypt from 'bcrypt';
import { conectar } from './databases/conectar_banco.js';
import jwt from 'jsonwebtoken';

const router = Router();

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET não está definido no ambiente!.');
    process.exit(1);
}

router.post('/usu_login', async (req, res) => {
    const { email, senha } = req.body;

    if (senha.length < 8) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Senha curta demais. Mínimo de 8 caracteres.'
        });
    }

    if (!email || !senha) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Email e senha são obrigatórios.'
        });
    }

    let db;

    try {
        db = await conectar();

        const resultado = await db.query('SELECT id, email, nome, senha FROM usuarios WHERE email = $1', [email]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Email ou senha incorretos.'
            });
        }

        const usuario = resultado.rows[0];

        const senhaCerta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCerta) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Email ou senha incorretos.'
            });
        }


        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );


        res.json({
            status: 'sucesso',
            mensagem: 'Login realizado com sucesso!',
            token: token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome
            }
        });


    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor.'
        });
    }
    finally {
        if (db) db.end();
    }
});


export default router;
