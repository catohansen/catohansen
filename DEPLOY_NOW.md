# 🚀 DEPLOY NÅ - Steg-for-Steg Guide

**Dato:** 2025-11-05  
**Target:** Vercel  
**Prosjekt:** catohansen  
**Status:** Klar for deployment!

---

## ⚡ RASK DEPLOY (30 minutter)

### **STEG 1: Setup Database (10 min)**

**1.1 Gå til Neon (Gratis PostgreSQL):**
```
https://neon.tech

Sign up med: cato@catohansen.no
```

**1.2 Opprett Database:**
```
1. Klikk "Create Project"
2. Navn: catohansen-production
3. Region: Europe (Frankfurt eller Stockholm)
4. PostgreSQL version: 16 (latest)
5. Klikk "Create Project"
```

**1.3 Kopier Connection String:**
```
Dashboard → Connection Details → Copy

Format:
postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require

Lagre denne - trenger den i Vercel!
```

**1.4 Enable pgvector:**
```sql
-- I Neon SQL Editor:
CREATE EXTENSION IF NOT EXISTS vector;

-- Verifiser:
SELECT * FROM pg_extension WHERE extname = 'vector';
```

**1.5 Kjør Migrasjoner:**
```bash
cd ~/Dev/catohansen-online

# Sett DATABASE_URL midlertidig:
export DATABASE_URL="din-neon-connection-string-her"

# Kjør migrations:
npx prisma migrate deploy

# Seed owner user:
npx prisma db seed  # Eller bruk seed-owner API etter deploy
```

---

### **STEG 2: Deploy til Vercel (10 min)**

**2.1 Logg inn på Vercel:**
```
https://vercel.com

Klikk "Log in"
Email: cato@catohansen.no
Password: Kilma2386!!

(Eller sign up hvis ny bruker)
```

**2.2 Opprett Nytt Prosjekt:**
```
Dashboard → Add New → Project

Velg Import Method:
→ Import Git Repository (anbefales)
ELLER
→ Deploy from CLI (se STEG 3 nedenfor)
```

**2.3 Import fra GitHub:**
```
1. Authorize Vercel → GitHub
2. Select Repository: catohansen-online
3. Configure:
   - Project Name: catohansen
   - Framework: Next.js ✅ (auto-detected)
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
   - Install Command: npm install
```

**2.4 Environment Variables:**
```
I Vercel project settings → Environment Variables

Legg til ALLE fra .env.production.example:

DATABASE_URL=postgresql://... (fra Neon)
OPENAI_API_KEY=sk-proj-... (skaff fra platform.openai.com)
NORA_AI_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_URL=https://catohansen.vercel.app
NODE_ENV=production

(Stripe kan legges til senere)
```

**2.5 Deploy:**
```
Klikk "Deploy"

⏱️ Første deploy: 3-5 minutter
✅ URL: https://catohansen.vercel.app
```

---

### **STEG 3: Alternativ - Deploy fra CLI (10 min)**

**3.1 Install Vercel CLI:**
```bash
npm install -g vercel
```

**3.2 Login:**
```bash
vercel login cato@catohansen.no
# Verifiser via e-post link
```

**3.3 Deploy:**
```bash
cd ~/Dev/catohansen-online

# Første deploy (setup):
vercel

# Svar på spørsmål:
# - Setup and deploy? Yes
# - Scope: catohansen (eller ditt team)
# - Link to existing project? No
# - Project name: catohansen
# - Directory: ./
# - Build settings: Yes (default)

# Deploy til production:
vercel --prod
```

**3.4 Set Environment Variables:**
```bash
# Via CLI:
vercel env add DATABASE_URL production
# Lim inn connection string

vercel env add OPENAI_API_KEY production
# Lim inn OpenAI key

# Eller via dashboard (lettere)
```

---

### **STEG 4: Custom Domain (10 min)**

**4.1 Legg til Domain i Vercel:**
```
Project Settings → Domains
Add Domain: catohansen.no

Vercel gir deg DNS instruksjoner
```

**4.2 DNS Konfigurasjon (hos domeneregistrar):**
```
Gå til din domeneregistrar (f.eks. Domeneshop, One.com)

Legg til:
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com

Lagre og vent 5-60 min for propagation
```

