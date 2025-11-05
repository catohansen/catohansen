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
# GitHub Setup Guide

## 🔐 Steg-for-steg oppsett for automatisk deployment

### 1. Opprett GitHub Repository

1. Gå til [github.com](https://github.com) og logg inn med:
   - E-post: `cato@catohansen.no`
   - Passord: [ditt GitHub passord]

2. Klikk **"New repository"** (grønn knapp)

3. Fyll inn:
   - **Repository name**: `catohansen-website` (eller valgfritt navn)
   - **Description**: "Premium website for Cato Hansen - AI Expert & System Architect"
   - **Visibility**: Public eller Private (din valg)
   - **Ikke** kryss av for README, .gitignore eller license (vi har allerede dette)

4. Klikk **"Create repository"**

### 2. Koble lokal repo til GitHub

Åpne terminal og kjør:

```bash
cd "/Users/catohansen/Dropbox/CURSOR projects Cato Hansen/catohansen-web/catohansen-online"

# Legg til GitHub remote (erstatt USERNAME med din GitHub brukernavn)
git remote add origin https://github.com/USERNAME/catohansen-website.git

# Eller hvis du foretrekker SSH:
git remote add origin git@github.com:USERNAME/catohansen-website.git

# Sjekk at remote er lagt til
git remote -v

# Push til GitHub (du blir bedt om å logge inn)
git branch -M main
git push -u origin main
```

### 3. Legg til FTP Password som GitHub Secret

Dette er viktig for at GitHub Actions skal kunne laste opp til Domeneshop!

1. Gå til ditt GitHub repository (nettopp opprettet)

2. Klikk **"Settings"** (øverst i menyen)

3. I venstre meny, klikk **"Secrets and variables"** → **"Actions"**

4. Klikk **"New repository secret"**

5. Fyll inn:
   - **Name**: `FTP_PASSWORD`
   - **Secret**: [ditt FTP passord fra Domeneshop - passordet du bruker for å logge inn på ftp.domeneshop.no]

6. Klikk **"Add secret"**

✅ Nå er FTP passordet sikkert lagret og kan brukes av GitHub Actions!

### 4. Test deployment

Når du har pushet kode til `main` branch, vil GitHub Actions automatisk:

1. ✅ Bygge prosjektet
2. ✅ Eksportere til statiske filer i `out/` mappen
3. ✅ Laste opp via FTP til Domeneshop (`/www/`)

**Sjekk status:**
- Gå til GitHub repository
- Klikk **"Actions"** fanen (øverst)
- Du vil se "Deploy to Domeneshop" workflow
- Klikk på den for å se detaljer

### 5. Manuell deployment (valgfritt)

Hvis du vil kjøre deployment manuelt uten å pushe:

1. Gå til GitHub repository
2. Klikk **"Actions"** fanen
3. Velg **"Deploy to Domeneshop"** workflow
4. Klikk **"Run workflow"** (til høyre)
5. Velg branch (main) og klikk **"Run workflow"**

## 🔒 Sikkerhet

- ✅ Passordet lagres **sikkert** i GitHub Secrets
- ✅ Ingen kan se passordet i kode eller logs
- ✅ Kun repository administrators har tilgang
- ⚠️ **Ikke** legg passordet i kode eller commit det til Git!

## 📋 Sjekkliste

- [ ] Opprettet GitHub repository
- [ ] Lagt til remote i lokal repo
- [ ] Pushet kode til GitHub
- [ ] Lagt til `FTP_PASSWORD` som GitHub Secret
- [ ] Testet at build fungerer lokalt (`npm run build`)
- [ ] Pushet endringer og verifisert at workflow kjører

## 🚀 Ved neste push

Når du pusher til `main` branch:
- GitHub Actions starter automatisk
- Bygger statiske filer
- Laster opp til Domeneshop
- Nettsiden oppdateres! 🎉

## 📞 Hjelp

Hvis noe ikke fungerer:
1. Sjekk GitHub Actions logs (Actions → Deploy to Domeneshop → Click on run)
2. Verifiser at `FTP_PASSWORD` secret er lagt til
3. Sjekk at `next.config.js` har `output: 'export'`
4. Test build lokalt: `npm run build` og sjekk at `out/` mappen opprettes

