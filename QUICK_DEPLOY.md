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

# ⚡ RASK DEPLOYMENT GUIDE

**Dato:** 2025-01-16  
**Tid:** ~60 minutter totalt

---

## 🎯 3 ENKLE STEG

### 1️⃣ GitHub (10 min)

```bash
# 1. Opprett repo på GitHub.com
#    - Gå til: https://github.com/new
#    - Navn: catohansen
#    - Private (anbefales)
#    - Ikke huk av "Initialize with README"

# 2. Sett opp remote (erstatt <ditt-brukernavn>):
npm run setup:github <ditt-brukernavn>

# 3. Push kode:
git push -u origin master
```

### 2️⃣ Neon Database (15 min)

```bash
# 1. Gå til: https://neon.tech
# 2. Opprett prosjekt: catohansen-prod
# 3. Kopier connection string
# 4. Enable pgvector:
#    - Gå til SQL Editor
#    - Kjør: CREATE EXTENSION IF NOT EXISTS vector;

# 5. Push schema (sett DATABASE_URL først):
export DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
npx prisma db push
```

### 3️⃣ Vercel (20 min)

```bash
# 1. Gå til: https://vercel.com
# 2. "Add New Project" → Import fra GitHub
# 3. Velg "catohansen" repo
# 4. Klikk "Deploy" (vil feile først - OK)

# 5. Generer secrets:
npm run generate:secrets

# 6. Sett environment variables i Vercel Dashboard:
#    - Settings → Environment Variables
#    - Legg til alle fra VERCEL_ENV_VARS.txt
#    - Bruk secrets fra steg 5

# 7. Redeploy:
#    - Deployments → ... → Redeploy
```

---

## 📋 ENVIRONMENT VARIABLES (Kopier til Vercel)

Se `VERCEL_ENV_VARS.txt` eller `docs/guides/GITHUB_VERCEL_NEON_SETUP.md` for full liste.

**Minimum required:**
- `DATABASE_URL` (fra Neon)
- `OPENAI_API_KEY` (fra platform.openai.com)
- `NEXTAUTH_SECRET` (fra `npm run generate:secrets`)
- `JWT_SECRET` (fra `npm run generate:secrets`)
- `NEXT_PUBLIC_URL` (https://catohansen.vercel.app)
- `NODE_ENV=production`

---

## ✅ TEST

Etter deployment, test:
- https://catohansen.vercel.app (landing page)
- https://catohansen.vercel.app/admin/login (admin)
- https://catohansen.vercel.app/nora (Nora AI)

---

## 📚 FULL GUIDE

Se `docs/guides/GITHUB_VERCEL_NEON_SETUP.md` for detaljert instruksjoner.

---

## 🆘 PROBLEMER?

1. **Build feiler:** Sjekk environment variables i Vercel
2. **Database error:** Sjekk DATABASE_URL og sslmode=require
3. **Login feiler:** Sjekk NEXTAUTH_SECRET er satt
4. **Nora ikke svarer:** Sjekk OPENAI_API_KEY har credit

Se `docs/guides/GITHUB_VERCEL_NEON_SETUP.md` → Troubleshooting seksjon.

