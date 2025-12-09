import { Router } from "express"
import { conectar } from "../../databases/conectar_banco.js"


const router = Router();

router.patch('/trens', async (req, res) => {

    const { cpf_user, nome_trem } = req.body;

    if (!cpf_user || !nome_trem) {
        console.log("dados com erros ");

        return res.status(401).json({
            status: 'erro',
            menssagem: 'dados não recebidos ou não enviados'
        });
    }

    let db;

    try {
        db = await conectar();

        const consulta = await db.query("UPDATE TABLE trens WHERE cpf_user, nome_trem", [cpf_user, nome_trem]);

        if (consulta.rowCount === 0) {
            return res.status(401).json({
                status: 'erro',
                menssagem: `trem ${nome_trem}, não encontrado`
            })
        }

    }
    catch (error) {
        console.error("Erro, não foi possível delear trem", error);

        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno desse servidor que alunos do ensimo médio programaram'
        });
    }

});

export default router;