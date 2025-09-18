// src/modulos/chatServer.js
import { WebSocketServer } from 'ws';

const servidorWebSocket = new WebSocketServer({ port: 8080 });
const usuarios = new Map();

servidorWebSocket.on('connection', (conexao) => {
  let idUsuario = null;

  conexao.on('message', (dados) => {
    let mensagem;
    try {
      mensagem = JSON.parse(dados);
    } catch (erro) {
      console.error('❌ Mensagem inválida:', dados.toString());
      return;
    }

    if (mensagem.tipo === 'registrar') {
      idUsuario = mensagem.idUsuario;
      usuarios.set(idUsuario, {
        conexao,
        nome: mensagem.nome,
        cor: mensagem.cor
      });
      transmitirMensagemSistema(`${mensagem.nome} entrou no chat`);
      return;
    }

    if (mensagem.tipo === 'mensagem') {
      transmitirMensagem({
        remetenteId: idUsuario,
        conteudo: mensagem.conteudo,
        horario: new Date().toLocaleTimeString()
      });
    }
  });

  conexao.on('close', () => {
    if (idUsuario && usuarios.has(idUsuario)) {
      const usuario = usuarios.get(idUsuario);
      transmitirMensagemSistema(`${usuario.nome} saiu do chat`);
      usuarios.delete(idUsuario);
    }
  });
});

function transmitirMensagem(mensagem) {
  const remetente = usuarios.get(mensagem.remetenteId);
  if (!remetente) return;

  servidorWebSocket.clients.forEach((cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(
        JSON.stringify({
          tipo: 'mensagem',
          remetente: remetente.nome,
          cor: remetente.cor,
          conteudo: mensagem.conteudo,
          horario: mensagem.horario,
          ehVoce: cliente === remetente.conexao
        })
      );
    }
  });
}

function transmitirMensagemSistema(conteudo) {
  servidorWebSocket.clients.forEach((cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(
        JSON.stringify({
          tipo: 'sistema',
          conteudo: conteudo
        })
      );
    }
  });
}

export { 
  servidorWebSocket, 
  transmitirMensagem, 
  transmitirMensagemSistema, 
  usuarios 
};