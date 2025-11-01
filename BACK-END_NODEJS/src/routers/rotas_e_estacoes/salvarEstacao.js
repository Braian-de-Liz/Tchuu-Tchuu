// BACK-END_NODEJS/src/routers/rotas_estacoes/salvarEstacao.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.post("/estacoes", async (req, res) => {
    const { nome, endereco, latitude, longitude, cidade, estado } = req.body;

    if (!nome || !endereco || !latitude || !longitude || !cidade || !estado) {
        console.error("Dados incompletos: nome, endereco, latitude e longitude são obrigatórios.");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Dados incompletos: nome, endereco, latitude e longitude são obrigatórios.'
        });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Latitude e Longitude devem ser números válidos.'
        });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token de autenticação não fornecido.'
        });
    }

    let idUsuarioCriador;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        idUsuarioCriador = decoded.id; 

    } catch (erro) {
        console.error('Erro ao verificar token JWT:', erro);
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

    let db;
    try {
        db = await conectar();


        const query = `
            INSERT INTO estacoes (nome, endereco, latitude, longitude, cidade, estado, id_usuario_criador)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;
        const parametros = [nome, endereco || null, lat, lng, cidade || null, estado || null, idUsuarioCriador];
        //                                        $1  $2     $3   $4   $5   $6   $7

        const resultado = await db.query(query, parametros);

        const idNovaEstacao = resultado.rows[0].id;

        console.log("Estação cadastrada com sucesso");
        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Estação criada com sucesso!',
            id: idNovaEstacao
        });

    } catch (erro) {
        console.error('Erro ao salvar estação:', erro);
        if (erro.code === '23503') { 
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Erro: O usuário associado não foi encontrado no banco de dados.'
            });
        }
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao salvar a estação.'
        });

        
    } finally {

        if (db) {
            console.log("Encerrando conexão com o banco de dados");
            await db.end();
        }
    }
});

export default router;