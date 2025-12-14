import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.get("/ocorrencias", async (req, res) => {
    const { cpf } = req.query;

    if (!cpf) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'CPF obrigatório.'
        });
    }

    const cpfLimpo = cpf.replace(/\D/g, '');

    let db;
    try {
        db = await conectar();

        const sql = `
            SELECT 
                oa.id_ocorrencia,
                oa.valor_lido,
                oa.timestamp_disparo,
                a.tipo_alerta,
                s.nome_sensor
            FROM ocorrencias_alertas oa
            JOIN alertas a ON oa.id_alerta = a.id_alerta
            JOIN sensores s ON a.id_sensor = s.id_sensor
            WHERE oa.status_alerta = 'ABERTO' 
            AND s.cpf_user = $1
            ORDER BY oa.timestamp_disparo DESC
        `;

        const resultado = await db.query(sql, [cpfLimpo]);

        return res.status(200).json({
            status: 'sucesso',
            ocorrencias: resultado.rows
        });

    } catch (error) {
        console.error("Erro ao listar ocorrências:", error);
        return res.status(500).json({
            status: 'erro',
            mensagem: 'Falha interna ao buscar alertas.'
        });
    } finally {
        if (db) await db.end();
    }
});

export default router;