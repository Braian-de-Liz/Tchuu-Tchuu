// BACK-END_NODEJS2\src\connections\chatServer.ts
import { FastifyPluginAsync } from 'fastify'; 
import fp from 'fastify-plugin'; 
import { WebSocket } from 'ws'; 


export interface UserData { 
    ws: WebSocket;
    name: string;
    color: string;
}

const chatWebSocketPlugin: FastifyPluginAsync = async (app, options) => {
    
    app.register(require('@fastify/websocket'));
    
    const usuarios = new Map<string, UserData>();
    

    function broadcastSystemMessage(conteudo: string) {
        if (app.websocketServer) {
            app.websocketServer.clients.forEach((cliente: WebSocket) => {
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
    }
    

    function broadcastMessage(mensagem: { senderId: string, content: string, timestamp: string }) {
        const remetente = usuarios.get(mensagem.senderId);
        if (!remetente) return;

        if (app.websocketServer) {
            app.websocketServer.clients.forEach((cliente: WebSocket) => {
                
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
    }


    app.ws.on('connection', (ws, request) => {
        let idUsuario: string | null = null;
        console.log('Cliente WebSocket conectado!');

        ws.on('message', (dados) => {
            let mensagem: any;
            try {
                mensagem = JSON.parse(dados.toString());
            } catch (erro) {
                console.error('Mensagem JSON inválida:', dados.toString());
                return;
            }

            if (mensagem.type === 'register') {
                idUsuario = mensagem.userId;
                usuarios.set(idUsuario!, { 
                    ws: ws,
                    name: mensagem.name,
                    color: mensagem.color
                });
                broadcastSystemMessage(`${mensagem.name} entrou no chat`);
                return;
            }

            if (mensagem.type === 'message') {
                broadcastMessage({
                    senderId: idUsuario!, 
                    content: mensagem.content,
                    timestamp: new Date().toLocaleTimeString()
                });
            }
        });

        ws.on('close', () => {
            if (idUsuario && usuarios.has(idUsuario)) {
                const usuario = usuarios.get(idUsuario)!;
                broadcastSystemMessage(`${usuario.name} saiu do chat`);
                usuarios.delete(idUsuario);
                console.log('Cliente desconectado:', usuario.name);
            }
        });
    });

    app.decorate('chat', { broadcastMessage, broadcastSystemMessage, usuarios });

};

export default fp(chatWebSocketPlugin);