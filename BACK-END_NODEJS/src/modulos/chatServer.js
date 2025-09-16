// src/modulos/chatServer.js
import { WebSocketServer } from 'ws';

const servidorWebSocket = new WebSocketServer({ port: 8080  });

const usuarios = new Map();

servidorWebSocket.on('connection', (conexao) => {
    let idUsuario = null;
    
    conexao.on('message', (mensagem) => {
        const dados = JSON.parse(mensagem);
        
        if (dados.tipo === 'registrar') {
            idUsuario = dados.idUsuario;
            usuarios.set(idUsuario, {
                conexao,
                nome: dados.nome,
                cor: dados.cor
            });
            transmitirMensagemSistema(`${dados.nome} entrou no chat`);
            return;
        }

        if (dados.tipo === 'mensagem') {
            transmitirMensagem({
                remetenteId: idUsuario,
                conteudo: dados.conteudo,
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
    
    servidorWebSocket.clients.forEach((cliente) => {
        if (cliente.readyState === WebSocket.OPEN) {
            cliente.send(JSON.stringify({
                tipo: 'mensagem',
                remetente: remetente.nome,
                cor: remetente.cor,
                conteudo: mensagem.conteudo,
                horario: mensagem.horario,
                ehVoce: cliente === usuarios.get(mensagem.remetenteId)?.conexao
            }));
        }
    });
}

function transmitirMensagemSistema(conteudo) {
    servidorWebSocket.clients.forEach((cliente) => {
        if (cliente.readyState === WebSocket.OPEN) {
            cliente.send(JSON.stringify({
                tipo: 'sistema',
                conteudo: conteudo
            }));
        }
    });
}

export { servidorWebSocket, transmitirMensagem, transmitirMensagemSistema, usuarios };