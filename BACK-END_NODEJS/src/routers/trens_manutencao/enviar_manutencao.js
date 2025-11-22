// BACK-END_NODEJS/src/routers/trens_manutencao/enviar_manutencao.js
import { Router } from "express";
import jwt from 'jsonwebtoken';
import 
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.post("/manutencao", async (req, res) => {
    
    const { nomeTrem, numero_de_trem, descricao_problema, descricao_detalhada, cpf_user } = req.body;

    console.log("Dados do trem recebidos:", { nomeTrem, numero_de_trem, descricao_problema, descricao_detalhada, cpf_user }); 
    
    if (!nomeTrem || !numero_de_trem || !descricao_problema || !descricao_detalhada || !cpf_user) {
        console.log("algum dos dados necessários não veio com a requisição");
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha todos os campos'
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

    let decodedCpfDoToken;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        decodedCpfDoToken = decoded.cpf;

        if (!decodedCpfDoToken) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Token inválido: CPF do usuário não encontrado no payload.'
            });
        }

    } catch (erroToken) {
        console.error('Erro ao verificar token JWT:', erroToken);
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

    if (cpf_user !== decodedCpfDoToken) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'CPF do corpo da requisição não corresponde ao CPF do token JWT.'
        });
    }

    const cpf_correto = cpf_user.replace(/[^\d]/g, '');

    let db;
    try {
        db = await conectar();
        console.log("conexão com banco de dados iniciada");

        const procurar_trem = await db.query("SELECT * FROM trens WHERE nome_trem = $1 AND cpf_user = $2", [nomeTrem, cpf_correto]);

        if (procurar_trem.rowCount === 0) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'trem não encontrado ou não existente'
            });
        }

        const trem_defeituoso = procurar_trem.rows[0];
        console.log("Trem defeituoso encontrado:", trem_defeituoso);

        const query_insert_chamado = `
            INSERT INTO chamados_manutencao (id_trem, descricao_problema, descricao_detalhada, cpf_usuario_abertura)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;

        const params_insert = [
            trem_defeituoso.id,
            descricao_problema,
            descricao_detalhada || null,
            cpf_correto
        ];

        const resultado_insert = await db.query(query_insert_chamado, params_insert);

        const idNovoChamado = resultado_insert.rows[0].id;

        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Chamado de manutenção registrado com sucesso!',
            id: idNovoChamado
        });

        console.log(`Chamado de manutenção criado para o trem ID ${trem_defeituoso.id} (${trem_defeituoso.nome_trem}) pelo usuário com CPF ${cpf_correto}.`);

    } catch (erro) {
        console.error("Erro ao enviar para manutenção", erro);
        if (erro.code === '23503') { 
             return res.status(400).json({
                status: 'erro',
                mensagem: 'Erro: Trem ou usuário não encontrado no banco de dados.'
            });
        }
        res.status(500).json({
            status: 'erro',
            mensagem: "Erro interno do servidor"
        });
    } finally { 
        if (db) {
            await db.end();
            console.log("conexão com banco encerrada");
        }
    }
});

export default router;