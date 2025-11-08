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

# Port Konfigurasjon

## 🚀 Tilgjengelige Porter

### Standard Porter

- **Port 3000** (Standard Next.js) - `npm run dev:3000`
- **Port 3001** - `npm run dev:3001`
- **Port 3002** - `npm run dev:3002`
- **Port 4000** - `npm run dev:4000`
- **Port 5000** - `npm run dev:5000`

### Bruk av Miljøvariabel

Du kan også sette port via miljøvariabel:

```bash
PORT=3001 npm run dev
```

Eller i `.env.local`:
```
PORT=3001
```

---

## 📋 Sjekk Hvilke Porter Som Er I Bruk

```bash
# Sjekk alle lytte porter
lsof -i -P | grep LISTEN | grep -E "node|next"

# Sjekk spesifikk port
lsof -i :3000
lsof -i :3001
```

---

## 🔧 Start på Forskjellige Porter

### Metode 1: NPM Scripts

```bash
# Port 3000 (standard)
npm run dev:3000

# Port 3001
npm run dev:3001

# Port 4000
npm run dev:4000
```

### Metode 2: Miljøvariabel

```bash
PORT=3001 npm run dev
```

### Metode 3: Script

```bash
./scripts/start-dev.sh 3001
```

---

## 🌐 Åpne i Nettleser

Etter å ha startet serveren, åpne:

- **Port 3000**: http://localhost:3000
- **Port 3001**: http://localhost:3001
- **Port 3002**: http://localhost:3002
- **Port 4000**: http://localhost:4000
- **Port 5000**: http://localhost:5000

---

## ⚠️ Viktig

- Sørg for at porten ikke allerede er i bruk
- Hvis porten er opptatt, velg en annen port
- I produksjon brukes porten definert av hosting-plattformen (Vercel, Railway, etc.)

---

**Oppdatert:** 2025-01-XX


