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

# 🗄️ Sett opp ekte database (Production-Ready)

Systemet er nå oppdatert til å **kreve ekte database** i stedet for mock data.

---

## 🚀 Raskeste løsning: Neon (5 minutter) ⭐

### Steg 1: Opprett Neon Database
1. Gå til: https://neon.tech
2. Klikk "Sign Up" (gratis)
3. Klikk "Create Project"
4. Velg region (anbefalt: nærmest Norge/Europa)
5. Kopier **connection string**

### Steg 2: Konfigurer .env
1. Åpne `.env` filen i prosjektets rot
2. Erstatt placeholder med ekte connection string:
```bash
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

### Steg 3: Sett opp Database
```bash
# Generer Prisma Client
npx prisma generate

# Push schema til database
npm run db:push

# Seed owner account
npm run seed:owner
```

### Steg 4: Test Login
1. Start server: `npm run dev`
2. Gå til: `http://localhost:3000/admin/login`
3. Email: `cato@catohansen.no`
4. Password: `Kilma2386!!`
5. ✅ Du skal være innlogget!

---

## 🔄 Alternativ: Supabase (gratis)

### Steg 1: Opprett Supabase Project
1. Gå til: https://supabase.com
2. Klikk "Start your project" (gratis)
3. Opprett nytt prosjekt
4. Gå til: **Settings > Database**
5. Kopier **Connection string** (URI format)

### Steg 2: Konfigurer .env
```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Steg 3: Sett opp Database
```bash
npx prisma generate
npm run db:push
npm run seed:owner
```

---

## 💻 Lokal PostgreSQL (Development)

### Steg 1: Installer PostgreSQL
```bash
# macOS (Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Eller med Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14
```

### Steg 2: Opprett Database
```bash
# Opprett database
createdb catohansen_online

# Eller med psql
psql -U postgres
CREATE DATABASE catohansen_online;
\q
```

### Steg 3: Konfigurer .env
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/catohansen_online?schema=public"
```

### Steg 4: Sett opp Database
```bash
npx prisma generate
npm run db:push
npm run seed:owner
```

---

## ✅ Verifisering

Etter oppsett, test at alt fungerer:

```bash
# Test database connection
npx prisma studio

# Eller test via API
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cato@catohansen.no","password":"Kilma2386!!"}'
```

---

## 🔧 Troubleshooting

### "DATABASE_URL is not set"
- Sjekk at `.env` filen eksisterer i prosjektets rot
- Sjekk at `DATABASE_URL` er satt (ikke placeholder)
- Restart Next.js server etter å ha lagt til `.env`

### "Connection refused"
- Sjekk at database kjører (Neon/Supabase er alltid på)
- Sjekk at `DATABASE_URL` er korrekt
- For lokal PostgreSQL: sjekk at service kjører

### "Schema is out of sync"
```bash
# Push schema på nytt
npm run db:push

# Eller kjør migration
npm run db:migrate
```

### "Prisma client not generated"
```bash
# Generer på nytt
npx prisma generate
```

---

## 📊 Database Schema

Systemet inkluderer:
- ✅ User Management (avansert RBAC)
- ✅ Hansen Security (Policy Engine)
- ✅ Client Management (CRM)
- ✅ Pipeline & Leads
- ✅ Tasks & Documents
- ✅ Notifications & Reports
- ✅ Audit Logging

Se `prisma/schema.prisma` for full oversikt.

---

## 🎯 Neste Steg

1. ✅ Sett opp database (Neon anbefalt)
2. ✅ Test login
3. ✅ Begynn å bruke admin panel
4. ✅ Les `docs/guides/QUICK_START.md` for mer info

---

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no







