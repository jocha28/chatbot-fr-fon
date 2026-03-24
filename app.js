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
    async function speakText(text) {
        if (currentLang === 'fr') {
            if (!window.speechSynthesis) return;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            window.speechSynthesis.speak(utterance);
        } else {
            // Appel au backend Python pour le TTS Fon (Modèle MMS)
            try {
                const response = await fetch('http://localhost:5000/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text })
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const audioUrl = URL.createObjectURL(blob);
                    const audio = new Audio(audioUrl);
                    audio.play();
                } else {
                    console.error("Erreur lors de la génération TTS Fon");
                }
            } catch (error) {
                console.error("Impossible de contacter le serveur TTS Fon:", error);
            }
        }
    }

    // Recherche dans la base de connaissances (RAG thématique v4)
    function searchKnowledge(query) {
        const stopWords = ['quel', 'quels', 'quelle', 'quelles', 'est', 'est-ce', 'que', 'pour', 'dans', 'le', 'la', 'les', 'des', 'du', 'une', 'un', 'projet', 'programme', 'societe', 'prevu', 'prevoyez'];
        const cleanQuery = query.toLowerCase().replace(/[?.,!]/g, '');
        // On garde les mots > 2 ou les chiffres isolés
        const queryWords = cleanQuery.split(' ').filter(w => (w.length > 2 || /^\d+$/.test(w)) && !stopWords.includes(w));
        
        if (queryWords.length === 0) return null;

        const themes = {
            'agriculture': ['agriculture', 'paysan', 'agricole', 'terre', 'culture', 'climat', 'semence'],
            'sante': ['santé', 'hopital', 'médecin', 'soins', 'médical', 'maladie', 'vaccin'],
            'education': ['éducation', 'école', 'enseignement', 'élève', 'étudiant', 'formation', 'emploi'],
            'cohesion': ['cohésion', 'justice', 'paix', 'liberté', 'démocratie', 'nationale', 'sécurité'],
            'economie': ['économie', 'croissance', 'finance', 'entreprise', 'industrie', 'commerce']
        };

        const paragraphs = KNOWLEDGE_BASE.split(/\n\s*\n/);
        let bestParagraph = "";
        let maxScore = 0;

        paragraphs.forEach(p => {
            const text = p.toLowerCase();
            const lines = text.split('\n');
            const firstLine = lines[0];
            let score = 0;
            
            queryWords.forEach(k => {
                const regex = new RegExp('\\b' + k + '\\b', 'g');
                const matches = (text.match(regex) || []).length;
                
                let weight = 1;
                if (firstLine.includes(k)) weight = 50; 
                
                // Boost massif pour "Priorité X"
                if (text.includes('priorité') && firstLine.includes(k) && /^\d+$/.test(k)) weight = 500;

                score += (matches * weight);
            });

            for (const theme in themes) {
                const queryHasTheme = queryWords.some(qw => themes[theme].includes(qw));
                const paraHasTheme = themes[theme].some(tw => firstLine.includes(tw));
                if (queryHasTheme && paraHasTheme) score += 200;
            }

            if (score > 0) {
                if (score > maxScore) {
                    maxScore = score;
                    bestParagraph = p;
                }
            }
        });

        return maxScore > 0 ? bestParagraph.trim() : null;
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
