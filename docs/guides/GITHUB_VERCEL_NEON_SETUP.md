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

# 🚀 Komplett Setup Guide: GitHub → Vercel → Neon

**Dato:** 2025-01-16  
**Prosjekt:** catohansen-online  
**Mål:** Deploye til produksjon med GitHub, Vercel og Neon database

---

## 📋 OVERBLIKK

1. ✅ **GitHub**: Opprett repo og push kode
2. ✅ **Neon**: Opprett database og få connection string
3. ✅ **Vercel**: Deploy fra GitHub og konfigurer
4. ✅ **Environment Variables**: Sett opp alle secrets

---

## 🔵 STEG 1: GitHub Repository (10 min)

### 1.1 Opprett nytt repo på GitHub

1. Gå til [github.com](https://github.com) og logg inn
2. Klikk **"New repository"** (eller `+` → New repository)
3. Fyll inn:
   - **Repository name:** `catohansen`
   - **Description:** `Cato Hansen - Premium Portfolio Website with Enterprise Admin Panel`
   - **Visibility:** Private (anbefales) eller Public
   - **Ikke** huk av "Initialize with README" (vi har allerede kode)
4. Klikk **"Create repository"**

### 1.2 Push kode til GitHub

```bash
cd /Users/catohansen/Dev/catohansen-projeckt/catohansen-online

# Sjekk at du er på master branch
git branch

# Hvis ikke, bytt til master:
# git checkout master

# Legg til remote (erstatt <ditt-github-brukernavn>):
git remote add origin https://github.com/<ditt-github-brukernavn>/catohansen.git

# Eller hvis du allerede har en remote:
git remote set-url origin https://github.com/<ditt-github-brukernavn>/catohansen.git

# Push kode:
git push -u origin master
```

**Hvis du får feil om at remote allerede eksisterer:**
```bash
# Sjekk nåværende remote:
git remote -v

# Fjern gammel remote:
git remote remove origin

# Legg til ny:
git remote add origin https://github.com/<ditt-github-brukernavn>/catohansen.git

# Push:
git push -u origin master
```

---

## 🟢 STEG 2: Neon Database (15 min)

### 2.1 Opprett Neon konto og prosjekt

1. Gå til [neon.tech](https://neon.tech)
2. Klikk **"Sign Up"** (eller logg inn hvis du har konto)
3. Velg **"Create a project"**
4. Fyll inn:
   - **Project name:** `catohansen-prod`
   - **Region:** `EU (Frankfurt)` eller `EU (Ireland)` (nærmest Norge)
   - **PostgreSQL version:** `16` (anbefales)
   - **Database name:** `neondb` (default)
5. Klikk **"Create project"**

### 2.2 Få Connection String

1. Etter at prosjektet er opprettet, gå til **"Connection Details"**
2. Velg **"Connection string"** → **"URI"**
3. Kopier connection string (ser ut som):
   ```
   postgresql://user:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **VIKTIG:** Lagre denne i en sikker fil (vi trenger den senere)

### 2.3 Enable pgvector extension

1. Gå til **"SQL Editor"** i Neon dashboard
2. Kjør denne SQL:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Verifiser at det fungerte (skal se "Success")

### 2.4 Push database schema

```bash
cd /Users/catohansen/Dev/catohansen-projeckt/catohansen-online

# Sett DATABASE_URL til din Neon connection string:
export DATABASE_URL="postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Push schema:
npx prisma db push

# Generer Prisma Client:
npx prisma generate
```

**Hvis du får feil:**
- Sjekk at connection string er korrekt
- Sjekk at `sslmode=require` er inkludert
- Sjekk at IP whitelist i Neon tillater alle (eller din IP)

---

## 🟣 STEG 3: Vercel Deployment (20 min)

### 3.1 Opprett Vercel konto og prosjekt

1. Gå til [vercel.com](https://vercel.com)
2. Klikk **"Sign Up"** (eller logg inn)
3. Velg **"Continue with GitHub"** (anbefales for enkel integrasjon)
4. Autoriser Vercel til å koble til GitHub
5. Klikk **"Add New Project"**
6. Velg **"Import Git Repository"**
7. Finn og velg **`catohansen`** repo
8. Klikk **"Import"**

### 3.2 Konfigurer prosjekt

1. **Project Name:** `catohansen` (eller `catohansen-online`)
2. **Framework Preset:** Next.js (auto-detected)
3. **Root Directory:** `./` (default)
4. **Build Command:** `npm run build` (default)
5. **Output Directory:** `.next` (default)
6. **Install Command:** `npm install` (default)
7. Klikk **"Deploy"** (ikke endre environment variables ennå)

### 3.3 Vent på første deploy

- Første deploy tar 3-5 minutter
- Den vil feile (fordi vi ikke har satt environment variables ennå)
- Det er OK - vi fikser det neste steg

---

## 🔑 STEG 4: Environment Variables (15 min)

### 4.1 Generer secrets

```bash
# Generer NEXTAUTH_SECRET:
openssl rand -base64 32

# Generer JWT_SECRET:
openssl rand -base64 32

# Kopier begge verdiene (vi trenger dem)
```

### 4.2 Sett environment variables i Vercel

1. Gå til Vercel Dashboard → **`catohansen`** prosjekt
2. Klikk **"Settings"** → **"Environment Variables"**
3. Legg til hver variabel (klikk **"Add"** for hver):

#### **Database:**
```
Name: DATABASE_URL
Value: postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview, Development (huk av alle)
```

#### **AI Provider (OpenAI):**
```
Name: OPENAI_API_KEY
Value: sk-proj-din-key-her (fra platform.openai.com)
Environment: Production, Preview, Development
```

```
Name: NORA_AI_PROVIDER
Value: openai
Environment: Production, Preview, Development
```

```
Name: OPENAI_MODEL
Value: gpt-4o-mini
Environment: Production, Preview, Development
```

```
Name: EMBEDDING_PROVIDER
Value: openai
Environment: Production, Preview, Development
```

#### **App Configuration:**
```
Name: NEXT_PUBLIC_URL
Value: https://catohansen.vercel.app (eller ditt custom domain)
Environment: Production, Preview, Development
```

```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development
```

#### **Security Secrets:**
```
Name: NEXTAUTH_SECRET
Value: <verdien-fra-openssl-rand-base64-32>
Environment: Production, Preview, Development
```

```
Name: JWT_SECRET
Value: <verdien-fra-openssl-rand-base64-32>
Environment: Production, Preview, Development
```

### 4.3 Redeploy

1. Gå til **"Deployments"** tab
2. Klikk på **"..."** ved siden av siste deployment
3. Klikk **"Redeploy"**
4. Vent 3-5 minutter
5. Klikk på deployment URL når den er ferdig

---

## ✅ STEG 5: Verifisering (10 min)

### 5.1 Test public pages

```
https://catohansen.vercel.app           # Landing page
https://catohansen.vercel.app/nora      # Nora demo
https://catohansen.vercel.app/admin/login  # Admin login
```

### 5.2 Test admin login

1. Gå til `https://catohansen.vercel.app/admin/login`
2. Logg inn med dine credentials
3. Verifiser at dashboard laster

### 5.3 Test database connection

1. Gå til admin dashboard
2. Sjekk at data laster (ingen database errors)
3. Test at du kan opprette/redigere data

### 5.4 Test Nora AI

1. Gå til `/nora` eller admin → Nora
2. Klikk **"Try Live Demo"**
3. Skriv en melding
4. Verifiser at du får svar (ikke demo-melding hvis OpenAI key er satt)

---

## 🎯 STEG 6: Custom Domain (Valgfritt, 15 min)

### 6.1 Legg til domain i Vercel

1. Gå til **"Settings"** → **"Domains"**
2. Klikk **"Add Domain"**
3. Skriv inn: `catohansen.no`
4. Klikk **"Add"**

### 6.2 Konfigurer DNS

Vercel gir deg DNS-instruksjoner. Typisk:

**Hos domeneregistrar (f.eks. Domeneshop, One.com):**

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 6.3 Vent på DNS propagation

- Tar 5-60 minutter
- Test med: `curl -I https://catohansen.no`
- Når det fungerer, oppdater `NEXT_PUBLIC_URL` i Vercel til `https://catohansen.no`

---

## 🆘 TROUBLESHOOTING

### **Build feiler på Vercel:**

```bash
# Test lokalt først:
npm run build

# Hvis det feiler lokalt, fiks feilene først
# Hvis det fungerer lokalt, sjekk:
# - Environment variables er satt i Vercel
# - DATABASE_URL er korrekt
# - Prisma schema er synkronisert
```

### **Database connection error:**

```bash
# Test connection string:
export DATABASE_URL="din-connection-string"
npx prisma db push

# Sjekk:
# - Connection string er korrekt
# - sslmode=require er inkludert
# - IP whitelist i Neon tillater alle
```

### **"Sikkerhetsfeil" ved login:**

```
Problem: NEXTAUTH_SECRET mangler eller er feil
Fix: Generer ny secret og sett i Vercel
```

### **Nora ikke svarer:**

```
Problem: OPENAI_API_KEY mangler eller er feil
Fix: Sjekk at key er satt i Vercel og har credit
Test: Demo-modus skal alltid fungere
```

---

## 📊 POST-DEPLOYMENT MONITORING

### **Vercel Analytics:**

1. Gå til **"Analytics"** i Vercel dashboard
2. Enable analytics (gratis tier: 100k events/mnd)
3. Se: Page views, Unique visitors, Performance metrics

### **Vercel Logs:**

1. Gå til **"Deployments"** → Velg deployment → **"Logs"**
2. Se for errors, warnings, performance issues

### **Neon Dashboard:**

1. Gå til Neon dashboard → **"Metrics"**
2. Se: Database size, connection count, query performance

---

## ✅ CHECKLIST

**GitHub:**
- [ ] Repo opprettet: `catohansen`
- [ ] Kode pushet til master branch
- [ ] Remote er konfigurert korrekt

**Neon:**
- [ ] Prosjekt opprettet: `catohansen-prod`
- [ ] Connection string kopiert
- [ ] pgvector extension enabled
- [ ] Schema pushet (`npx prisma db push`)

**Vercel:**
- [ ] Prosjekt opprettet og koblet til GitHub
- [ ] Første deploy fullført
- [ ] Environment variables satt:
  - [ ] DATABASE_URL
  - [ ] OPENAI_API_KEY
  - [ ] NORA_AI_PROVIDER
  - [ ] OPENAI_MODEL
  - [ ] EMBEDDING_PROVIDER
  - [ ] NEXT_PUBLIC_URL
  - [ ] NODE_ENV
  - [ ] NEXTAUTH_SECRET
  - [ ] JWT_SECRET
- [ ] Redeploy fullført
- [ ] Public pages fungerer
- [ ] Admin login fungerer
- [ ] Database connection fungerer
- [ ] Nora AI fungerer

**Custom Domain (valgfritt):**
- [ ] Domain lagt til i Vercel
- [ ] DNS konfigurert
- [ ] DNS propagation fullført
- [ ] NEXT_PUBLIC_URL oppdatert

---

## 🎉 FERDIG!

Når alt er sjekket av, er prosjektet ditt live på:
- **Vercel:** `https://catohansen.vercel.app`
- **Custom Domain (hvis satt opp):** `https://catohansen.no`

**Neste steg:**
- Test alle funksjoner grundig
- Sett opp monitoring og alerts
- Oppdater dokumentasjon med produksjon-URLs
- Planlegg videre utvikling

---

**Spørsmål eller problemer?** Sjekk Vercel logs eller kontakt support.

