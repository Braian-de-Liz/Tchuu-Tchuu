// BACK-END_NODEJS/src/routers/trens/registrar_trem.js
import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.post("/trem", async (req, res) => {
    console.log("Recebida requisição para registrar trem:", req.body); 

    const { nomeTrem, numero, fabricante, cpfUser, dataRegistro } = req.body;

    if (!nomeTrem || !numero || !fabricante || !cpfUser || !dataRegistro) {
        console.log("Erro: Campos obrigatórios faltando"); 
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha todos os campos obrigatórios: nomeTrem, numero, fabricante, cpfUser, dataRegistro'
        });
    }

    let db;

    try {
        const cpfTRUE = cpfUser.replace(/[^\d]/g, '');
        console.log("CPF limpo:", cpfTRUE); 

        if (cpfTRUE.length !== 11) {
            console.log("Erro: CPF inválido"); 
            return res.status(400).json({
                status: 'erro',
                mensagem: 'CPF inválido.'
            });
        }

        db = await conectar();
        console.log("Conectado ao banco"); 

        
        console.log("Verificando usuário com CPF:", cpfTRUE); 
        const usuarioExiste = await db.query('SELECT cpf FROM usuarios WHERE cpf = $1', [cpfTRUE]);
        console.log("Resultado da busca do usuário:", usuarioExiste.rows); 

        if (usuarioExiste.rows.length === 0) {
            console.log("Erro: Usuário não encontrado com CPF:", cpfTRUE); 
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Usuário não encontrado com o CPF fornecido.'
            });
        }

        console.log("Inserindo trem no banco..."); 

        await db.query(
            `INSERT INTO trens (nome_trem, numero, fabricante, cpf_user, data_registro)
             VALUES ($1, $2, $3, $4, $5)`,
            [nomeTrem, numero, fabricante, cpfTRUE, dataRegistro]
        );
        console.log("Trem inserido com sucesso!"); 

        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Trem registrado com sucesso!'
        });

    } catch (erro) {
        console.error("Erro ao registrar trem:", erro); 
        if (erro.code === '23505') {
             res.status(400).json({
                status: 'erro',
                mensagem: 'Já existe um trem com esse número.'
            });
        } else {
            res.status(500).json({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao registrar o trem.'
            });
        }
    } finally {
        if (db) {
            await db.end();
            console.log("Conexão com o banco fechada"); 
        }
    }
});

export default router;