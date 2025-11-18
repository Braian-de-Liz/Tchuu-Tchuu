// BACK-END_NODEJS\src\routers\trens_manutencao\tirar_manutencao.js
import { Router } from "express";
import jwt from 'jsonwebtoken';
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.delete("/manutencao", async (req, res) => {
    const { id_trem, cpf_user } = req.body;

    if (!id_trem || !cpf_user) {
        console.log("dados não preenchidos");
        return res.status(400).json({
            status: 'erro',
            menssagem: 'dados não recebido ou não preenchidos'
        });
    }
    console.log("dados recebidos");



    const cpf_limpo = cpf_user.replace(/[^\d]/g, '');

    if (cpf_limpo.length !== 11) {
        console.error("CPF inválido");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'CPF inválido. Deve conter 11 dígitos.' 
        });
    }
    let db;

    try {
        db = await conectar();
        const consulta = await db.query("DELETE FROM chamados_manutencao WHERE cpf_usuario_abertura = $1 AND id_trem = $2", [cpf_limpo, id_trem]);

        if (consulta.rowCount === 0) {
            console.log("DB RESULTADO: 0 linhas afetadas. Retornando 404 (Trem em manutenção não encontrado).");
            return res.status(404).json({
                status: 'erro',
                messagem: "Trem em manutenção não encontrado"
            });
        }

        return res.json({
            status: "sucesso",
            menssagem: "Trem em manutenção tirado da manutenção com sucesso"
        });
    }
    catch (erro) {
        console.error("Erro, não foi possível deletar trem", error);

        return res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno desse servidor que alunos do ensino médio programaram'
        });
    }

    finally {
        if (db) {
            console.log("encerrando conexão com o banco de dados");
            await db.end();
        }
    }


});

export default router;