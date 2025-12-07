import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.get("/historico/sensor/:id_sensor", async (req, res) => {
    const { id_sensor } = req.params;
    const limite = req.query.limite || 20; 

    let db;
    try {
        db = await conectar();

        const sql = `
            SELECT valor, timestamp_leitura
            FROM leituras_sensores
            WHERE id_sensor = $1
            ORDER BY timestamp_leitura DESC
            LIMIT $2
        `;

        const resultado = await db.query(sql, [id_sensor, limite]);

  
        const dadosOrdenados = resultado.rows.reverse();

        res.status(200).json({
            status: 'sucesso',
            dados: dadosOrdenados
        });

    } catch (erro) {
        console.error("Erro ao buscar histórico:", erro);
        res.status(500).json({ status: 'erro', mensagem: 'Erro interno ao buscar dados do gráfico.' });
    } finally {
        if (db) await db.end();
    }
});

export default router;