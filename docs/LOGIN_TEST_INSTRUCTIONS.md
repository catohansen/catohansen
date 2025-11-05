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

# 🔐 Login Test Instruksjoner

## 🚀 Server er Startet!

Serveren kjører på: `http://localhost:3000`

---

## 📍 Login Siden

**URL**: `http://localhost:3000/admin/login`

Login siden er åpnet i nettleseren din.

---

## 🔑 Login Credentials

### Standard Owner Account:
- **Email**: `cato@catohansen.no`
- **Password**: `Kilma2386!!`

---

## 📝 Steg-for-Steg Test

### 1. Vent på Server
Serveren tar 30-60 sekunder å kompilere første gang.
- Se etter "Ready" melding i terminalen
- Eller vent til siden laster i nettleseren

### 2. Test Login
1. Skriv inn email: `cato@catohansen.no`
2. Skriv inn password: `Kilma2386!!`
3. Klikk "Log In"

### 3. Hvis Login Feiler

#### Option A: Seed Owner User (Anbefalt)
```bash
# I terminalen:
curl -X POST http://localhost:3000/api/admin/seed-owner \
  -H "x-seed-secret: dev-secret-change-in-production"
```

#### Option B: Sjekk Database
```bash
# Sjekk at database kjører:
npx prisma db push --skip-generate

# Sjekk at owner user eksisterer:
npm run seed:owner
```

### 4. Forventet Resultat
Etter vellykket login:
- ✅ Redirect til `/admin` dashboard
- ✅ Sidebar og top menu vises
- ✅ Dashboard med KPI cards vises
- ✅ Token lagret i cookie

---

## 🐛 Troubleshooting

### Problem: "An error occurred during login"
**Løsning**:
1. Seed owner user først (se over)
2. Sjekk at database kjører
3. Verifiser Prisma Client er generert: `npx prisma generate`

### Problem: "Database connection failed"
**Løsning**:
1. Sjekk `.env` fil har `DATABASE_URL`
2. Test database connection: `npx prisma db push`
3. Start database hvis lokal: `docker start postgres` eller start lokal PostgreSQL

### Problem: Server ikke tilgjengelig
**Løsning**:
1. Vent 30-60 sekunder for første build
2. Sjekk terminal for feilmeldinger
3. Restart server: `npm run dev`

---

## ✅ Suksess!

Når login fungerer:
- ✅ Du vil se admin dashboard
- ✅ Sidebar viser alle moduler
- ✅ KPI cards vises
- ✅ Du kan navigere til forskjellige admin sider

---

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no





