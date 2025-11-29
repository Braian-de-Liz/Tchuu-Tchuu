// BACK-END_NODEJS\src\routers\alertas\getAlerts.js
import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.get("/ocorrencias", async (req, res) => {
    
    let db;
    try {
        db = await conectar();
        

        const sql = `
            SELECT 
                oa.id_ocorrencia,
                oa.valor_lido,
                TO_CHAR(oa.timestamp_disparo, 'YYYY-MM-DD HH24:MI:SS') as timestamp_disparo,
                a.tipo_alerta,      -- <--- O NOME DO EVENTO
                a.valor_limite,
                s.nome_sensor
            FROM ocorrencias_alertas oa
            JOIN alertas a ON oa.id_alerta = a.id_alerta
            JOIN sensores s ON a.id_sensor = s.id_sensor
            WHERE oa.status_alerta = 'ABERTO' -- Filtra apenas os alertas ativos/não resolvidos
            ORDER BY oa.timestamp_disparo DESC;
        `;
        
        const resultado = await db.query(sql);

        return res.status(200).json({
            status: 'sucesso',
            mensagem: 'Ocorrências de alertas listadas com sucesso.',
            ocorrencias: resultado.rows
        });
        
    } catch (error) {
        console.error("Erro ao listar ocorrências (GET /api/ocorrencias):", error);
        
        return res.status(500).json({
            status: 'erro',
            mensagem: 'Falha interna ao buscar ocorrências de alertas.'
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;