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

# Lokal Testing Guide - Landing Side

## 🎯 Oversikt

Denne guiden hjelper deg med å teste landing-siden lokalt på din egen maskin.

---

## ✅ Forhåndsstatus

- ✅ Build og lint: Grønt
- ✅ TypeScript: Ingen feil
- ✅ Imports: Alle fikset
- ✅ Landing-siden: Gjenopprettet med alle komponenter

---

## 🚀 Steg-for-Steg Instruksjoner

### 1️⃣ Åpne Prosjektmappen i Terminal

```bash
cd /Users/catohansen/Dev/catohansen-projeckt/catohansen-online
```

### 2️⃣ Stopp Gamle Prosesser (for sikkerhet)

```bash
pkill -f "next dev"
pkill -f "node"
```

**Verifiser at alt er stoppet:**
```bash
ps aux | grep "next dev" | grep -v grep
# Skal ikke returnere noe
```

### 3️⃣ Rydd Opp Cache

```bash
rm -rf .next
rm -rf node_modules/.cache
```

### 4️⃣ Installer Pakker (hvis nødvendig)

```bash
npm install
```

### 5️⃣ Start Dev Server

**Alternativ 1: Port 3001**
```bash
PORT=3001 npm run dev
```

**Alternativ 2: Port 3333 (hvis 3001 er opptatt)**
```bash
PORT=3333 npm run dev
```

**Alternativ 3: Bruk npm script**
```bash
npm run dev:3001
# eller
npm run dev:3333
```

### 6️⃣ Vent På "Ready"

Vent til du ser i terminalen:
```
Ready - started server on http://localhost:3001
Compiled successfully
```

**⚠️ Viktig:** Ikke test før du ser "Ready" og "Compiled successfully"!

---

## 🧪 Test i Nettleser

### 1. Åpne i Chrome
```
http://localhost:3001
```
(eller http://localhost:3333 hvis du brukte den porten)

### 2. Åpne DevTools
- Trykk **F12** eller **Cmd+Option+I** (Mac)
- Gå til **Console** tab
- Gå til **Network** tab

### 3. Hva Å Se Etter

#### Hvis Siden Er Blank:
- ✅ **Console tab:** Se etter røde feilmeldinger
- ✅ **Network tab:** Se etter feilede requests (røde linjer)
- ✅ **Terminal:** Se etter feilmeldinger

#### Hvis Siden Laster Delvis:
- ✅ Hvilke komponenter vises?
- ✅ Hvilke komponenter mangler?
- ✅ Eventuelle feilmeldinger i Console?

---

## 🔍 Feilsøking

### Problem: "Error: listen EADDRINUSE"
**Løsning:** Porten er opptatt, bruk en annen:
```bash
PORT=3333 npm run dev
# eller
PORT=3002 npm run dev
```

### Problem: Server starter ikke
**Sjekk:**
1. Er det feil i terminalen?
2. Er Prisma Client generert? (`npx prisma generate`)
3. Er alle pakker installert? (`npm install`)

### Problem: Blank side i nettleser
**Sjekk:**
1. Er serveren faktisk "Ready"?
2. Er du på riktig port? (http://localhost:3001)
3. Hva sier Console i DevTools?
4. Hva sier Network tab?

---

## 📝 Når Du Har Testet

Send meg:
1. **Ser du siden?** (Ja/Nei/Delvis)
2. **Console-feil:** Alle røde feilmeldinger (kopier hele meldingen)
3. **Network-feil:** Feilede requests (statuskode, URL, feilmelding)
4. **Server-logger:** Eventuelle feil fra terminalen

Så fikser jeg eventuelle problemer basert på faktiske feilmeldinger!

---

## ✅ Checklist

- [ ] Stoppet alle gamle prosesser
- [ ] Ryddet cache (.next, node_modules/.cache)
- [ ] Startet dev server på ledig port
- [ ] Venter på "Ready" og "Compiled successfully"
- [ ] Åpnet http://localhost:3001 i Chrome
- [ ] Sjekket DevTools Console for feil
- [ ] Sjekket DevTools Network for feilede requests
- [ ] Dokumentert eventuelle feilmeldinger

---

**Status:** ✅ Klar for lokal testing  
**Neste:** Test og send resultater


