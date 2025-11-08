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

# 🚀 DEPLOY NÅ - 3 ENKLE STEG

**Dato:** 2025-01-16  
**Tid:** 10 minutter  
**Status:** Alt er klart!

---

## ⚡ RASK GUIDE

### 1️⃣ Opprett Vercel Prosjekt (2 min)

1. Gå til: **[vercel.com](https://vercel.com)**
2. Logg inn (eller opprett konto)
3. Klikk **"Add New Project"**
4. Klikk **"Import Git Repository"**
5. Velg **`catohansen`** repo
6. Klikk **"Import"**
7. **IKKE klikk "Deploy" ennå!**

---

### 2️⃣ Sett Environment Variables (5 min)

Gå til **Settings** → **Environment Variables** og legg til disse 8 variablene:

#### Variabel 1: Database
```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_SZuU5x8wqAcl@ep-snowy-base-ag874ph7-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
☑ Production ☑ Preview ☑ Development
```

#### Variabel 2: Security
```
Name: NEXTAUTH_SECRET
Value: oGuoxeUHAeQ4EIqBuULfG+mdTNMEXxkHSjfeEnRkOIc=
☑ Production ☑ Preview ☑ Development
```

#### Variabel 3: Security
```
Name: JWT_SECRET
Value: gsuRjolzUWmhZh5ODY36nJv+wUcBquH8i1AAVp/ta4A=
☑ Production ☑ Preview ☑ Development
```

#### Variabel 4: App Config
```
Name: NEXT_PUBLIC_URL
Value: https://catohansen.vercel.app
☑ Production ☑ Preview ☑ Development
```

#### Variabel 5: App Config
```
Name: NODE_ENV
Value: production
☑ Production ☑ Preview ☑ Development
```

#### Variabel 6: AI (Google - Gratis!)
```
Name: GOOGLE_AI_API_KEY
Value: AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE
☑ Production ☑ Preview ☑ Development
```

#### Variabel 7: AI Config
```
Name: GOOGLE_AI_MODEL
Value: gemini-1.5-flash-latest
☑ Production ☑ Preview ☑ Development
```

#### Variabel 8: AI Config
```
Name: NORA_AI_PROVIDER
Value: google
☑ Production ☑ Preview ☑ Development
```

---

### 3️⃣ Deploy (3 min)

1. Gå til **"Deployments"** tab
2. Klikk **"Deploy"**
3. Vent 3-5 minutter
4. ✅ **FERDIG!** Prosjektet ditt er live på: `https://catohansen.vercel.app`

---

## ✅ TEST

Etter deployment, test disse URL-ene:

- [ ] **Landing page:** `https://catohansen.vercel.app`
- [ ] **Admin login:** `https://catohansen.vercel.app/admin/login`
- [ ] **Nora AI:** `https://catohansen.vercel.app/nora`

---

## 🆘 Hvis noe feiler

### Build feiler?
- Sjekk at alle 8 environment variables er satt
- Sjekk at alle har ☑ Production, Preview, Development

### Database error?
- Sjekk DATABASE_URL er kopiert korrekt (hele strengen)

### Login feiler?
- Sjekk NEXTAUTH_SECRET og JWT_SECRET er satt

### Nora ikke svarer?
- Sjekk GOOGLE_AI_API_KEY er satt
- Sjekk NORA_AI_PROVIDER er "google"

---

## 📚 MER Hjelp?

- **Detaljert guide:** `docs/guides/VERCEL_DEPLOYMENT_COMPLETE.md`
- **Alle verdier:** `VERCEL_ENV_VARS_COMPLETE.txt`
- **Quick setup:** `VERCEL_QUICK_SETUP.md`

---

**🎉 Lykke til med deployment!**