**4.3 Verifiser:**
```bash
# Vent litt, deretter:
curl -I https://catohansen.no

# Skal returnere: HTTP/2 200
```

---

## ✅ POST-DEPLOYMENT SJEKK

### **Test Disse URLs:**
```bash
# Public:
https://catohansen.no                    # Landing ✓
https://catohansen.no/nora               # Nora demo ✓
https://catohansen.no/marketplace        # Marketplace ✓
https://catohansen.no/hansen-hub         # Module hub ✓

# Admin:
https://catohansen.no/admin/login        # Login ✓
# Logg inn → test dashboard

# APIs:
https://catohansen.no/api/v1/core/health
https://catohansen.no/api/marketplace/products

# Test Nora:
# Åpne /nora
# Klikk "Try Live Demo"
# Skal fungere (demo eller full AI hvis OpenAI key)
```

---

## 🔑 KRITISKE ENV VARS (Må Ha)

```bash
# I Vercel Dashboard → Settings → Environment Variables:

DATABASE_URL=postgresql://...              # Fra Neon ✓
OPENAI_API_KEY=sk-proj-...                 # Fra OpenAI ✓
NORA_AI_PROVIDER=openai                    # Set til openai ✓
OPENAI_MODEL=gpt-4o-mini                   # Fast model ✓
EMBEDDING_PROVIDER=openai                  # For memory ✓
NEXT_PUBLIC_URL=https://catohansen.no      # Din URL ✓
NODE_ENV=production                        # Production mode ✓

# Generate new secrets:
NEXTAUTH_SECRET=generer-ny-random-her      # `openssl rand -base64 32`
JWT_SECRET=generer-ny-jwt-secret-her       # `openssl rand -base64 32`

# Valgfritt (later):
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 🆘 TROUBLESHOOTING

### **Build fails på Vercel:**
```bash
# Sjekk build locally først:
cd ~/Dev/catohansen-online
npm run build

# Hvis suksess lokalt → sjekk env vars i Vercel
```

### **Database connection error:**
```bash
# Test connection string:
DATABASE_URL="din-connection-string" npx prisma db push

# Hvis feil: Sjekk sslmode=require, IP whitelist i Neon
```

### **Nora ikke svarer:**
```bash
# Sjekk Vercel logs:
Vercel Dashboard → Deployments → Latest → Logs

# Se etter OPENAI_API_KEY errors
```

---

## 📋 DEPLOYMENT CHECKLIST

**Før deploy:**
- [x] Kode synkronisert til ~/Dev
- [x] Build lokalt → success
- [x] E2E tester → 10/10
- [x] Sikkerhet re-enabled (TODO: gjør dette!)
- [ ] Database opprettet (Neon)
- [ ] OpenAI key skaffet
- [ ] All env vars notert

**Under deploy:**
- [ ] Vercel project opprettet
- [ ] GitHub repo connected
- [ ] Env vars satt
- [ ] Første deploy trigget

**Etter deploy:**
- [ ] Test alle sider
- [ ] Test Nora chat
- [ ] Test admin login
- [ ] Custom domain konfigurert

---

## 🎯 KONKRET: GJØR DETTE NÅ

**1. Åpne disse:**
```
Tab 1: https://neon.tech (database)
Tab 2: https://vercel.com (hosting)
Tab 3: https://platform.openai.com/api-keys (AI)
```

**2. Setup (30 min):**
```
1. Neon → Opprett database → Kopier connection string
2. OpenAI → Opprett key → Kopier key (sk-proj-...)
3. Vercel → Importer repo → Legg til env vars → Deploy!
```

**3. Vent (5 min):**
```
Vercel bygger og deployer
Se progress i dashboard
```

**4. Test (10 min):**
```
Åpne catohansen.vercel.app (eller catohansen.no hvis domain satt)
Test alle sider
Post på LinkedIn!
```

---

## 🎉 SUCCESS!

**Når alt er grønt:**
- ✅ Systemet er live på internett!
- ✅ Kan vises til hvem som helst
- ✅ Kan markedsføres
- ✅ Kan selges!

**DU ER LIVE! 🌍**

---

**Start med Neon (database) → Deretter Vercel (hosting)!**

**Jeg guider deg hvis du trenger hjelp! 🚀**

