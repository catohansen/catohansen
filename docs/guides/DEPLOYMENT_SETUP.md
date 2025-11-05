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

# 🚀 Deployment System Setup Guide

## Oversikt

Deployment systemet lar deg automatisk synkronisere nettsiden din fra lokal utvikling til production server på `www.domenehsop.no` via FTP. Systemet lagrer deployment historikk og gir deg oversikt over siste synkronisering.

## ✅ Funksjoner

- **FTP Deployment**: Automatisk upload av filer til production server
- **Database Synkronisering**: (Optional) Synkroniser database endringer
- **Deployment History**: Oversikt over alle deployments med status og detaljer
- **Kryptert Lagring**: Passord krypteres før lagring i database
- **Status Tracking**: Se når siste synkronisering var og om den var vellykket

## 📋 Oppsett

### 1. Database Migrasjon

Først må du kjøre database migrasjon for å legge til nye tabeller:

```bash
npx prisma migrate dev --name add_deployment_tables
```

Eller hvis du allerede har gjort endringer:

```bash
npx prisma db push
```

### 2. Environment Variables (Optional)

Du kan legge inn credentials i `.env` filen, eller bruke admin panel:

```bash
# Deployment Encryption Key (32 karakterer)
DEPLOYMENT_ENCRYPTION_KEY="din_32_karakterer_lange_key_her"

# FTP Configuration (optional - kan settes i admin panel)
FTP_SERVER="ftp.domeneshop.no"
FTP_USERNAME="ditt_brukernavn"
FTP_PASSWORD="ditt_passord"
FTP_SERVER_DIR="/www"
BUILD_OUTPUT_DIR="out"
SERVER_URL="https://www.domenehsop.no"
```

### 3. Konfigurer via Admin Panel

1. Gå til `/admin/deploy/settings`
2. Legg inn:
   - **FTP Server**: `ftp.domeneshop.no` (eller din FTP server)
   - **FTP Username**: Ditt FTP brukernavn
   - **FTP Password**: Ditt FTP passord (blir kryptert)
   - **Server Directory**: `/www` (eller din server mappe)
   - **Server URL**: `https://www.domenehsop.no` (din production URL)
3. (Optional) Legg inn database credentials hvis du vil synkronisere database
4. Klikk "Lagre Configuration"

## 🚀 Bruk

### Deployment

1. Gå til `/admin/deploy`
2. Se status på siste synkronisering
3. Klikk "Deploy til Production"
4. Vent mens systemet:
   - Bygger statiske filer (30-60 sekunder)
   - Laster opp via FTP (1-3 minutter)
5. Se resultat og link til live side

### Deployment History

1. Gå til `/admin/deploy/history`
2. Se alle tidligere deployments
3. Se status, tid, og eventuelle feilmeldinger

## 🔒 Sikkerhet

- **Kryptert Lagring**: Alle passord krypteres med AES-256-GCM før lagring
- **Autorisasjon**: Kun OWNER og ADMIN roller kan deploye
- **Audit Log**: Alle deployments logges med bruker info

## 📊 Status Oversikt

På `/admin/deploy` siden ser du:

- **Siste Synkronisering**: Når siste deployment var
- **Status**: Vellykket, feilet, eller ikke deployet
- **Konfigurasjon**: Oversikt over FTP og database settings
- **Deployment Status**: Real-time status under deployment

## 🔧 Feilsøking

### "FTP passord ikke konfigurert"
- Gå til Settings og legg inn FTP credentials
- Sjekk at passordet er korrekt

### "Kunne ikke koble til FTP server"
- Sjekk FTP server adresse
- Sjekk at serveren er oppe
- Sjekk firewall innstillinger

### "Build feilet"
- Sjekk at `next.config.js` har `output: 'export'` eller kan aktivere det
- Sjekk for build errors i console
- Sjekk at alle dependencies er installert

### "out/ mappen ble ikke opprettet"
- Sjekk at Next.js build fullfører
- Sjekk at `next.config.js` konfigurasjon er korrekt

## 📝 Neste Steg

1. **Database Synkronisering**: Hvis du vil synkronisere database endringer automatisk
2. **Automated Deployments**: Sett opp GitHub Actions for automatisk deployment
3. **Backup**: Lag backup av production server før første deployment
4. **Testing**: Test deployment med en staging server først





