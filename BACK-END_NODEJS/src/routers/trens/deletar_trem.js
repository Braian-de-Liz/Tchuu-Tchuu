// BACK-END_NODEJS\src\routers\trens\deletar_trem.js
import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.delete("/trens", async (req, res) => {


    const { cpf_user, nome_trem } = req.query;

    console.log("RECEBIDO: CPF e Nome:", cpf_user, nome_trem);


    if (!nome_trem || !cpf_user || cpf_user.length !== 11) {
        console.log("ERRO 400 - VALIDAÇÃO FALHOU: Dados ausentes ou CPF inválido.");

        return res.status(400).json({
            status: 'erro',
            mensagem: 'CPF inválido. Deve conter 11 dígitos, ou nome não preenchido'
        });

    }

    let db;

    try {
        db = await conectar();
        const sql = "DELETE FROM trens WHERE cpf_user = $1 AND nome_trem = $2";
        const valores = [cpf_user, nome_trem];

        const consulta = await db.query(sql, valores);

        if (consulta.rowCount === 0) {
            return res.status(404).json({
                status: 'erro',
                messagem: "Trem não encontrado"
            });
        }

        res.json({
            status: "sucesso",
            menssagem: "trem deletado com sucesso"
        });
    }
    catch (error) {
        console.error("Erro, não foi possível deletar trem", error);

        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno desse servidor que alunos do ensino médio programaram'
        });


    }

    finally {

        if (db) {
            console.log("finalizando conecxão com banco de dados");
            db.end();
        }
    }

});


export default router;