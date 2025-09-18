// src/modulos/chatServer.js
import { WebSocketServer } from 'ws';
const PORTA = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORTA });
const usuarios = new Map();

wss.on('connection', (ws) => {
  let idUsuario = null;

  ws.on('message', (dados) => {
    let mensagem;
    try {
      mensagem = JSON.parse(dados);
    } catch (erro) {
      console.error('Mensagem inválida:', dados.toString());
      return;
    }

    if (mensagem.type === 'register') {
      idUsuario = mensagem.userId;
      usuarios.set(idUsuario, {
        ws,
        name: mensagem.name,
        color: mensagem.color
      });
      broadcastarMensagemSistema(`${mensagem.name} entrou no chat`);
      return;
    }

    if (mensagem.type === 'message') {
      broadcastarMensagem({
        senderId: idUsuario,
        content: mensagem.content,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  });

  ws.on('close', () => {
    if (idUsuario && usuarios.has(idUsuario)) {
      const usuario = usuarios.get(idUsuario);
      broadcastarMensagemSistema(`${usuario.name} saiu do chat`);
      usuarios.delete(idUsuario);
    }
  });
});

function broadcastarMensagem(mensagem) {
  const remetente = usuarios.get(mensagem.senderId);
  if (!remetente) return;

  wss.clients.forEach((cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(
        JSON.stringify({
          type: 'message',
          sender: remetente.name,
          color: remetente.color,
          content: mensagem.content,
          time: mensagem.timestamp,
          isYou: cliente === remetente.ws
        })
      );
    }
  });
}

function broadcastarMensagemSistema(conteudo) {
  wss.clients.forEach((cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(
        JSON.stringify({
          type: 'system',
          content: conteudo
        })
      );
    }
  });
}

export { wss, broadcastarMensagem, broadcastarMensagemSistema, usuarios };