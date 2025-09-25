import { Router } from "express";
import bcrypt from "bcrypt";
import { conectar } from "../../databases/conectar_banco";

const router = Router();

router.post('/usu_login', async (req, res) => {

    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Email e senha são obrigatórios.'
        });
    }



    let db;

    try {
        db = await conectar();
        const resultado = await db.query('SELECT id, email, senha FROM usuarios WHERE email = $1', [email]);





        if (resultado.rows.length === 0) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Email ou senha incorretos.'
            });
        }

        const usuario = resultado.rows[0];
        const senhaCerta = await bcrypt.compare(senha, usuario.senha);


        if (!senhaCorreta) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Email ou senha incorretos.'
            });
        }


        res.json({
            status: 'sucesso',
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id: usuario.id,
                email: usuario.email
            }
        });



    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(erro).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor.'
        });
    }
    finally {
        if (db) db.end();
    }
});


export default router;
