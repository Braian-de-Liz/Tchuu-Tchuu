import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.post("/sensores", async (req, res) => {
    console.log("rota iniciada para cadastro de sensor");
    // Recebe o nome do trem do formulário (em vez de id_trem ou marca)
    const { tipo_sensor, nome_trem, data, cpf } = req.body; 

    if (!tipo_sensor || !nome_trem || !data || !cpf) {
        console.error("erro ao receber ou preencher dados");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha todos os campos obrigatórios (Tipo, Nome do Trem, Data, CPF).'
        });
    }

    if(!cpf || cpf.length !== 11){
        console.error("cpf inválido");

        return res.status(400).json({
            status:'erro',
            mensagem:'cpf inválido'
        });
    }
    

    const cpfTRUE = cpf.replace(/[^\d]/g, '');

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
            "SELECT id FROM sensores WHERE cpf_user = $1 AND id_trem = $2", 
            [cpfTRUE, id_trem_encontrado]
        );

        if (existente.rows.length > 0) {
            console.error("sensor já existente para este trem e usuário");
            return res.status(409).json({
                status: 'erro',
                mensagem: `Um sensor já está cadastrado neste trem (${nome_trem}) por este usuário.`
            });
        }
        

        await db.query(
            "INSERT INTO sensores (tipo_sensor, id_trem, data, cpf_user) VALUES ($1, $2, $3, $4)", 
            [tipo_sensor, id_trem_encontrado, data, cpfTRUE]
        );

        res.status(201).json({
            status: 'sucesso',
            mensagem: `Sensor cadastrado com sucesso e ligado ao trem '${nome_trem}'!`
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