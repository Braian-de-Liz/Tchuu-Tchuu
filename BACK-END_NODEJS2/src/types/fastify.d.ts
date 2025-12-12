// // src/types/fastify.d.ts
import { FastifyInstance } from 'fastify';
import { WebSocket, WebSocketServer } from 'ws';

interface UserData {
    ws: WebSocket;
    name: string;
    color: string;
}

interface ChatDecoration {
    broadcastMessage: (mensagem: { senderId: string, content: string, timestamp: string }) => void;
    broadcastSystemMessage: (conteudo: string) => void;
    usuarios: Map<string, UserData>;
}


declare module 'fastify' {
    
    interface FastifyInstance {
        
        websocketServer: WebSocketServer; 
        
        ws: {
            on(event: 'connection', handler: (ws: WebSocket, req: any) => void): void;
        };

        chat: ChatDecoration;
    }
}