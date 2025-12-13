// BACK-END_NODEJS2\src\connections\chatServer.ts - VERSÃO COM DEBUG DETALHADO
import { FastifyPluginAsync } from 'fastify'; 
import fp from 'fastify-plugin'; 
import { WebSocket } from 'ws'; 

export interface UserData { 
    ws: WebSocket;
    name: string;
    color: string;
}

const chatWebSocketPlugin: FastifyPluginAsync = async (app, options) => { 
    
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


    (app as any).get('/ws/chat', { websocket: true }, (connection: any, request: any) => {
        
        console.log('=== DEBUG DETALHADO WebSocket ===');
        console.log('Tipo completo do connection:', connection);
        console.log('Chaves disponíveis no connection:');
        if (connection && typeof connection === 'object') {
            Object.keys(connection).forEach(key => {
                console.log(`   ${key}:`, typeof connection[key], '=', connection[key]);
            });
        }
        
        console.log('connection.constructor.name:', connection?.constructor?.name);
        console.log('É instância de WebSocket?', connection instanceof WebSocket);
        console.log('Tem método send?', typeof connection?.send === 'function');
        console.log('Tem método on?', typeof connection?.on === 'function');
        
        let ws: WebSocket | null = null;
        
        console.log('Tentando acessar propriedades internas...');
        
        if (connection && typeof connection.send === 'function') {
            console.log('Encontrado: connection É o WebSocket');
            ws = connection;
        }
        else if (connection?._socket && typeof connection._socket.send === 'function') {
            console.log('Encontrado: connection._socket é o WebSocket');
            ws = connection._socket;
        }
        else if (connection?.socket && typeof connection.socket.send === 'function') {
            console.log('Encontrado: connection.socket é o WebSocket');
            ws = connection.socket;
        }
        else if (connection) {
            for (const key in connection) {
                const value = connection[key];
                if (value && typeof value.send === 'function' && typeof value.on === 'function') {
                    console.log(`Encontrado: connection.${key} é o WebSocket`);
                    ws = value;
                    break;
                }
            }
        }
        
        console.log('WebSocket identificado:', ws ? 'SIM' : 'NÃO');
        
        if (!ws) {
            console.error('RRO: Não consegui identificar o WebSocket na estrutura:');
            console.error('Estrutura completa:', JSON.stringify(connection, getCircularReplacer(), 2));
            console.error('sando app.websocketServer diretamente...');
            
            if (app.websocketServer) {
                console.log('Usando abordagem alternativa via app.websocketServer');
                return;
            }
            return;
        }
        
        let idUsuario: string | null = null;
        console.log('Cliente WebSocket conectado via rota /ws/chat!');

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
                    ws: ws!,
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

function getCircularReplacer() {
    const seen = new WeakSet();
    return (key: string, value: any) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
        }
        return value;
    };
}

export default fp(chatWebSocketPlugin, {
    name: 'chat-server' 
});