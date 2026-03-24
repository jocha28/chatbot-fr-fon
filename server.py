import os
import torch
import scipy.io.wavfile
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from transformers import VitsModel, AutoTokenizer
import io

app = Flask(__name__)
CORS(app)

# Chargement du modèle MMS TTS Fon
print("Chargement du modèle MMS TTS Fon (facebook/mms-tts-fon)...")
model_id = "facebook/mms-tts-fon"
model = VitsModel.from_pretrained(model_id)
tokenizer = AutoTokenizer.from_pretrained(model_id)
print("Modèle chargé avec succès.")

@app.route('/tts', methods=['POST'])
def tts():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "Texte manquant"}), 400

    print(f"Génération audio pour : {text}")
    
    inputs = tokenizer(text, return_tensors="pt")
    
    with torch.no_grad():
        output = model(**inputs).waveform
    
    # Conversion du tenseur en fichier audio en mémoire
    buffer = io.BytesIO()
    scipy.io.wavfile.write(buffer, rate=model.config.sampling_rate, data=output.numpy().T)
    buffer.seek(0)
    
    return send_file(
        buffer,
        mimetype="audio/wav",
        as_attachment=True,
        download_name="speech.wav"
    )

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model": model_id})

if __name__ == '__main__':
    # On écoute sur le port 5000 par défaut
    app.run(host='0.0.0.0', port=5000, debug=False)
