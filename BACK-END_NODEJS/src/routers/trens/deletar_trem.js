import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();



router.delete("/trem", async (req, res) => {

    const { cpf_user, nome_trem } = req.params;



    if (!nome_trem || !cpf_user || cpf_user !== 11) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'CPF inválido. Deve conter 11 dígitos, ou nome não preenchido'
        });

    }

    console.log("");


    let db;

    try {

        db = await conectar();
        const consulta = await db.query("DELETE FROM trens WHERE cpf_user = $1", [cpf_user]);

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
        console, error("Erro, não foi possível delear trem", error);

        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno desse servidor que alunos do ensimo médio programaram'
        });


    }

    finally {
        if (db) db.end
    }

});


export default router;
