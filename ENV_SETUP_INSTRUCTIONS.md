# 🔑 RASK SETUP - Google AI Nøkkel for Nora

**Dato:** 2025-11-05  
**Din nøkkel er klar!** ✅

---

## ⚡ RASKESTE METODE (2 minutter)

**1. Åpne .env fil:**
```bash
cd ~/Dev/catohansen-online
nano .env
```

**2. Legg til disse linjene:**
```bash
# Google AI for Nora (Lagt til 2025-11-05)
GOOGLE_AI_API_KEY=AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE
GOOGLE_AI_MODEL=gemini-1.5-flash-latest
NORA_AI_PROVIDER=google
```

**3. Lagre og lukk (Ctrl+O, Enter, Ctrl+X)**

**4. Restart server:**
```bash
lsof -ti:3000 | xargs kill -9
npm run start
```

**5. Test:**
```bash
open http://localhost:3000/nora
# Klikk "Try Live Demo"
# Skriv: "Hei Nora, forklar Hansen Security"
# Skal få intelligent svar (IKKE demo-melding)
```

---

## 🎛️ ELLER: Bruk Admin Panel (anbefales)

**1. Åpne admin:**
```bash
open http://localhost:3000/admin/nora
```

**2. Scroll ned til "API Configuration"**

**3. Fyll inn:**
- **Provider:** Google AI (velg fra dropdown)
- **Google AI Key:** `AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE`
- **Model:** `gemini-1.5-flash-latest`

**4. Klikk "Save Configuration"**

**5. Test umiddelbart (ingen restart nødvendig)**

---

## ✅ VERIFISER AT DET FUNGERER

**Test-kommando:**
```bash
curl -X POST http://localhost:3000/api/nora/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hei Nora","stream":false}' | jq .
```

**Forventet output:**
```json
{
  "success": true,
  "response": "Hei! Jeg er Nora, AI-kjerneintelligensen for Hansen Global...",
  "metadata": {
    "provider": "google",
    "model": "gemini-1.5-flash-latest",
    "demo": false  ← Dette skal IKKE være true!
  }
}
```

**Hvis `"demo": false` → Alt fungerer! ✅**

---

## 🎉 FERDIG!

Nora er nå live med ekte AI! 🚀

**Neste:**
- Test grundig i 30 min
- Dokumenter hva fungerer/mangler
- Velg Fase 3A (Marketplace) eller 3B (AI Agents)

**Spørsmål?**
- Se: `docs/guides/GOOGLE_AI_KEY_SETUP.md`
- E-post: cato@catohansen.no

---

**© 2025 Cato Hansen**

