<!--
Copyright (c) 2025 Cato Hansen. All rights reserved.
-->

# 🔑 AI-nøkler Forklart - Nora Setup

## 🎯 Hvorfor Trenger Nora 2 Nøkler?

### **GOOGLE_AI_API_KEY** (Hovedmotor)
- **Hva:** AI-chat (Gemini)
- **Brukes til:** Nora sine svar, samtaler, intelligens
- **Din nøkkel:** `AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE`
- **Kost:** Gratis (1500 req/dag)

### **OPENAI_API_KEY** (Embeddings)
- **Hva:** Text embeddings for semantisk søk
- **Brukes til:** Memory engine, knowledge base vektorsøk
- **Trenger:** Minimal nøkkel (text-embedding-3-small)
- **Kost:** ~$0.02 per 1000 søk (veldig billig)

## ✅ SETUP (Begge nøkler)

**Legg til i `.env`:**
```bash
# Google AI (Chat) - DIN NØKKEL
GOOGLE_AI_API_KEY=AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE
GOOGLE_AI_MODEL=gemini-1.5-flash-latest
NORA_AI_PROVIDER=google

# OpenAI (Embeddings) - Skaff fra platform.openai.com
OPENAI_API_KEY=sk-proj-...
EMBEDDING_PROVIDER=openai
```

## 🆓 ALTERNATIV: Kun Google AI (Uten Embeddings)

Nora fungerer uten embeddings, men mister:
- Memory search (semantisk søk i historie)
- Knowledge base RAG (dokumentasjonsøk)

**Hvis du vil teste uten OpenAI:**
- Bruk demo-modus (begge nøkler mangler)
- Eller bruk Google AI + deaktiver memory/KB (midlertidig)

## 📝 MIN ANBEFALING

**Beste oppsett:**
1. Google AI: Chat (gratis, rask)
2. OpenAI: Kun embeddings (veldig billig)

**Total kost per måned:** ~$1-5 avhengig av bruk

**Skaff OpenAI nøkkel:**
- https://platform.openai.com/api-keys
- Velg "text-embedding-3-small"
- Legg til $5 credit (varer lenge)

---

**© 2025 Cato Hansen**

