document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const langFrBtn = document.getElementById('lang-fr');
    const langFonBtn = document.getElementById('lang-fon');

    let currentLang = 'fr';
    let isRecording = false;

    // Configuration de la reconnaissance vocale
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'fr-FR';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            handleSend();
        };

        recognition.onend = () => {
            isRecording = false;
            micBtn.classList.remove('recording');
        };
    }

    // Gestion de la langue
    langFrBtn.addEventListener('click', () => {
        currentLang = 'fr';
        langFrBtn.classList.add('active');
        langFonBtn.classList.remove('active');
        userInput.placeholder = "Posez votre question...";
    });

    langFonBtn.addEventListener('click', () => {
        currentLang = 'fon';
        langFonBtn.classList.add('active');
        langFrBtn.classList.remove('active');
        userInput.placeholder = "Kanbyɔ we d'é jí...";
    });

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

        if (sender === 'assistant') {
            speakText(text);
        }
    }

    // Synthèse vocale
    function speakText(text) {
        if (!window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLang === 'fr' ? 'fr-FR' : 'fr-FR'; // Fon n'est pas supporté nativement, on utilise le français
        window.speechSynthesis.speak(utterance);
    }

    // Recherche dans la base de connaissances (Simple Semantic/Keyword Search)
    function searchKnowledge(query) {
        const sentences = KNOWLEDGE_BASE.split(/[.!?\n]/);
        const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
        
        let bestSentence = "";
        let maxMatch = 0;

        sentences.forEach(s => {
            let matches = 0;
            keywords.forEach(k => {
                if (s.toLowerCase().includes(k)) matches++;
            });
            if (matches > maxMatch) {
                maxMatch = matches;
                bestSentence = s;
            }
        });

        if (maxMatch > 0) {
            return bestSentence.trim() + ".";
        }
        return null;
    }

    const fonResponses = {
        "bonjour": "Ku do dágbe ! Nɛ̌ un ka sixú d'alɔ we gbɔn ?",
        "merci": "A dúpɛ́ !",
        "au revoir": "A d'abɔ̌ !"
    };

    function handleSend() {
        const text = userInput.value.trim();
        if (text === "") return;

        addMessage(text, 'user');
        userInput.value = "";

        setTimeout(() => {
            let response = "";
            const found = searchKnowledge(text);

            if (currentLang === 'fr') {
                response = found || "Désolé, je n'ai pas trouvé d'information spécifique à ce sujet dans le programme. Pouvez-vous reformuler ?";
            } else {
                // Simulation Fon
                const lower = text.toLowerCase();
                if (lower.includes("bonjour")) response = fonResponses.bonjour;
                else if (lower.includes("merci")) response = fonResponses.merci;
                else response = found ? "Nǔ e a ɖɔ ɔ, un mɔ ɖò wemà ɔ mɛ: " + found : "Nǔ e a ɖɔ ɔ, un mɔ nukúnnú jɛ mɛ ǎ. Kanbyɔ d'é jí.";
            }
            
            addMessage(response, 'assistant');
        }, 800);
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    micBtn.addEventListener('click', () => {
        if (!recognition) {
            alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
            return;
        }
        if (isRecording) {
            recognition.stop();
        } else {
            isRecording = true;
            micBtn.classList.add('recording');
            recognition.start();
        }
    });
});
