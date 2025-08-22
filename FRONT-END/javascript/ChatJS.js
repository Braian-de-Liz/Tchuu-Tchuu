document.addEventListener('DOMContentLoaded', () => {
    const campoMensagem = document.querySelector('.message-input textarea');
    const botaoEnviar = document.querySelector('.message-input button');
    const containerMensagens = document.getElementById('messages');
    let conexaoWebSocket;
    let idUsuario;

    const coresUsuarios = [
        '#03A9F4', '#4CAF50', '#FF5722', 
        '#9C27B0', '#607D8B', '#FFC107'
    ];

    function conectarWebSocket() {
        idUsuario = crypto.randomUUID();
        const nomeUsuario = `Usuário_${Math.floor(Math.random() * 1000)}`;
        const corUsuario = coresUsuarios[Math.floor(Math.random() * coresUsuarios.length)];

        // conexaoWebSocket = new WebSocket('ws://localhost:8080');
        conexaoWebSocket = new WebSocket('https://tchuu-tchuu-2.onrender.com');

        conexaoWebSocket.onopen = () => {
            conexaoWebSocket.send(JSON.stringify({
                type: 'register',
                userId: idUsuario,
                name: nomeUsuario,
                color: corUsuario
            }));
        };

        conexaoWebSocket.onmessage = (evento) => {
            const mensagem = JSON.parse(evento.data);
            
            if (mensagem.type === 'system') {
                adicionarMensagemSistema(mensagem.content);
            } else if (mensagem.type === 'message') {
                adicionarMensagem(
                    mensagem.sender,
                    mensagem.content,
                    mensagem.color,
                    mensagem.isYou
                );
            }
        };

        conexaoWebSocket.onclose = () => {
            adicionarMensagemSistema("Conexão perdida. Reconectando...");
            setTimeout(conectarWebSocket, 3000);
        };
    }

    function adicionarMensagem(remetente, texto, cor, ehVoce) {
        const divMensagem = document.createElement('div');
        divMensagem.className = ehVoce ? 'mensagem-user' : 'mensagem-outro';
        
        const spanRemetente = document.createElement('span');
        spanRemetente.textContent = remetente + ': ';
        spanRemetente.style.color = cor;
        spanRemetente.style.fontWeight = 'bold';
        
        const paragrafoTexto = document.createElement('p');
        paragrafoTexto.appendChild(spanRemetente);
        paragrafoTexto.appendChild(document.createTextNode(texto));
        
        divMensagem.appendChild(paragrafoTexto);
        containerMensagens.appendChild(divMensagem);
        rolarParaBaixo();
    }

    function adicionarMensagemSistema(texto) {
        const divSistema = document.createElement('div');
        divSistema.className = 'system-message';
        divSistema.textContent = texto;
        containerMensagens.appendChild(divSistema);
        rolarParaBaixo();
    }

    function rolarParaBaixo() {
        containerMensagens.scrollTop = containerMensagens.scrollHeight;
    }

    botaoEnviar.addEventListener('click', enviarMensagem);
    campoMensagem.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensagem();
        }
    });

    function enviarMensagem() {
        const texto = campoMensagem.value.trim();
        if (texto && conexaoWebSocket && conexaoWebSocket.readyState === WebSocket.OPEN) {
            conexaoWebSocket.send(JSON.stringify({
                type: 'message',
                content: texto
            }));
            campoMensagem.value = '';
        }
    }

    conectarWebSocket();
});