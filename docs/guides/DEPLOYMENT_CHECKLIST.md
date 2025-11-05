<!--
Copyright (c) 2025 Cato Hansen. All rights reserved.
-->

# 🚀 DEPLOYMENT CHECKLIST - catohansen.no

**Target:** Vercel (anbefales) eller Railway  
**Domain:** catohansen.no  
**Dato:** Klar for deploy

---

## ✅ PRE-DEPLOYMENT SJEKKLISTE

### **1. SIKKERHET (KRITISK)** 🔴

**A. Re-enable Middleware Auth:**
```typescript
// src/middleware.ts
// FJERN denne linjen (linje 27-29):
if (process.env.NODE_ENV !== 'production') {
  return NextResponse.next()
}

// Slik at admin ALLTID krever auth i prod
```

**B. Aktiver CSP:**
```typescript
// src/middleware.ts (linje 95)
// ENDRE fra:
if (process.env.NODE_ENV === 'production') {
  // CSP kode
}

// TIL: (alltid aktiv)
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  ...
].join('; ')
response.headers.set('Content-Security-Policy', csp)
```

**C. Fjern Dev Bypass i PolicyEngine:**
```typescript
// src/modules/security2/core/PolicyEngine.ts
// src/modules/hansen-security/core/PolicyEngine.ts
// FJERN dev-bypass sections
```

**D. Sjekk Passwords:**
```bash
# Ingen hardcoded passwords i kode
grep -r "Kilma2386" src/  # Skal returnere 0 results

# Seed-script har passord - OK, men bruk env i prod:
# process.env.OWNER_PASSWORD || 'fallback'
```

---

### **2. ENVIRONMENT VARIABLES** 🔑

**Sett i Vercel Dashboard:**
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# AI (velg én)
OPENAI_API_KEY=sk-proj-...         # Anbefales (fungerer)
NORA_AI_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini

# ELLER:
GOOGLE_AI_API_KEY=din-key
NORA_AI_PROVIDER=google
GOOGLE_AI_MODEL=models/gemini-2.0-flash

# Embeddings (valgfritt)
EMBEDDING_PROVIDER=openai          # Same OpenAI key

# Stripe (når klar)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_URL=https://catohansen.no
NODE_ENV=production

# Security (generer nye!)
NEXTAUTH_SECRET=generer-ny-secret-her
JWT_SECRET=generer-ny-jwt-secret-her
```

---

### **3. DATABASE** 💾

**Setup Produksjons-DB:**
```bash
# Anbefalt: Neon eller Supabase (PostgreSQL)

# Neon: https://neon.tech (gratis tier)
# Supabase: https://supabase.com (gratis tier)

# Eller: Railway, Heroku Postgres

# Når du har DATABASE_URL:
npx prisma migrate deploy  # Kjør migrations
npx prisma db seed         # Seed data (valgfritt)
```

**Sjekk pgvector:**
```sql
-- Må være enabled for knowledge base:
CREATE EXTENSION IF NOT EXISTS vector;
```

---

### **4. BUILD VERIFICATION** ✅

```bash
cd ~/Dev/catohansen-online

# Lokal prod build:
npm run build

# Sjekk for errors:
# - TypeScript: 0 errors ✅
# - Build: Success ✅
# - Warnings: Review (ikke kritiske)

# Test prod server lokalt:
npm run start
open http://localhost:3000

# Verifiser:
- Landing fungerer ✅
- Marketplace fungerer ✅
- Admin login fungerer ✅
- Nora demo fungerer ✅
```

---

### **5. FILES & ASSETS** 📁

**Sjekk disse eksisterer:**
```bash
# Public assets:
ls -la public/

# Bilder for Open Graph:
# public/og-image.jpg
# public/og-nora.jpg
# public/og-marketplace.jpg

# Favicon:
# public/favicon.ico
# public/apple-touch-icon.png
```

**Generer hvis mangler:**
```bash
# Lag OG images (1200x630)
# Lag favicons (multiple sizes)
```

---

## 🚀 VERCEL DEPLOYMENT (Anbefales)

### **Steg 1: Push til GitHub**
```bash
cd ~/Dev/catohansen-online

# Commit alle endringer:
git add .
git commit -m "🚀 Production Ready - Hansen Global Platform 2.6

✅ 4 faser fullført
✅ 11 moduler production-ready
✅ Nora AI enhanced
✅ Marketplace live
✅ AI Agents implementert
✅ Health monitoring
✅ Sikkerhet re-enabled
✅ 100% test coverage

