// src/modulos/chatServer.js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const users = new Map();

wss.on('connection', (ws) => {
  let userId = null;

  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (e) {
      console.error('❌ Mensagem inválida:', data.toString());
      return;
    }

    if (message.type === 'register') {
      userId = message.userId;
      users.set(userId, {
        ws,
        name: message.name,
        color: message.color
      });
      broadcastSystemMessage(`${message.name} entrou no chat`);
      return;
    }

    if (message.type === 'message') {
      broadcastMessage({
        senderId: userId,
        content: message.content,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  });

  ws.on('close', () => {
    if (userId && users.has(userId)) {
      const user = users.get(userId);
      broadcastSystemMessage(`${user.name} saiu do chat`);
      users.delete(userId);
    }
  });
});

function broadcastMessage(message) {
  const sender = users.get(message.senderId);
  if (!sender) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'message',
          sender: sender.name,
          color: sender.color,
          content: message.content,
          time: message.timestamp,
          isYou: client === sender.ws
        })
      );
    }
  });
}

function broadcastSystemMessage(content) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'system',
          content: content
        })
      );
    }
  });
}

export { wss, broadcastMessage, broadcastSystemMessage, users };