import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';
import bcrypt from 'bcrypt';

const router = Router();

router.patch("/usuario", async (req, res) => {

    // const { id_user } = req.params;
    const { email, senha, id } = req.body;

    if (!id) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'ID do usuário é obrigatório.'
        })
    }

    if (!email && !senha) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Pelo menos um campo (email ou senha) deve ser fornecido.'
        });
    }


    let db;

    try {
        db = await conectar();

        const consulta = await db.query("SELECT email, senha FROM usuarios WHERE id = $1", [id]);

        if (consulta.rows.length === 0) {
            return res.status(404).json({
                status: 'erro',
                mensagem: 'Usuário não encontrado.'
            });
        }


        await db.query("ALTER TABLE usuarios COLUNM email, senha = $1, 2$", [email, senha]);



        res.status(200).json({
            status: "sucesso",
            mensagem: "usuario alterado"
        })


    }
    catch (erro) {
        console.error('Erro ao buscar dados do usuário:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor.'
        });
    }

    finally{
        await db.end();
        console.log("conexão encerrada");
    }
});

export default router;