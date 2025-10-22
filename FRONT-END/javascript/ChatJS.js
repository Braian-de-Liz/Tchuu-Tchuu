document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.querySelector('.message-input textarea');
    const sendButton = document.querySelector('.message-input button');
    const messagesContainer = document.getElementById('messages');
    let ws;
    let userId;

    const userColors = ['#03A9F4', '#4CAF50', '#FF5722', '#9C27B0', '#607D8B', '#FFC107'];

    function connectWebSocket() {
        userId = crypto.randomUUID();
        
        
        const userName = localStorage.getItem("usuarioNome") || "Usuário Anônimo";
        const userColor = userColors[Math.floor(Math.random() * userColors.length)];

  
        ws = new WebSocket('wss://tchuu-tchuu-server-chat.onrender.com'); // Para produção

        ws.onopen = () => {
            console.log('Conectado ao WebSocket');
            ws.send(JSON.stringify({ 
                type: 'register', 
                userId: userId, 
                name: userName,     
                color: userColor 
            }));
        };

        ws.onmessage = (event) => {
            let message;
            try {
                message = JSON.parse(event.data);
            } catch (e) {
                console.error('Erro ao parsear mensagem:', event.data);
                return;
            }

            if (message.type === 'system') {
                addSystemMessage(message.content);
            } else if (message.type === 'message') {
                addMessage(
                    message.sender,
                    message.content,
                    message.color,
                    message.isYou
                );
            }
        };

        ws.onclose = () => {
            console.log('WebSocket desconectado. Tentando reconectar...');
            addSystemMessage("Conexão perdida. Reconectando...");
            setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (error) => {
            console.error('Erro no WebSocket:', error);
        };
    }

    function addMessage(sender, text, color, isYou) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isYou ? 'mensagem-user' : 'mensagem-outro';

        const senderSpan = document.createElement('span');
        senderSpan.textContent = sender + ': ';
        senderSpan.style.color = color;
        senderSpan.style.fontWeight = 'bold';

        const textP = document.createElement('p');
        textP.appendChild(senderSpan);
        textP.appendChild(document.createTextNode(text));

        messageDiv.appendChild(textP);
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function addSystemMessage(text) {
        const systemDiv = document.createElement('div');
        systemDiv.className = 'system-message';
        systemDiv.textContent = text;
        messagesContainer.appendChild(systemDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const text = messageInput.value.trim();
        if (text && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'message',
                content: text
            }));
            messageInput.value = '';
        } else if (text && (!ws || ws.readyState !== WebSocket.OPEN)) {
            console.warn('WebSocket não está aberto. Tentando reconectar...');
            addSystemMessage("Conexão instável. Aguarde...");
        }
    }

    connectWebSocket();
});