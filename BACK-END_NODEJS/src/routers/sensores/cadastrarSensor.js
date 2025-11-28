import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.post("/sensores", async (req, res) => {
    console.log("rota iniciada para cadastro de sensor");
    const { nome_sensor, tipo_sensor, nome_trem, data, cpf } = req.body; 

    if (!nome_sensor || !tipo_sensor || !nome_trem || !data || !cpf) {
        console.error("erro ao receber ou preencher dados");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha todos os campos obrigatórios (Nome Sensor, Tipo, Nome do Trem, Data, CPF).'
        });
    }
    
    const cpfTRUE = cpf.replace(/[^\d]/g, '');

    if (cpfTRUE.length !== 11) {
        console.error("Erro: CPF inválido ou com tamanho incorreto.");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'O CPF deve conter exatamente 11 dígitos numéricos válidos.'
        });
    }

    let db;

    try {
        db = await conectar();
        console.log("aguardando conecxão com banco");


        const trem_resultado = await db.query(
            "SELECT id FROM trens WHERE nome_trem = $1 AND cpf_user = $2", 
            [nome_trem, cpfTRUE]
        );

        if (trem_resultado.rows.length === 0) {
            console.error("Trem não encontrado ou usuário não tem permissão.");
            return res.status(404).json({
                status: 'erro',
                mensagem: `Trem '${nome_trem}' não encontrado ou você não tem permissão para cadastrar sensores nele.`
            });
        }
        
        const id_trem_encontrado = trem_resultado.rows[0].id; 


        const existente = await db.query(
            "SELECT id_sensor FROM sensores WHERE nome_sensor = $1 AND cpf_user = $2 AND id_trem = $3", 
            [nome_sensor, cpfTRUE, id_trem_encontrado]
        );

        if (existente.rows.length > 0) {
            console.error("sensor já existente para este trem e usuário");
            return res.status(409).json({
                status: 'erro',
                mensagem: `Um sensor com o nome '${nome_sensor}' já está cadastrado neste trem (${nome_trem}).`
            });
        }
        

        await db.query(
            "INSERT INTO sensores (nome_sensor, tipo_sensor, id_trem, data, cpf_user) VALUES ($1, $2, $3, $4, $5)", 
            [nome_sensor, tipo_sensor, id_trem_encontrado, data, cpfTRUE]
        );

        res.status(201).json({
            status: 'sucesso',
            mensagem: `Sensor '${nome_sensor}' cadastrado com sucesso e ligado ao trem '${nome_trem}'!`
        });
        console.log("O sensor foi cadastrado com Sucesso");

    }
    catch (erro) {
        console.error("Erro ao cadastrar", erro);
        res.status(500).json({
            status: 'erro',
            mensagem: "Erro interno do servidor ao tentar ligar sensor ao trem."
        });
    }

    finally {
        if (db) db.end();
        console.log("conecxão fechada");
    }

});

export default router;