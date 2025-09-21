// src/modulos/chatServer.js
import { WebSocketServer } from 'ws';

let wss;

function setupWebSocket(server) {
  wss = new WebSocketServer({ server }); 
  const usuarios = new Map();

  wss.on('connection', (ws) => {
    let idUsuario = null;

    ws.on('message', (dados) => {
      let mensagem;
      try {
        mensagem = JSON.parse(dados);
      } catch (erro) {
        console.error('❌ Mensagem inválida:', dados.toString());
        return;
      }

      if (mensagem.type === 'register') {
        idUsuario = mensagem.userId;
        usuarios.set(idUsuario, {
          ws,
          name: mensagem.name,
          color: mensagem.color
        });
        broadcastSystemMessage(`${mensagem.name} entrou no chat`);
        return;
      }

      if (mensagem.type === 'message') {
        broadcastMessage({
          senderId: idUsuario,
          content: mensagem.content,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    });

    ws.on('close', () => {
      if (idUsuario && usuarios.has(idUsuario)) {
        const usuario = usuarios.get(idUsuario);
        broadcastSystemMessage(`${usuario.name} saiu do chat`);
        usuarios.delete(idUsuario);
      }
    });
  });

  function broadcastMessage(mensagem) {
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

  function broadcastSystemMessage(conteudo) {
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

  return { wss, broadcastMessage, broadcastSystemMessage, usuarios };
}

export { setupWebSocket };