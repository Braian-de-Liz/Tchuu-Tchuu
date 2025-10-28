import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';
import bcrypt from 'bcrypt';

const router = Router();

router.patch("/usuario", async (req, res) => {

    // const { id_user } = req.params;
    const { email, senha, id } = req.body;

    if (!id) {
        console.log("o id não foi enviado na requisição")
        return res.status(400).json({
            status: 'erro',
            mensagem: 'ID do usuário é obrigatório.'
        })
    }

    if (!email && !senha) {
        console.log("requisição vazia");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Pelo menos um campo (email ou senha) deve ser fornecido.'
        });
    }


    let db;

    try {
        db = await conectar();
        console.log("banco de dados conectado");

        const consulta = await db.query("SELECT email, senha FROM usuarios WHERE id = $1", [id]);

        if (consulta.rows.length === 0) {
            return res.status(404).json({
                status: 'erro',
                mensagem: 'Usuário não encontrado.'
            });
        }


        let query = 'UPDATE usuarios SET ';
        const params = [];
        let paramIndex = 1;


        if (email) {
            query += `email = $${paramIndex}`;
            params.push(email);
            paramIndex++;
        }

        if (senha) {
            const senha_segura = await bcrypt.hash(senha, 10);
            query += `senha = $${senha_segura}`;
            params.push(senha_segura);
            paramIndex++;
        }



        query = query.slice(0, -2);
        query += ` WHERE id = $${paramIndex}`;
        params.push(id);

        await db.query(query, params);
        console.log("Query monstado e enviado ao banco para consulta");

        res.json({
            status: 'sucesso',
            mensagem: 'Dados atualizados com sucesso!'
        });



    } catch (erro) {
        console.error('Erro ao atualizar dados do usuário:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao tentar atualizar os dados.'
        });


    } finally {
        if (db) {
            await db.end();
            console.log("conexão com o banco finalizada.")
        }
    }
});

export default router;