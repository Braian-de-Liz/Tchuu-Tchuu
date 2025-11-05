import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";
import jwt from 'jsonwebtoken';

const router = Router();

router.patch("/estacao/:id", async (req, res) => {

    const { id } = req.body;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'ID da estação inválido ou não fornecido na URL.'
        });
    }

    const idEstacao = parseInt(id);

    const { nome, endereco, latitude, longitude, cidade, estado } = req.body;

    if (!nome && !endereco && !latitude && !longitude && !cidade && !estado) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Pelo menos um campo (nome, endereco, latitude, longitude, cidade, estado) deve ser fornecido para atualização.'
        });
    };


    if ((latitude !== undefined && isNaN(parseFloat(latitude))) || (longitude !== undefined && isNaN(parseFloat(longitude)))) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Latitude e Longitude devem ser números válidos, se fornecidas.'
        });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'token não fornecido, usuário não autêntificado'
        });
    }


    let idUsuarioLogado;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        idUsuarioLogado = decoded.id;

        if (!idUsuarioLogado) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Token inválido: ID do usuário não encontrado no payload.'
            });
        }

    } catch (erroToken) {
        console.error('Erro ao verificar token JWT:', erroToken);
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

    let db;

    try {
        db = await conectar();

        let consulta = 'UPDATE estacoes SET ';
        const params = [];
        let paramIndex = 1;

        if (nome !== undefined) {
            consulta += `nome = $${paramIndex}, `;
            params.push(nome);
            paramIndex++;
        }
        if (endereco !== undefined) {
            consulta += `endereco = $${paramIndex}, `;
            params.push(endereco !== '' ? endereco : null);
            paramIndex++;
        }
        if (latitude !== undefined) {
            consulta += `latitude = $${paramIndex}, `;
            params.push(parseFloat(latitude));
            paramIndex++;
        }
        if (longitude !== undefined) {
            consulta += `longitude = $${paramIndex}, `;
            params.push(parseFloat(longitude));
            paramIndex++;
        }
        if (cidade !== undefined) {
            consulta += `cidade = $${paramIndex}, `;
            params.push(cidade !== '' ? cidade : null);
            paramIndex++;
        }
        if (estado !== undefined) {
            consulta += `estado = $${paramIndex}, `;
            params.push(estado !== '' ? estado : null);
            paramIndex++;
        }

        consulta = query.slice(0, -2);

        consulta += ` WHERE id = $${paramIndex} AND id_usuario_criador = $${paramIndex + 1}`;
        params.push(idEstacao);
        params.push(idUsuarioLogado);


        const resultado = await db.query(query, params);

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                status: 'erro',
                mensagem: 'Estação não encontrada ou você não tem permissão para atualizá-la.'
            });
        }


        res.json({
            status: 'sucesso',
            mensagem: 'Estação atualizada com sucesso!'
        });
        console.log(`Estação com ID ${idEstacao} atualizada com sucesso pelo usuário com ID ${idUsuarioLogado}.`);

    }

    catch (erro) {
        console.error('Erro ao atualizar estação:', erro);
        if (erro.code === '23503') {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Erro: O usuário associado não foi encontrado no banco de dados.'
            });
        }
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao tentar atualizar a estação.'
        });
    }

    finally {
        if (db) {
            await db.end();
        }
    }

});



export default router;