document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");

    // Função para adicionar mensagens ao chat
    function addMessage(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.classList.add("message", `message-${sender}`);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rolar para baixo automaticamente
    }

    // Evento de envio de mensagem
    sendButton.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message !== "") {
            addMessage(message, "user"); // Envia a mensagem do usuário
            messageInput.value = ""; // Limpa o campo de entrada

            // Simula uma resposta do bot (apenas para demonstração)
            setTimeout(() => {
                addMessage("Recebi sua mensagem!", "bot");
            }, 1000);
        }
    });

    // Permitir envio com Enter
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendButton.click();
        }
    });
});