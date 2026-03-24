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

## Installation & Utilisation

### 1. Interface Web
Ouvrez simplement le fichier `index.html` dans un navigateur moderne.

### 2. Backend TTS Fon (Optionnel mais recommandé)
Pour activer la synthèse vocale en langue Fon (modèle Facebook MMS) :
1. Installez Python 3.9+
2. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
3. Lancez le serveur :
   ```bash
   python server.py
   ```
Le chatbot se connectera automatiquement à `http://localhost:5000` pour générer l'audio Fon.
3. Sélectionnez votre langue préférée (FR ou FON).
4. Tapez votre question ou utilisez le bouton **Micro** pour parler.

## 📄 Structure du Projet

- `index.html` : Structure de l'application.
- `style.css` : Design et animations premium.
- `app.js` : Logique du chatbot, audio et traitement des questions.
- `knowledge.js` : Base de connaissances extraite du programme social.
- `projet_de_societe.txt` : Version textuelle brute du document source.

---
*Développé pour favoriser la compréhension et l'interaction citoyenne autour du projet de société.*
