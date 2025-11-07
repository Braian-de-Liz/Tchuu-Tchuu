// BACK-END_NODEJS\src\routers\rotas_e_estacoes\excluirEstacao.js
import { Router } from "express";
import jwt from 'jsonwebtoken';
import { conectar } from "../../databases/conectar_banco.js";


const router = Router();

router.delete("/estacoes/:id", async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            status: 'erro',
            menssagem: 'id inválido'
        });
    }

    const idEstacao = parseInt(id);

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token de autenticação não fornecido.'
        });
    }


    let db;
    let idUsuarioLogado;

    try {

        const achar_user = jwt.verify(token, process.env.JWT_SECRET);
        idUsuarioLogado = achar_user.id;

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

    try {
        db = await conectar();

        const consulta = `
            DELETE FROM estacoes
            WHERE id = $1 AND id_usuario_criador = $2
            RETURNING id; -- Retorna o ID da estação excluída (ou nenhum registro se não for encontrada)
        `;

        const parametro = [idEstacao, idUsuarioLogado];
        const resultado = await db.query(consulta, parametro);


        if (resultado.rowCount === 0) {
            return res.status(404).json({
                status: 'erro',
                mensagem: 'Estação não encontrada ou você não tem permissão para excluí-la.'
            });
        }
        const idEstacaoExcluida = resultado.rows[0].id;


        res.json({
            status: 'sucesso',
            mensagem: 'Estação excluída com sucesso!',
            id: idEstacaoExcluida 
        });
    }



    catch (erro) {
        console.error('Erro ao excluir estação:', erro);

         if (erro.code === '23503') { 
             return res.status(400).json({
                status: 'erro',
                mensagem: 'Erro: Não é possível excluir a estação porque ela está associada a uma rota.'
            });
        }

        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao tentar excluir a estação.'
        });
    }

    finally{
        console.log("conexão com banco de dados se encerrando");
        if (db) {
            await db.end();
        }
    }


});

// https://tchuu-tchuu-server-chat.onrender.com/api/estacoes method: DELETE

export default router;