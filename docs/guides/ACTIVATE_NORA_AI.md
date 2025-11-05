<!--
Copyright (c) 2025 Cato Hansen. All rights reserved.

Proprietary - Unauthorized copying, modification, distribution, or use
of this software, via any medium is strictly prohibited without express
written permission from Cato Hansen.

License: PROPRIETARY
Author: Cato Hansen
Contact: cato@catohansen.no
Website: www.catohansen.no
-->

# 🤖 Aktivere Nora AI - Komplett Guide

**Dato:** 2025-11-05  
**Status:** Klar for aktivering

---

## 🎯 OVERSIKT

Nora kjører nå i **demo-modus** (fallback-svar uten eksterne AI-nøkler).

For å aktivere **full AI-funksjonalitet**, legg til API-nøkler i `.env`.

---

## 🚀 ALTERNATIV 1: Google AI (Anbefales)

**Fordeler:**
- ✅ Gratis tier: 1500 requests/dag
- ✅ Raskere responstid enn GPT-4
- ✅ Utmerket norsk språkstøtte
- ✅ Flash-modell optimalisert for chat

**Legg til i `.env`:**
```bash
# Google AI (Gemini)
GOOGLE_AI_API_KEY=din-google-ai-key-her
GOOGLE_AI_MODEL=gemini-1.5-flash-latest
NORA_AI_PROVIDER=google
```

**Skaff API-nøkkel:**
1. Gå til: https://ai.google.dev/
2. Klikk "Get API Key"
3. Opprett prosjekt
4. Generer nøkkel
5. Lim inn i `.env`

**Test:**
```bash
cd ~/Dev/catohansen-online
npm run dev:prod

# Test i browser:
open http://localhost:3000/nora
# Klikk "Try Live Demo" og still spørsmål på norsk
```

---

## 🔑 ALTERNATIV 2: OpenAI

**Fordeler:**
- ✅ GPT-4o-mini: Rask og billig
- ✅ GPT-4o: Mest avansert modell
- ✅ Whisper API for voice (inkludert)

**Legg til i `.env`:**
```bash
# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini  # eller gpt-4o
NORA_AI_PROVIDER=openai
```

**Skaff API-nøkkel:**
1. Gå til: https://platform.openai.com/api-keys
2. Opprett ny nøkkel
3. Lim inn i `.env`

**Pris (ca):**
- GPT-4o-mini: $0.15 per 1M tokens (~500 samtaler)
- GPT-4o: $2.50 per 1M tokens (~80 samtaler)

---

## 🎙️ VOICE FEATURES (Valgfritt)

For å aktivere **stemmeinn og -ut** i Nora:

**Legg til i `.env`:**
```bash
# For Speech-to-Text (Whisper):
OPENAI_API_KEY=sk-...  # Samme som over

# For Text-to-Speech (ElevenLabs - valgfritt):
ELEVENLABS_API_KEY=din-elevenlabs-key
```

**Skaff ElevenLabs nøkkel:**
1. Gå til: https://elevenlabs.io/
2. Sign up (gratis tier: 10,000 tegn/måned)
3. Gå til Profile > API Keys
4. Opprett nøkkel
5. Lim inn i `.env`

---

## 🧪 VERIFISERING

### **Test 1: Chat API**
```bash
curl -X POST http://localhost:3000/api/nora/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hei Nora, hva kan du hjelpe meg med?","stream":false}'
```

**Forventet output (demo-modus):**
```json
{
  "success": true,
  "response": "Hei! (Demo-modus) Jeg er Nora...",
  "metadata": {"demo": true}
}
```

**Forventet output (med AI-nøkkel):**
```json
{
  "success": true,
  "response": "Hei! Jeg er Nora, AI-kjerneintelligensen...",
  "metadata": {"provider": "google", "model": "gemini-1.5-flash"}
}
```

### **Test 2: Frontend Chat**
```bash
open http://localhost:3000/nora
# Klikk "Try Live Demo"
# Skriv: "Forklar Hansen Security"
# Verifiser at du får intelligent svar (ikke demo-melding)
```

### **Test 3: Admin "Ask Nora"**
```bash
open http://localhost:3000/admin
# Logg inn: cato@catohansen.no / Kilma2386!!
# Klikk "Ask Nora" knapp (når implementert i Fase 2)
# Verifiser context-aware svar
```

---

## 📊 NÅVÆRENDE STATUS

**Uten AI-nøkler (demo-modus):**
- ✅ Chat fungerer
- ✅ "Try Live Demo" fungerer
- ✅ Demo-svar returneres
- ⚠️ Ingen ekte AI-intelligens
- ⚠️ Ingen knowledge-base integration

**Med AI-nøkler (full modus):**
- ✅ Alt over +
- ✅ Ekte AI-svar på norsk
- ✅ Knowledge-base integration
- ✅ Emotion engine aktiv
- ✅ Agent routing (coach/dev/marketer personas)
- ✅ Memory engine lagrer samtaler

---

## 🔐 SIKKERHET

**API-nøkler i .env:**
- ✅ Fil er ignored i .gitignore
- ✅ Aldri commit til Git
- ✅ Bruk environment variables i prod (Vercel/Railway)

**Best practices:**
```bash
# Development:
cp .env.example .env
# Fyll inn dine nøkler

# Production (Vercel):
# Legg til under Settings > Environment Variables
```

---

## 🆘 TROUBLESHOOTING

### **Problem: "Demo-modus" vises fortsatt**

**Løsning:**
1. Sjekk at .env inneholder nøkkel
2. Restart server: `npm run dev:prod`
3. Test API direkte (curl kommando over)
4. Sjekk server logs: `tail -f /tmp/prod-server.log`

### **Problem: "API error: 429 Too Many Requests"**

**Løsning:**
- Google AI gratis tier: 1500 req/dag
- OpenAI: Sjekk usage på platform.openai.com
- Legg til rate limiting hvis nødvendig

### **Problem: "Invalid API key"**

**Løsning:**
- Verifiser nøkkel er korrekt kopiert
- Sjekk ingen ekstra spaces/newlines
- Test nøkkel på provider's playground først

---

## 📈 NESTE STEG

**Etter aktivering:**

1. **Test grundig** (30 min)
   - Chat på /nora
   - Chat i admin
   - Test knowledge-base svar
   - Verifiser norsk språk

2. **Dokumenter** (15 min)
   - Screenshot av fungerende chat
   - Lagre eksempel-samtaler
   - Noter responstider

3. **Fortsett til Fase 2** (2-3 dager)
   - Integrer Knowledge Base i Nora-svar
   - Legg til "Ask Nora" i admin
   - Polish UI/UX
   - Lag demo-video

---

## 📞 SUPPORT

**Spørsmål om AI-aktivering?**
- E-post: cato@catohansen.no
- Docs: /docs/implementation/COMPLETE_SYSTEM_IMPLEMENTATION_PLAN.md

---

**© 2025 Cato Hansen. All rights reserved.**

**Laget med ❤️ i Drøbak, Norge 🇳🇴**

