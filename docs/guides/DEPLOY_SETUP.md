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

# 🚀 Deploy System Setup Guide

## ✅ Automatisk Deployment til domene.shop

Dette systemet lar deg deploye nettsiden direkte fra admin panelet med ett klikk!

---

## 🔧 Setup

### 1. Environment Variables

Legg til i `.env` filen (root directory):

```bash
# FTP Configuration for domene.shop
FTP_SERVER=ftp.domeneshop.no
FTP_USERNAME=catohansen
FTP_PASSWORD=ditt-ftp-passord-her
FTP_SERVER_DIR=/www
BUILD_OUTPUT_DIR=out
```

### 2. Next.js Configuration

Sjekk at `next.config.js` har statisk export aktivert:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Viktig for statisk deployment
  // ... resten av konfigurasjonen
}
```

---

## 📤 Bruk Deploy Systemet

### Via Admin Panel

1. Gå til **Admin Panel** → **Deploy** → **Deploy to Production**
2. Klikk **"Deploy til domene.shop"** knappen
3. Vent mens systemet:
   - Bygger statiske filer (`npm run build`)
   - Laster opp via FTP til domene.shop
4. Se status og logs i real-time

### Deployment Prosess

1. **Build Phase**: 
   - Kjører `npm run build`
   - Genererer statiske filer i `out/` mappen
   - Tar vanligvis 30-60 sekunder

2. **Upload Phase**:
   - Kobler til FTP server (ftp.domeneshop.no)
   - Laster opp alle filer fra `out/` til `/www/` på serveren
   - Tar vanligvis 1-3 minutter avhengig av filstørrelse

3. **Complete**:
   - Nettsiden er nå oppdatert på catohansen.no
   - Du kan se live site link

---

## ⚠️ Viktig

### FTP Passord
- **IKKE** commit `.env` filen til Git!
- Legg `.env` i `.gitignore`
- FTP passordet er kun lagret lokalt

### Build Output
- Statiske filer genereres i `out/` mappen
- Dette er en midlertidig mappe som kan slettes etter deployment
- `out/` er allerede i `.gitignore`

### Alternativer

Hvis FTP deployment ikke fungerer direkte, kan du bruke:

1. **GitHub Actions** (Anbefalt):
   - Automatisk deployment ved push til main branch
   - Se `.github/workflows/deploy.yml`
   - Krever `FTP_PASSWORD` som GitHub Secret

2. **Manuell FTP Upload**:
   - Bruk FileZilla eller lignende FTP klient
   - Connect til `ftp.domeneshop.no`
   - Upload hele `out/` mappen til `/www/`

3. **SCP/SFTP**:
   ```bash
   scp -r out/* catohansen@scp.domeneshop.no:/www/
   ```

---

## 🔒 Sikkerhet

- ✅ FTP passord lagres i `.env` (ikke i kode)
- ✅ Admin authentication kreves for deployment
- ✅ Build prosess isolert (timeout protection)
- ⚠️ Ikke commit credentials til Git!

---

## 🐛 Troubleshooting

### "FTP_PASSWORD ikke satt"
- Sjekk at `.env` filen eksisterer
- Sjekk at `FTP_PASSWORD` er satt i `.env`
- Restart development server etter endringer i `.env`

### "Kunne ikke koble til FTP server"
- Sjekk at `FTP_SERVER` er riktig
- Sjekk at FTP credentials er korrekte
- Sjekk at domene.shop FTP er tilgjengelig
- Test manuell FTP connection først

### "Build feilet"
- Sjekk at alle dependencies er installert (`npm install`)
- Sjekk at `next.config.js` har `output: 'export'`
- Test build lokalt: `npm run build`

### "out/ mappen eksisterer ikke"
- Kjør `npm run build` først
- Sjekk at build prosess ble fullført
- Sjekk at `next.config.js` har `output: 'export'`

---

## 📊 Deployment History

Deployment history vil bli lagret i database (TODO: Implementer med Prisma):
- Deployment timestamp
- Status (success/failed)
- Build logs
- FTP logs
- Deployed by (user)

---

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no







