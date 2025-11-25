import { Router } from 'express';
import bcrypt from 'bcrypt';
import { conectar } from '../../databases/conectar_banco.js';
import jwt from 'jsonwebtoken';

const router = Router();

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET não está definido no ambiente!.');
    process.exit(1);
}

router.post('/usu_login', async (req, res) => {
    const { email, senha } = req.body;

    if (senha.length < 8) {
        console.error("Usuário com senha menor do que minimo requerido");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Senha curta demais. Mínimo de 8 caracteres.'
        });
    }

    if (!email || !senha) {
        console.error("Requisição sem conteúdo enviado");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Email e senha são obrigatórios.'
        });
    }

    let db;

    try {
        db = await conectar();
        console.log("Iniciando consulta ao banco de dados, para encontrar o usuário");
        // const resultado = await db.query('SELECT id, email, nome, senha FROM usuarios WHERE email = $1', [email]);
        const resultado = await db.query(
            'SELECT id, email, nome, senha, cpf FROM usuarios WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            console.error("Usuário não encontrado");
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Email ou senha incorretos.'
            });
        }

        console.log("Usuário encontrado");
        const usuario = resultado.rows[0];

        const senhaCerta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCerta) {
            console.error("Não foi encontrado senha correta no banco de dados");
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Email ou senha incorretos.'
            });
        }


        const token = jwt.sign(
            {
                id: usuario.id,    
                email: usuario.email, 
                nome: usuario.nome,   
                cpf: usuario.cpf      
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
                nome: usuario.nome,
                cpf: usuario.cpf
            }
        });

        console.log("Login Realizado com BRUTALIDADE total, O " + `usuario ${usuario.nome} está logado`);
    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor.'
        });
    }
    finally {
        if (db) db.end();
        console.log("Conexão com o banco encerrado");
    }
});


export default router;
// export {token};
