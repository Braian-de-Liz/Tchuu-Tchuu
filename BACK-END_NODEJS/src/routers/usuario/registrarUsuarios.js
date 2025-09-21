// src/routers/usuario/registrarUsuarios.js
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { conectar } from '../../databases/conectar_banco.js'; 

const router = Router();
const SALT_ROUNDS = 10;

router.post('/usuarios', async (req, res) => {
  const { nome, cpf, email, senha, RegistroFun, dataNasc } = req.body;

  if (!nome || !cpf || !email || !senha || !RegistroFun || !dataNasc) {
    return res.status(400).json({
      status: 'erro',
      mensagem: 'Preencha todos os campos'
    });
  }

  let db;
  try {
    db = await conectar(); 

    const [existente] = await db.execute(
      'SELECT cpf, email FROM usuarios WHERE cpf = ? OR email = ?',
      [cpf, email]
    );

    if (existente.length > 0) {
      const campo = existente[0].cpf === cpf ? 'CPF' : 'e-mail';
      return res.status(409).json({
        status: 'erro',
        mensagem: `${campo} já cadastrado.`
      });
    }

    const senha_segura = await bcrypt.hash(senha, SALT_ROUNDS);

    await db.execute(
      `INSERT INTO usuarios (nome, cpf, email, senha, registro_fun, data_nasc) VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, cpf, email, senha_segura, RegistroFun, dataNasc]
    );

    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Usuário cadastrado com sucesso!'
    });

  } catch (erro) {
    console.error("Erro ao cadastrar", erro);
    res.status(500).json({
      status: 'erro',
      mensagem: "Erro interno do servidor"
    });
  } finally {
    if (db) db.end(); // Fecha conexão
  }
});

export default router;