import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.post("/sensores", async (req, res) => {
    console.log("rota iniciada para cadastro de sensor");
    const { tipo_sensor, marca_sensor, data, cpf } = req.body;

    if (!tipo_sensor || !marca_sensor || !data || !cpf) {
        console.error("erro ao receber ou preencher dados");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha todos os campos obrigatórios.'
        });
    }

    if (cpf.length !== 11) {
        console.error("Erro, CPF inválido");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'O CPF deve conter exatamente 11 dígitos.'
        });
    }

    const cpfTRUE = cpf.replace(/[^\d]/g, '');

    let db;

    try {
        db = await conectar();
        console.log("aguardando conecxão com banco");

        const existente = await db.query("SELECT cpf_user FROM sensores WHERE cpf_user = $1", [cpfTRUE]);

        if (existente.rows.length > 0) {
            console.error("sensor já existente");

            return res.status(409).json({
                status: 'erro',
                mensagem: 'Sensor já cadastrado com este CPF.'
            });
        }

        await db.query("INSERT INTO sensores (tipo_sensor, marca_sensor, data, cpf_user) VALUES ($1, $2, $3, $4)", [tipo_sensor, marca_sensor, data, cpfTRUE]);

        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Sensor cadastrado com sucesso!'
        });
        console.log("O sensor foi cadastrado com Sucesso");

    }
    catch (erro) {
        console.error("Erro ao cadastrar", erro);
        res.status(500).json({
            status: 'erro',
            mensagem: "Erro interno do servidor"
        });
    }

    finally {
        if (db) db.end();
        console.log("conecxão fechada");
    }

});

export default router;
