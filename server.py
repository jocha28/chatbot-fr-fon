from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# Configuration CORS pour permettre au frontend d'appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chargement du document "Projet de Société"
PROJET_FILE = "projet_de_societe.txt"
if not os.path.exists(PROJET_FILE):
    raise Exception(f"Fichier {PROJET_FILE} non trouvé.")

with open(PROJET_FILE, "r") as f:
    knowledge_text = f.read()
    sentences = [s.strip() for s in knowledge_text.split('.') if len(s.strip()) > 20]

# Initialisation des modèles (peut prendre du temps au premier lancement)
print("Chargement des modèles d'IA locaux...")
try:
    # Modèle de recherche sémantique
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
    corpus_embeddings = embedder.encode(sentences, convert_to_tensor=True)

    # Modèle de traduction (NLLB-200 distilled 600M)
    model_name = "facebook/nllb-200-distilled-600M"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    translator = pipeline("translation", model=model, tokenizer=tokenizer)
except Exception as e:
    print(f"Erreur lors du chargement des modèles : {e}")
    # Fallback simple ou message d'erreur informatif
    embedder = None
    translator = None

class ChatRequest(BaseModel):
    text: str
    lang: str  # 'fr' or 'fon'

@app.post("/chat")
async def chat(request: ChatRequest):
    query = request.text
    target_lang = request.lang

    # 1. Si la question est en Fon, on la traduit en Français pour la recherche
    search_query = query
    if target_lang == 'fon' and translator:
        try:
            # fon_Latn -> fra_Latn
            result = translator(query, src_lang="fon_Latn", tgt_lang="fra_Latn", max_length=400)
            search_query = result[0]['translation_text']
        except:
            pass

    # 2. Recherche Sémantique (RAG)
    if embedder is not None:
        query_embedding = embedder.encode(search_query, convert_to_tensor=True)
        cos_scores = util.cos_sim(query_embedding, corpus_embeddings)[0]
        top_results = torch.topk(cos_scores, k=1)
        
        best_sentence = sentences[top_results.indices[0]]
        score = top_results.values[0].item()

        if score < 0.3:
            answer = "Désolé, je n'ai pas trouvé d'information précise dans le projet de société."
        else:
            answer = best_sentence
    else:
        answer = "Le moteur de recherche local est en cours d'initialisation ou indisponible."

    # 3. Si l'utilisateur est en mode Fon, on traduit la réponse du Français vers le Fon
    if target_lang == 'fon' and translator:
        try:
            # fra_Latn -> fon_Latn
            result = translator(answer, src_lang="fra_Latn", tgt_lang="fon_Latn", max_length=400)
            answer = result[0]['translation_text']
        except:
            pass

    return {"response": answer, "search_query": search_query}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
