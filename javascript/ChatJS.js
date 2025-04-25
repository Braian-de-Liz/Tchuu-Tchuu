document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("loginModal");
    const usernameInput = document.getElementById("usernameInput");
    const loginButton = document.getElementById("loginButton");

    const chatMessages = document.getElementById("chatMessages");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const emojiButton = document.getElementById("emojiButton");

    let username = "";

    // Modal de Login
    loginButton.addEventListener("click", () => {
        username = usernameInput.value.trim();
        if (username !== "") {
            loginModal.style.display = "none";
        } else {
            alert("Por favor, digite um nome de usuário.");
        }
    });

    // Função para adicionar mensagens
    function addMessage(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.classList.add("message", `message-${sender}`);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rolar para baixo automaticamente
    }

    // Envio de mensagem
    sendButton.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message !== "" && username !== "") {
            const fullMessage = `${username}: ${message}`;
            addMessage(fullMessage, "user");
            messageInput.value = "";
        }
    });

    // Permitir envio com Enter
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendButton.click();
        }
    });

    // Emoji Picker
    const picker = new EmojiButton();
    picker.on("emoji", (emoji) => {
        messageInput.value += emoji;
    });
    emojiButton.addEventListener("click", () => {
        picker.togglePicker(emojiButton);
    });
});