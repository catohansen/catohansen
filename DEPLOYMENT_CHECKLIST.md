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

# ✅ DEPLOYMENT CHECKLIST

**Dato:** 2025-01-16  
**Prosjekt:** catohansen  
**Status:** Klar for deployment

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### GitHub
- [x] Repository opprettet: `catohansen`
- [x] Kode pushet til master branch
- [x] Remote konfigurert korrekt

### Neon Database
- [x] Prosjekt opprettet: `catohansen-prod`
- [x] Connection string kopiert
- [x] pgvector extension enabled
- [x] Prisma schema pushet

### Secrets & Configuration
- [x] NEXTAUTH_SECRET generert
- [x] JWT_SECRET generert
- [x] Google AI API key konfigurert
- [x] Alle environment variables dokumentert

---

## 🚀 VERCEL DEPLOYMENT CHECKLIST

### Steg 1: Opprett Prosjekt
- [ ] Gått til vercel.com og logget inn
- [ ] Klikket "Add New Project"
- [ ] Valgt "Import Git Repository"
- [ ] Valgt `catohansen` repo
- [ ] Klikket "Import"

### Steg 2: Environment Variables
Gå til **Settings → Environment Variables** og legg til:

- [ ] **DATABASE_URL** (fra Neon)
- [ ] **NEXTAUTH_SECRET** (`oGuoxeUHAeQ4EIqBuULfG+mdTNMEXxkHSjfeEnRkOIc=`)
- [ ] **JWT_SECRET** (`gsuRjolzUWmhZh5ODY36nJv+wUcBquH8i1AAVp/ta4A=`)
- [ ] **NEXT_PUBLIC_URL** (`https://catohansen.vercel.app`)
- [ ] **NODE_ENV** (`production`)
- [ ] **GOOGLE_AI_API_KEY** (`AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE`)
- [ ] **GOOGLE_AI_MODEL** (`gemini-1.5-flash-latest`)
- [ ] **NORA_AI_PROVIDER** (`google`)

**Viktig:** Huk av ☑ Production, ☑ Preview, ☑ Development for alle!

### Steg 3: Deploy
- [ ] Gått til "Deployments" tab
- [ ] Klikket "Deploy"
- [ ] Ventet 3-5 minutter
- [ ] Build fullført uten feil

### Steg 4: Testing
- [ ] Landing page laster: `https://catohansen.vercel.app`
- [ ] Admin login fungerer: `https://catohansen.vercel.app/admin/login`
- [ ] Nora AI svarer: `https://catohansen.vercel.app/nora`
- [ ] Database connection fungerer (ingen errors)

---

## 🆘 TROUBLESHOOTING

### Build feiler?
- [ ] Sjekket at alle 8 environment variables er satt
- [ ] Sjekket at alle har ☑ Production, Preview, Development
- [ ] Lest build logs i Vercel

### Database error?
- [ ] Sjekket DATABASE_URL er korrekt kopiert
- [ ] Sjekket at Neon prosjekt er aktivt
- [ ] Testet connection string lokalt

### Login feiler?
- [ ] Sjekket NEXTAUTH_SECRET er satt
- [ ] Sjekket JWT_SECRET er satt
- [ ] Sjekket at begge er i alle environments

### Nora ikke svarer?
- [ ] Sjekket GOOGLE_AI_API_KEY er satt
- [ ] Sjekket NORA_AI_PROVIDER er "google"
- [ ] Sjekket GOOGLE_AI_MODEL er satt

---

## 📚 Hjelpefiler

- **DEPLOY_NOW.md** - Enkleste guide (start her!)
- **VERCEL_QUICK_SETUP.md** - Copy-paste guide
- **VERCEL_ENV_VARS_COMPLETE.txt** - Alle verdier
- **docs/guides/VERCEL_DEPLOYMENT_COMPLETE.md** - Detaljert guide

---

## ✅ POST-DEPLOYMENT

Når alt fungerer:

- [ ] Testet alle hovedfunksjoner
- [ ] Verifisert at database connection fungerer
- [ ] Testet Nora AI
- [ ] Sjekket at admin panel fungerer
- [ ] Dokumentert produksjon-URL

---

**🎉 Når alle er huket av, er hjemmesiden live!**

