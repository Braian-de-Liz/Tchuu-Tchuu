import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";
import jwt from "jsonwebtoken";


const router = Router();

router.delete("/sensores", async (req, res) => {

    const {cpf_user, nome_sensor} = req.body;

    if (!cpf_user || !nome_sensor) {
        return res.status(401).json({
            status: 'erro',
            menssagem: 'fic errada, faltou bagugas'
        });
    }

    let db;
    try {
        db = await conectar();

        const procurar_sensor = await db.query("DELETE FROM sensores WHERE cpf_user = $1 AND nome_sensor = $2", [cpf_user, nome_sensor]);


        if (procurar_sensor.rowCount === 0) {
            console.error("DB RESULTADO: 0 linhas afetadas. Retornando 404 (sensor não encontrado).");
            return res.status(404).json({
                status: 'erro',
                messagem: "Trem não encontrado"
            });
        }

        res.status(200).json({
            status: "sucesso",
            menssagem: "sensor deletado com sucesso"
        });
    }
    catch (error) {
        console.error("Erro, não foi possível deletar trem", error);

        return res.status(500).json({
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