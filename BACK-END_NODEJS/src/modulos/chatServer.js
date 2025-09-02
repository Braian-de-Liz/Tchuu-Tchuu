// src/modulos/chatServer.js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const users = new Map();

wss.on('connection', (ws) => {
    let userId = null;
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'register') {
            userId = data.userId;
            users.set(userId, {
                ws,
                name: data.name,
                color: data.color
            });
            broadcastSystemMessage(`${data.name} entrou no chat`);
            return;
        }

        if (data.type === 'message') {
            broadcastMessage({
                senderId: userId,
                content: data.content,
                timestamp: new Date().toLocaleTimeString()
            });
        }
    });

    ws.on('close', () => {
        if (userId && users.has(userId)) {
            const user = users.get(userId);
            broadcastSystemMessage(`${user.name} saiu do decrypt`);
            users.delete(userId);
        }
    });
});

function broadcastMessage(message) {
    const sender = users.get(message.senderId);
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'message',
                sender: sender.name,
                color: sender.color,
                content: message.content,
                time: message.timestamp,
                isYou: client === users.get(message.senderId)?.ws
            }));
        }
    });
}

function broadcastSystemMessage(content) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'system',
                content: content
            }));
        }
    });
}

export { wss, broadcastMessage, broadcastSystemMessage, users };