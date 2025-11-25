import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";


const router = Router();

router.patch("/sensores", async (req, res) => {
    const { cpf_user, nome_sensor, novo_nome_sensor } = req.body; 

    if (!cpf_user || !nome_sensor || !novo_nome_sensor) {
        console.error("Dados indisponíveis para atualização");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'CPF do usuário, nome atual e novo nome do sensor são obrigatórios.'
        });
    }

    let db;
    let resultado;

    try {
        db = await conectar(); 

     
        const sql = `
            UPDATE sensores 
            SET nome_sensor = $1 
            WHERE nome_sensor = $2 AND cpf_user = $3 
            RETURNING *;
        `;
        
        const params = [novo_nome_sensor, nome_sensor, cpf_user];

        // 3. Executa a consulta
        resultado = await db.query(sql, params);

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                status: 'erro',
                mensagem: `Sensor '${nome_sensor}' não encontrado ou você não tem permissão para alterá-lo.`
            });
        }

        // 5. Sucesso
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