document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");

    
    function addMessage(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.classList.add("message", `message-${sender}`);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; 
    }

    
    sendButton.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message !== "") {
            addMessage(message, "user");
            messageInput.value = ""; 

            setTimeout(() => {
                addMessage("Recebi sua mensagem!", "bot");
            }, 1000);
        }
    });

    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendButton.click();
        }
    });
});