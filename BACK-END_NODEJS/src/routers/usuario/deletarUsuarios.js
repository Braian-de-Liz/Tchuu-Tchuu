// src/routers/usuario/deletarUsuarios.js
import { Router } from "express";
import { conectar } from "../../databases/conectar_banco.js";

const router = Router();

router.delete('/usuarios', async (req, res) => {
    const { cpf, id } = req.body;

    if (!cpf || cpf.length != 11 || !id) {
        console.error('cpf inválido, erro na rota');
        return res.status(400).json({
            status: 'erro',
            mensagem: 'CPF inválido. Deve conter 11 dígitos.'
        });
    }
    
    const fundadores = [1, 5, 49, 14].map(String); 
    
    if (fundadores.includes(String(id))) { 
        console.error("Não pode deletar os fundadores");
        
        return res.status(403).json({ 
            status: 'protecao',
            mensagem: 'Impossível deletar esse usuário, ele é um fundador do tchuu-tchuu.'
        });
        
    }

    let db;
    try {
        db = await conectar();
        console.log("banco de dados conectado");

        console.log("consulta procurando o usuário solicitado");
        const resultado = await db.query('DELETE FROM usuarios WHERE id = $1 AND cpf = $2 RETURNING id', [id, cpf]);


        if (resultado.rowCount === 0) {
            console.error("usuário não encontrado");
            return res.status(404).json({
                status: 'erro',
                mensagem: 'Usuário não encontrado.'
            });
        }


        res.json({
            status: 'sucesso',
            mensagem: 'Usuário excluído com sucesso !'
        });

    }
    catch (erro) {
        console.error('Erro ao excluir usuário:', erro);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor porque isso?.'
        });

    }

    finally {
        if (db) db.end();
    }

});

export default router;
