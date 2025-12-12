import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.get("/sensores", async (req, res) => { 
    console.log("Rota GET para listar sensores iniciada");
    
    const { cpf } = req.query; 

    if (!cpf) {
        console.error("CPF não fornecido na query.");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'O CPF é obrigatório para listar os sensores do usuário.'
        });
    }

    const cpfTRUE = cpf.replace(/[^\d]/g, '');

    if (cpfTRUE.length !== 11) {
        console.error("CPF inválido ou com tamanho incorreto.");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'O CPF deve conter exatamente 11 dígitos numéricos válidos.'
        });
    }

    let db;
    
    try {
        db = await conectar();

        const sql = `
            SELECT 
                s.id_sensor,
                s.nome_sensor,
                s.tipo_sensor,
                s.data_registro,
                t.nome_trem 
            FROM sensores s
            JOIN trens t ON s.id_trem = t.id
            WHERE s.cpf_user = $1
            ORDER BY s.id_sensor;
        `;

        const resultado = await db.query(sql, [cpfTRUE]);

        if (resultado.rowCount === 0) { 
            console.log(`Nenhum sensor encontrado para o CPF ${cpfTRUE}`);
            return res.status(404).json({
                status: 'sucesso', 
                mensagem: 'Nenhum sensor cadastrado para este usuário.',
                sensores: []
            });
        }

        return res.status(200).json({
            status: 'sucesso',
            mensagem: `${resultado.rows.length} sensores encontrados.`,
            sensores: resultado.rows
        });

    }
    catch (erro) {
        console.error("Erro ao buscar sensores no banco de dados:", erro);
        return res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao tentar listar sensores.'
        });
    }
    finally {
        if (db) {
            await db.end();
            console.log("Conexão fechada");
        }
    }
});

export default router;