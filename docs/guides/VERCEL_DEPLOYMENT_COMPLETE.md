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

# 🚀 Vercel Deployment - Komplett Guide

**Dato:** 2025-01-16  
**Status:** Klar for deployment  
**Tid:** ~20 minutter

---

## 📋 FORBEREIDELSE

### ✅ Alt som er gjort:

- [x] GitHub repo opprettet: `catohansen`
- [x] Neon database opprettet og konfigurert
- [x] pgvector extension enabled
- [x] Prisma schema pushet
- [x] Secrets generert (kjør `npm run generate:secrets`)

---

## 🟣 STEG 1: Opprett Vercel Prosjekt (5 min)

### 1.1 Logg inn på Vercel

1. Gå til [vercel.com](https://vercel.com)
2. Klikk **"Sign Up"** (eller **"Log In"** hvis du har konto)
3. Velg **"Continue with GitHub"** (anbefales)
4. Autoriser Vercel til å koble til GitHub

### 1.2 Import Git Repository

1. Klikk **"Add New Project"** (eller **"New Project"**)
2. Klikk **"Import Git Repository"**
3. Finn og velg **`catohansen`** repo
4. Klikk **"Import"**

### 1.3 Konfigurer Prosjekt

1. **Project Name:** `catohansen` (eller `catohansen-online`)
2. **Framework Preset:** Next.js (auto-detected) ✅
3. **Root Directory:** `./` (default) ✅
4. **Build Command:** `npm run build` (default) ✅
5. **Output Directory:** `.next` (default) ✅
6. **Install Command:** `npm install` (default) ✅

**⚠️  IKKE klikk "Deploy" ennå!** Vi må sette environment variables først.

---

## 🔑 STEG 2: Sett Environment Variables (10 min)

### 2.1 Åpne Environment Variables

1. I Vercel prosjektet, klikk **"Settings"** (øverst)
2. Klikk **"Environment Variables"** (i venstre meny)

### 2.2 Legg til Variabler

Klikk **"Add"** for hver variabel og fyll inn:

#### **Database (Allerede klar):**

```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_SZuU5x8wqAcl@ep-snowy-base-ag874ph7-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
Environment: ☑ Production ☑ Preview ☑ Development
```

#### **Security Secrets (Generer først):**

Kjør lokalt:
```bash
npm run generate:secrets
```

Kopier de to secret-verdiene og legg til:

```
Name: NEXTAUTH_SECRET
Value: <verdien-fra-generate-secrets>
Environment: ☑ Production ☑ Preview ☑ Development
```

```
Name: JWT_SECRET
Value: <verdien-fra-generate-secrets>
Environment: ☑ Production ☑ Preview ☑ Development
```

#### **App Configuration:**

```
Name: NEXT_PUBLIC_URL
Value: https://catohansen.vercel.app
Environment: ☑ Production ☑ Preview ☑ Development
```

```
Name: NODE_ENV
Value: production
Environment: ☑ Production ☑ Preview ☑ Development
```

#### **AI Provider (Google AI - Gratis!):**

**✅ Allerede konfigurert - ingen ekstra setup nødvendig!**

```
Name: GOOGLE_AI_API_KEY
Value: AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE
Environment: ☑ Production ☑ Preview ☑ Development
```

```
Name: GOOGLE_AI_MODEL
Value: gemini-1.5-flash-latest
Environment: ☑ Production ☑ Preview ☑ Development
```

```
Name: NORA_AI_PROVIDER
Value: google
Environment: ☑ Production ☑ Preview ☑ Development
```

**💡 Valgfritt - OpenAI (kun hvis du vil ha embeddings/voice):**
- Kun nødvendig for memory search eller voice features
- Se `VERCEL_ENV_VARS_COMPLETE.txt` for OpenAI setup (valgfritt)

### 2.3 Verifiser

Sjekk at alle variabler er lagt til:
- [ ] DATABASE_URL
- [ ] NEXTAUTH_SECRET
- [ ] JWT_SECRET
- [ ] NEXT_PUBLIC_URL
- [ ] NODE_ENV
- [ ] GOOGLE_AI_API_KEY
- [ ] GOOGLE_AI_MODEL
- [ ] NORA_AI_PROVIDER

---

## 🚀 STEG 3: Deploy (5 min)

### 3.1 Første Deploy

1. Gå tilbake til **"Deployments"** tab
2. Klikk **"Deploy"** (eller hvis du allerede har en deployment, klikk **"..."** → **"Redeploy"**)
3. Vent 3-5 minutter mens Vercel bygger og deployer

### 3.2 Sjekk Build Logs

1. Klikk på deployment
2. Se **"Build Logs"** for eventuelle feil
3. Hvis build feiler, sjekk:
   - Environment variables er satt
   - DATABASE_URL er korrekt
   - GOOGLE_AI_API_KEY er satt

### 3.3 Verifiser Deployment

Når deployment er ferdig:
- URL: `https://catohansen.vercel.app`
- Status: ✅ Ready

---

## ✅ STEG 4: Testing (5 min)

### 4.1 Test Public Pages

```
https://catohansen.vercel.app           # Landing page
https://catohansen.vercel.app/nora      # Nora demo
https://catohansen.vercel.app/admin/login  # Admin login
```

### 4.2 Test Admin Login

1. Gå til `https://catohansen.vercel.app/admin/login`
2. Logg inn med dine credentials
3. Verifiser at dashboard laster

### 4.3 Test Database Connection

1. Gå til admin dashboard
2. Sjekk at data laster (ingen database errors)
3. Test at du kan opprette/redigere data

### 4.4 Test Nora AI

1. Gå til `/nora` eller admin → Nora
2. Klikk **"Try Live Demo"**
3. Skriv en melding
4. Verifiser at du får svar (ikke demo-melding hvis OpenAI key er satt)

---

## 🆘 TROUBLESHOOTING

### **Build feiler:**

```
Problem: Environment variables mangler
Fix: Sjekk at alle variabler er satt i Vercel Dashboard
```

### **"Database connection failed":**

```
Problem: DATABASE_URL feil eller database ikke tilgjengelig
Fix: 
1. Sjekk connection string i Vercel
2. Sjekk at Neon prosjekt er aktivt
3. Test connection string lokalt
```

### **"Sikkerhetsfeil" ved login:**

```
Problem: NEXTAUTH_SECRET mangler eller er feil
Fix: Generer ny secret og sett i Vercel
```

### **Nora ikke svarer:**

```
Problem: GOOGLE_AI_API_KEY mangler eller er feil
Fix: 
1. Sjekk at GOOGLE_AI_API_KEY er satt i Vercel
2. Sjekk at NORA_AI_PROVIDER er satt til "google"
3. Test lokalt med samme key
```

### **"Module not found" eller build errors:**

```
Problem: Dependencies mangler eller feil
Fix:
1. Sjekk package.json
2. Sjekk build logs i Vercel
3. Prøv å redeploy
```

---

## 📊 POST-DEPLOYMENT

### **Vercel Analytics:**

1. Gå til **"Analytics"** i Vercel dashboard
2. Enable analytics (gratis tier: 100k events/mnd)
3. Se: Page views, Unique visitors, Performance

### **Custom Domain (Valgfritt):**

1. Gå til **"Settings"** → **"Domains"**
2. Klikk **"Add Domain"**
3. Skriv inn: `catohansen.no`
4. Følg DNS-instruksjoner
5. Oppdater `NEXT_PUBLIC_URL` til `https://catohansen.no`

---

## ✅ CHECKLIST

**Før deploy:**
- [ ] GitHub repo pushet
- [ ] Neon database opprettet
- [ ] pgvector enabled
- [ ] Secrets generert (`npm run generate:secrets`)
- [ ] OpenAI API key med credit

**Under deploy:**
- [ ] Vercel prosjekt opprettet
- [ ] Environment variables satt (alle 9)
- [ ] Build fullført uten feil
- [ ] URL fungerer

**Etter deploy:**
- [ ] Landing page laster
- [ ] Admin login fungerer
- [ ] Database connection fungerer
- [ ] Nora AI fungerer

---

## 🎉 FERDIG!

Når alt er testet og fungerer, er prosjektet ditt live på:
- **Vercel:** `https://catohansen.vercel.app`
- **Custom Domain (hvis satt opp):** `https://catohansen.no`

**Neste steg:**
- Test alle funksjoner grundig
- Sett opp monitoring og alerts
- Oppdater dokumentasjon med produksjon-URLs
- Planlegg videre utvikling

---

**Spørsmål eller problemer?** Sjekk Vercel logs eller kontakt support.

