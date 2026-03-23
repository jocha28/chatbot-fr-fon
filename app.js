document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const responses = {
        "bonjour": "Ku do dágbe ! Nɛ̌ agbaza towe tɛ nɔ ? (Bonjour ! Comment vas-tu ?)",
        "merci": "A dúpɛ́ ! (Merci à toi !)",
        "au revoir": "A d'abɔ̌ ! (À bientôt !)",
        "comment ça va": "Agbaza towe tɛ nɔ ? (Comment vas-tu ?)",
        "ca va": "É nyɔ ! (Ça va bien !)",
        "bien": "É nyɔ ! (C'est bien !)"
    };

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        messageDiv.innerHTML = `
            <div class="bubble">${text}</div>
            <div class="time">${timeStr}</div>
        `;

        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (text === "") return;

        addMessage(text, 'user');
        userInput.value = "";

        // Simulation de la réponse de l'assistant
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let response = "Nǔ e a ɖɔ ɔ, un mɔ nukúnnú jɛ mɛ ǎ. (Je n'ai pas bien compris ce que tu as dit.)";
            
            for (const key in responses) {
                if (lowerText.includes(key)) {
                    response = responses[key];
                    break;
                }
            }
            
            addMessage(response, 'assistant');
        }, 800);
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
