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

# 🚀 DEPLOY INSTRUKSJONER - Enkleste Måte

**Dato:** 2025-01-16  
**Tid:** 10 minutter

---

## ⚡ METODE 1: Vercel Dashboard (Anbefales - Enklest)

### Steg 1: Gå til Vercel
1. Åpne: **[vercel.com](https://vercel.com)**
2. Logg inn (eller opprett konto)
3. Klikk **"Add New Project"**

### Steg 2: Import Repository
1. Klikk **"Import Git Repository"**
2. Finn og velg **`catohansen`** repo
3. Klikk **"Import"**
4. **IKKE klikk "Deploy" ennå!**

### Steg 3: Sett Environment Variables
1. Klikk **"Settings"** (øverst)
2. Klikk **"Environment Variables"** (venstre meny)
3. Legg til disse 8 variablene (klikk "Add" for hver):

#### Variabel 1:
```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_SZuU5x8wqAcl@ep-snowy-base-ag874ph7-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
☑ Production ☑ Preview ☑ Development
```

#### Variabel 2:
```
Name: NEXTAUTH_SECRET
Value: oGuoxeUHAeQ4EIqBuULfG+mdTNMEXxkHSjfeEnRkOIc=
☑ Production ☑ Preview ☑ Development
```

#### Variabel 3:
```
Name: JWT_SECRET
Value: gsuRjolzUWmhZh5ODY36nJv+wUcBquH8i1AAVp/ta4A=
☑ Production ☑ Preview ☑ Development
```

#### Variabel 4:
```
Name: NEXT_PUBLIC_URL
Value: https://catohansen.vercel.app
☑ Production ☑ Preview ☑ Development
```

#### Variabel 5:
```
Name: NODE_ENV
Value: production
☑ Production ☑ Preview ☑ Development
```

#### Variabel 6:
```
Name: GOOGLE_AI_API_KEY
Value: AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE
☑ Production ☑ Preview ☑ Development
```

#### Variabel 7:
```
Name: GOOGLE_AI_MODEL
Value: gemini-1.5-flash-latest
☑ Production ☑ Preview ☑ Development
```

#### Variabel 8:
```
Name: NORA_AI_PROVIDER
Value: google
☑ Production ☑ Preview ☑ Development
```

### Steg 4: Deploy
1. Gå til **"Deployments"** tab
2. Klikk **"Deploy"**
3. Vent 3-5 minutter
4. ✅ **FERDIG!** Hjemmesiden er live på: `https://catohansen.vercel.app`

---

## 💻 METODE 2: Vercel CLI (Hvis du foretrekker terminal)

### Steg 1: Installer Vercel CLI
```bash
npm install -g vercel
```

### Steg 2: Logg inn
```bash
vercel login
```

### Steg 3: Sett Environment Variables i Dashboard
Følg Steg 3 fra METODE 1 over (må gjøres i Dashboard)

### Steg 4: Deploy
```bash
npm run deploy:vercel
```

Eller direkte:
```bash
vercel --prod
```

---

## ✅ TESTING

Etter deployment, test:

- [ ] **Landing page:** `https://catohansen.vercel.app`
- [ ] **Admin login:** `https://catohansen.vercel.app/admin/login`
- [ ] **Nora AI:** `https://catohansen.vercel.app/nora`

---

## 🆘 Hvis noe feiler

### Build feiler?
- Sjekk at alle 8 environment variables er satt
- Sjekk at alle har ☑ Production, Preview, Development

### Database error?
- Sjekk DATABASE_URL er korrekt kopiert

### Login feiler?
- Sjekk NEXTAUTH_SECRET og JWT_SECRET er satt

### Nora ikke svarer?
- Sjekk GOOGLE_AI_API_KEY er satt
- Sjekk NORA_AI_PROVIDER er "google"

---

## 📚 MER Hjelp?

- **DEPLOY_NOW.md** - Enkleste guide
- **DEPLOYMENT_CHECKLIST.md** - Checklist
- **VERCEL_QUICK_SETUP.md** - Copy-paste guide

---

**🎉 Lykke til!**

