import { Router } from "express";
import { conectar } from "../../databases/conectar_banco";

const router = Router();

router.delete('/usuarios/:cpf', async (req, res) => {
  
});



/* 
// src/routers/usuario/deletarUsuarios.js
import { Router } from 'express';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.delete('/usuarios/:cpf', async (req, res) => {
  const { cpf } = req.params;

  if (!cpf || cpf.length !== 11) {
    return res.status(400).json({
      status: 'erro',
      mensagem: 'CPF inválido'
    });
  }

  let db;
  try {
    db = await conectar();
    const [resultado] = await db.execute('DELETE FROM usuarios WHERE cpf = ?', [cpf]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        status: 'erro',
        mensagem: 'Usuário não encontrado'
      });
    }

    res.json({
      status: 'sucesso',
      mensagem: 'Usuário excluído com sucesso'
    });
  } catch (erro) {
    console.error('❌ Erro ao excluir:', erro);
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  } finally {
    if (db) db.end();
  }
});

export default router; // ✅ ESSE EXPORT É OBRIGATÓRIO
*/