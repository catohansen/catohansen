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

# ⚡ VERCEL QUICK SETUP - Kopier og Lim Inn

**Dato:** 2025-01-16  
**Tid:** 10 minutter

---

## 🎯 RASK GUIDE

### 1. Opprett Vercel Prosjekt

1. Gå til [vercel.com](https://vercel.com) → Logg inn
2. **"Add New Project"** → **"Import Git Repository"**
3. Velg **`catohansen`** repo
4. Klikk **"Import"**
5. **IKKE klikk "Deploy" ennå!**

---

## 🔑 2. Sett Environment Variables

Gå til **Settings** → **Environment Variables** og legg til disse:

### Database:
```
DATABASE_URL
postgresql://neondb_owner:npg_SZuU5x8wqAcl@ep-snowy-base-ag874ph7-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
☑ Production ☑ Preview ☑ Development
```

### Security:
```
NEXTAUTH_SECRET
oGuoxeUHAeQ4EIqBuULfG+mdTNMEXxkHSjfeEnRkOIc=
☑ Production ☑ Preview ☑ Development
```

```
JWT_SECRET
gsuRjolzUWmhZh5ODY36nJv+wUcBquH8i1AAVp/ta4A=
☑ Production ☑ Preview ☑ Development
```

### App Config:
```
NEXT_PUBLIC_URL
https://catohansen.vercel.app
☑ Production ☑ Preview ☑ Development
```

```
NODE_ENV
production
☑ Production ☑ Preview ☑ Development
```

### AI (OpenAI):
```
OPENAI_API_KEY
sk-proj-DIN-KEY-HER
☑ Production ☑ Preview ☑ Development
```
⚠️  **VIKTIG:** Skaff key fra [platform.openai.com/api-keys](https://platform.openai.com/api-keys) og legg til $5-10 credit

```
NORA_AI_PROVIDER
openai
☑ Production ☑ Preview ☑ Development
```

```
OPENAI_MODEL
gpt-4o-mini
☑ Production ☑ Preview ☑ Development
```

```
EMBEDDING_PROVIDER
openai
☑ Production ☑ Preview ☑ Development
```

---

## 🚀 3. Deploy

1. Gå til **"Deployments"** tab
2. Klikk **"Deploy"** (eller **"Redeploy"** hvis allerede deployet)
3. Vent 3-5 minutter
4. ✅ Klar! URL: `https://catohansen.vercel.app`

---

## ✅ 4. Test

- [ ] Landing page: `https://catohansen.vercel.app`
- [ ] Admin login: `https://catohansen.vercel.app/admin/login`
- [ ] Nora AI: `https://catohansen.vercel.app/nora`

---

## 🆘 Hvis noe feiler

- **Build feiler:** Sjekk at alle environment variables er satt
- **Database error:** Sjekk DATABASE_URL
- **Login feiler:** Sjekk NEXTAUTH_SECRET og JWT_SECRET
- **Nora ikke svarer:** Sjekk OPENAI_API_KEY har credit

Se `docs/guides/VERCEL_DEPLOYMENT_COMPLETE.md` for detaljer.

