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
            mensagem: 'preencha os campos'
        });

    }

    if (cpf.length !== 11) {
        console.error("Erro, CPF inválido");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'inválidez por CPF'
        });
    }

    const cpfTRUE = cpf.replace(/[^\d]/g, '');

    let db;

    try {
        db = await conectar();
        console.log("aguardando conecxão com banco");

        const existente = await db.query("SELECT cpf FROM sensores WHERE cpf = $1", [cpfTRUE]);

        if (existente.rows.length > 0) {

            // const campo = existente.rows[0].cpf === cpfTRUE;
            console.error("sensor já existente");
            return res.status(409).json({
                status: 'erro',
                mensagem: `${campo} já cadastrado.`
            });
        }

        await db.query("INSERT INTO sensores (tipo_sensor, marca_sensor, data, cpf) VALUES ($1, $2, $3, $4)", [tipo_sensor, marca_sensor, data, cpfTRUE]);

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