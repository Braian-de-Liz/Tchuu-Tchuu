import { Router } from "express"; 
import { conectar } from "../../databases/conectar_banco.js"; 
import { Request, Response } from "express"; 

type DBClient = any; 

interface SensorUpdateBody {
    cpf_user: string;
    nome_sensor: string; 
    novo_nome_sensor: string; 
}

const router = Router();

router.patch("/sensores", async (req, res) => {
    const body = req.body as SensorUpdateBody;
    const { cpf_user, nome_sensor, novo_nome_sensor } = body;

    if (!cpf_user || !nome_sensor || !novo_nome_sensor) {
        console.error("Dados indisponíveis para atualização...");
        return res.status(400).json({ 
            status: 'erro',
            mensagem: 'CPF do usuário, nome atual e novo nome do sensor são obrigatórios.'
        });
    }
    
    if (novo_nome_sensor.trim() === "") {
        return res.status(400).json({ 
            status: 'erro',
            mensagem: 'O novo nome do sensor não pode ser vazio.'
        });
    }


    let db: DBClient | null = null;
    let resultado: any;

    try {
        db = await conectar(); 

        const sql = `
            UPDATE sensores 
            SET nome_sensor = $1 
            WHERE nome_sensor = $2 AND cpf_user = $3 
            RETURNING *;
        `;
        
        const params = [novo_nome_sensor, nome_sensor, cpf_user];

        resultado = await db.query(sql, params);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ 
                status: 'erro',
                mensagem: `Sensor '${nome_sensor}' não encontrado ou você não tem permissão para alterá-lo.`
            });
        }

        return res.status(200).json({
            status: 'sucesso',
            mensagem: `Sensor '${nome_sensor}' renomeado com sucesso para '${novo_nome_sensor}'.`,
            sensor: resultado.rows[0]
        });
    }
    catch (erro) {
        console.error("Erro ao atualizar o sensor no banco de dados:", erro);
        return res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao tentar atualizar o sensor.'
        });
    }
    finally{
        if(db){
            await db.end(); 
        }
    }
});


export default router;