# 🤖 Chatbot Intelligent Français-Fon (Projet de Société)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Pass-blue?style=for-the-badge)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

Ce chatbot intelligent a été conçu pour permettre à tout citoyen de poser des questions relatives au **Projet de Société (Programme Wadagni-Talata 2026)**. Il facilite l'accès à l'information grâce à un support bilingue et des fonctionnalités vocales.

## 🌟 Fonctionnalités

- **🧠 Intelligence Documentaire** : Réponses basées sur l'analyse en temps réel du programme social (extraction de plus de 18 000 mots).
- **🌍 Bilingue Français-Fon** : Support complet des deux langues avec changement dynamique de l'interface.
- **🎤 Interface Vocale (STT)** : Posez vos questions oralement grâce à la reconnaissance vocale intégrée.
- **🔊 Synthèse Vocale (TTS)** : Lecture automatique des réponses par l'assistant pour une accessibilité maximale.
- **📱 Design Premium** : Interface moderne, responsive et optimisée (Glassmorphism, Dark Mode).

## 🚀 Utilisation

### Mode Standard (Navigateur uniquement)

1. Ouvrez `index.html` dans votre navigateur.
2. Le chatbot fonctionnera avec une recherche par mots-clés de base.

### Mode Avancé (Intelligence & Fon Local)

Pour bénéficier de la recherche sémantique et d'une vraie traduction en Fongbé :

1. Installez les dépendances : `pip install -r requirements.txt`
2. Lancez le serveur : `python3 server.py`
3. Rafraîchissez `index.html`. Le chatbot se connectera automatiquement au serveur local.

## 📄 Structure du Projet

- `index.html` : Structure de l'application.
- `style.css` : Design et animations premium.
- `app.js` : Logique du chatbot et connexion au backend.
- `server.py` : Serveur Python (FastAPI) pour l'IA locale (NLLB-200).
- `requirements.txt` : Liste des bibliothèques Python nécessaires.
- `knowledge.js` / `projet_de_societe.txt` : Base de connaissances.

---
*Développé pour favoriser la compréhension et l'interaction citoyenne autour du projet de société.*