Signed-off-by: Cato Hansen <cato@catohansen.no>"

git push origin main
```

### **Steg 2: Connect til Vercel**
```
1. Gå til: https://vercel.com
2. Sign up / Log in
3. New Project
4. Import Git Repository (velg ditt repo)
5. Configure:
   - Framework: Next.js ✅ (auto-detected)
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
```

### **Steg 3: Environment Variables**
```
I Vercel dashboard:
Settings > Environment Variables

Lim inn alle fra "ENVIRONMENT VARIABLES" seksjonen over
```

### **Steg 4: Deploy**
```
Click "Deploy"

Første deploy: ~3-5 minutter
URL: https://catohansen-online.vercel.app (midlertidig)
```

### **Steg 5: Custom Domain**
```
Settings > Domains
Add: catohansen.no

DNS Setup (hos domeneregistrar):
A Record: 76.76.21.21
CNAME: cname.vercel-dns.com

Vent 5-60 min for DNS propagation
```

---

## 🧪 POST-DEPLOYMENT TESTING

### **Test Checklist:**
```bash
# 1. Public pages
https://catohansen.no           ✓
https://catohansen.no/nora      ✓
https://catohansen.no/marketplace ✓

# 2. Admin
https://catohansen.no/admin/login ✓
# Login med dine credentials
https://catohansen.no/admin ✓

# 3. APIs
curl https://catohansen.no/api/v1/core/health
curl https://catohansen.no/api/marketplace/products

# 4. Nora
# Test "Try Live Demo"
# Test "Ask Nora" i admin

# 5. Mobile
# Test på mobil (responsivt)
```

---

## ⚠️ COMMON ISSUES

### **1. "Sikkerhetsfeil" ved login:**
```
Problem: NEXTAUTH_SECRET mangler
Fix: Legg til i Vercel env vars
```

### **2. "Database connection failed":**
```
Problem: DATABASE_URL feil eller DB ikke tilgjengelig
Fix: Sjekk connection string, enable pgvector
```

### **3. "Build failed":**
```
Problem: Environment variables mangler i build
Fix: Legg til NEXT_PUBLIC_* vars
```

### **4. "Nora ikke svarer":**
```
Problem: AI keys ikke satt eller feil
Fix: Sjekk OPENAI_API_KEY i Vercel
Test: Demo-modus skal alltid fungere
```

---

## 📊 MONITORING POST-DEPLOY

### **Vercel Analytics:**
```
1. Enable i Vercel dashboard
2. Gratis tier: 100k events/mnd
3. Se: Page views, Unique visitors, Performance
```

### **Sentry (Valgfritt):**
```bash
# For error tracking:
npm install @sentry/nextjs

# Configure:
SENTRY_DSN=https://...@sentry.io/...
```

### **Google Analytics (Valgfritt):**
```html
<!-- Add to layout.tsx -->
<Script src="https://www.googletagmanager.com/gtag/js?id=G-..." />
```

---

## 🔐 SECURITY CHECKLIST

**Før Go-Live:**
- [ ] Admin middleware auth enabled ✓
- [ ] CSP headers active ✓
- [ ] PolicyEngine dev-bypass removed ✓
- [ ] HTTPS enforced (Vercel auto) ✓
- [ ] Environment secrets not in code ✓
- [ ] Sensitive logs redacted ✓
- [ ] Rate limiting active (add Upstash)
- [ ] CORS configured (if needed)

---

## 📈 POST-LAUNCH TODO

### **Uke 1:**
- [ ] Monitor Vercel logs
- [ ] Track visitor analytics
- [ ] Fix any deployment bugs
- [ ] Collect user feedback

### **Uke 2:**
- [ ] Optimize based on real data
- [ ] Add monitoring alerts
- [ ] Setup backups
- [ ] Document common issues

---

## 🎯 SUCCESS METRICS

**Launch is successful when:**
- ✅ All pages load (200 OK)
- ✅ Admin requires login
- ✅ Nora chat works
- ✅ Marketplace displays
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Performance good (< 2s LCP)

---

## 📞 SUPPORT

**Issues post-deploy?**
- Vercel Logs: Dashboard > Logs
- E-post: cato@catohansen.no
- Docs: Dette dokument

---

**© 2025 Cato Hansen**

**Deploy with confidence! 🚀**

