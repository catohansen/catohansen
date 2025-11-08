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

# Restart Instruksjoner - Mac PC

**Dato:** 2025-01-XX  
**Problem:** Serveren laster, men finner ingenting

## 🔄 Før Du Restarter Mac-en

### 1. Stopp Alle Servere
```bash
# Stopp alle Next.js prosesser
pkill -f "next dev"
pkill -f "node.*next"
lsof -ti:3000 | xargs kill -9
```

### 2. Rydd Cache
```bash
cd /Users/catohansen/Dev/catohansen-projeckt/catohansen-online
rm -rf .next
rm -rf node_modules/.cache
```

### 3. Test Før Restart
Prøv å starte serveren på nytt:
```bash
npm run dev
```

Hvis dette fortsatt ikke fungerer, kan en restart hjelpe.

## 🔄 Etter Restart av Mac-en

### 1. Åpne Terminal
- Åpne Terminal appen
- Naviger til prosjektet:
```bash
cd /Users/catohansen/Dev/catohansen-projeckt/catohansen-online
```

### 2. Rydd Cache (Igjen)
```bash
rm -rf .next
rm -rf node_modules/.cache
```

### 3. Start Serveren
```bash
npm run dev
```

### 4. Vent på Serveren
- Vent 15-20 sekunder
- Se etter meldingen: "✓ Ready in X.Xs"
- Serveren skal være tilgjengelig på: `http://localhost:3000`

### 5. Test Siden
- Åpne Chrome
- Gå til: `http://localhost:3000`
- Du skal se en enkel versjon av landing-siden

## 🐛 Hvis Det Fortsatt Ikke Fungerer

### 1. Sjekk Node.js Versjon
```bash
node --version
npm --version
```

### 2. Sjekk Dependencies
```bash
npm install
```

### 3. Sjekk Prisma
```bash
npx prisma generate
```

### 4. Sjekk Port 3000
```bash
lsof -i:3000
```

Hvis porten er opptatt, stopp prosessen eller bruk en annen port:
```bash
PORT=3001 npm run dev
```

## 📝 Notater

- Serveren starter med en enkel versjon av landing-siden
- Original versjon er lagret i `page-simple.tsx.backup`
- NoraChatBubble er midlertidig deaktivert
- Test-siden er tilgjengelig på `/test`

---

**Status:** ✅ Instruksjoner klare  
**Neste steg:** Restart Mac-en og følg instruksjonene over




