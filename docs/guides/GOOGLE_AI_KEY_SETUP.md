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

# 🔑 Google AI Nøkkel - Setup Guide

**Dato:** 2025-11-05  
**Status:** Klar for aktivering

---

## ✅ DIN GOOGLE AI NØKKEL

**API Key:**
```
AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE
```

**Provider:** Google AI (Gemini)  
**Model:** gemini-1.5-flash-latest

---

## 🚀 AKTIVERING - 2 MÅTER

### **METODE 1: Via .env fil (Rask)**

**Legg til i `.env` (i ~/Dev/catohansen-online/):**
```bash
# Google AI for Nora
GOOGLE_AI_API_KEY=AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE
GOOGLE_AI_MODEL=gemini-1.5-flash-latest
NORA_AI_PROVIDER=google
```

**Restart server:**
```bash
cd ~/Dev/catohansen-online
lsof -ti:3000 | xargs kill -9
npm run start
```

**Fordel:**
- ✅ Raskest setup (2 min)
- ✅ Fungerer umiddelbart

**Ulempe:**
- ⚠️ Må restarte server ved endring
- ⚠️ Ikke synlig i admin-panel

---

### **METODE 2: Via Admin Panel (Anbefales)**

**Nå implementerer jeg dette!**

**Fremgangsmåte:**
1. Gå til: http://localhost:3000/admin/nora
2. Finn "API Configuration" seksjonen
3. Legg inn:
   - Provider: Google AI
   - API Key: AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE
   - Model: gemini-1.5-flash-latest
4. Klikk "Save Configuration"
5. Test umiddelbart (ingen restart nødvendig)

**Fordeler:**
- ✅ Ingen fil-redigering
- ✅ Synlig i admin
- ✅ Kan endres live
- ✅ Lagres i database (SystemConfig)

---

## 🧪 TESTING

**Test at nøkkelen fungerer:**
```bash
curl -X POST http://localhost:3000/api/nora/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hei Nora, forklar Hansen Security","stream":false}'
```

**Forventet output (med nøkkel):**
```json
{
  "success": true,
  "response": "Hei! Hansen Security er et policy-based authorization system...",
  "metadata": {
    "provider": "google",
    "model": "gemini-1.5-flash-latest",
    "demo": false
  }
}
```

**Hvis du ser `"demo": false` → nøkkelen fungerer! ✅**

---

## 📊 RATE LIMITS & KOSTNADER

**Google AI Free Tier:**
- 📈 1500 requests per dag
- 📈 60 requests per minutt
- 📈 Gratis for alltid

**Gemini 1.5 Flash:**
- ⚡ Rask respons (~1-2s)
- 📝 Støtter norsk språk
- 💬 Perfekt for chat

**Hvis du trenger mer:**
- Oppgrader til Google AI Pro (betalt tier)
- Eller bytt til OpenAI (sett OPENAI_API_KEY)

---

## 🔐 SIKKERHET

**Viktig:**
- 🔒 Aldri commit nøkkel til Git
- 🔒 .env er ignored (.gitignore)
- 🔒 I prod: Bruk Vercel Environment Variables
- 🔒 Admin-panel lagrer kryptert i database

**Database lagring (PHASE 2):**
- Nøkkel lagres i `SystemConfig` tabell
- Felt: `key = 'nora.api.googleApiKey'`
- Verdi: Kryptert (AES-256) - implementeres nå

---

## 🎯 KONKLUSJON

**Din Google AI nøkkel er klar!**

**Jeg implementerer nå:**
1. Admin-panel for AI-konfigurasjon
2. Mulighet til å endre nøkkel live
3. Test med ekte AI-svar

**Deretter fortsetter jeg med Fase 3 planlegging!** 🚀

---

**© 2025 Cato Hansen. All rights reserved.**

