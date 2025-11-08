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

# 🟢 Neon Database Setup - Steg for Steg

**Dato:** 2025-01-16  
**Tid:** ~15 minutter

---

## 🎯 MÅL

Opprett PostgreSQL database på Neon og push Prisma schema.

---

## 📋 STEG 1: Opprett Neon Konto og Prosjekt (5 min)

### 1.1 Gå til Neon

1. Åpne [neon.tech](https://neon.tech) i nettleseren
2. Klikk **"Sign Up"** (eller **"Log In"** hvis du har konto)
3. Logg inn med GitHub (anbefales) eller e-post

### 1.2 Opprett Prosjekt

1. Etter innlogging, klikk **"Create a project"** (eller **"New Project"**)
2. Fyll inn:
   - **Project name:** `catohansen-prod`
   - **Region:** Velg nærmest Norge:
     - `EU (Frankfurt)` - Anbefales
     - `EU (Ireland)` - Alternativ
   - **PostgreSQL version:** `16` (anbefales) eller `15`
   - **Database name:** `neondb` (default - OK)
3. Klikk **"Create project"**

### 1.3 Vent på Opprettelse

- Neon oppretter prosjektet automatisk (~30 sekunder)
- Du blir tatt til dashboard når det er klart

---

## 📋 STEG 2: Få Connection String (2 min)

### 2.1 Åpne Connection Details

1. I Neon dashboard, klikk på prosjektet `catohansen-prod`
2. Klikk på **"Connection Details"** (eller **"Connect"**)
3. Velg **"Connection string"** tab
4. Velg **"URI"** format

### 2.2 Kopier Connection String

Du får en string som ser ut som:
```
postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**VIKTIG:** Kopier hele strengen inkludert `?sslmode=require`

### 2.3 Lagre Sikker

- Lagre connection string i en sikker fil (du trenger den senere)
- **IKKE** commit denne til git (den er allerede i `.gitignore`)

---

## 📋 STEG 3: Enable pgvector Extension (2 min)

### 3.1 Åpne SQL Editor

1. I Neon dashboard, klikk **"SQL Editor"** (i venstre meny)
2. Klikk **"New query"**

### 3.2 Kjør SQL

Lim inn og kjør:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

3. Klikk **"Run"** (eller trykk `Cmd+Enter` / `Ctrl+Enter`)
4. Du skal se: **"Success"** eller **"Query executed successfully"**

**Hvorfor?** pgvector er nødvendig for AI embeddings og vektorsøk i Nora-modulen.

---

## 📋 STEG 4: Push Prisma Schema (5 min)

### 4.1 Sett DATABASE_URL

```bash
cd /Users/catohansen/Dev/catohansen-projeckt/catohansen-online

# Sett DATABASE_URL (erstatt med din connection string):
export DATABASE_URL="postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

### 4.2 Push Schema (Automatisk)

```bash
# Bruk setup script:
./scripts/setup-neon.sh "$DATABASE_URL"
```

**Eller manuelt:**
```bash
# Generer Prisma Client:
npx prisma generate

# Push schema:
npx prisma db push

# Enable pgvector (hvis ikke allerede gjort):
npx prisma db execute --stdin <<EOF
CREATE EXTENSION IF NOT EXISTS vector;
EOF
```

### 4.3 Verifiser

```bash
# Test connection:
npx prisma studio
```

Dette åpner Prisma Studio i nettleseren hvor du kan se alle tabeller.

---

## ✅ VERIFISERING

### Sjekkliste:

- [ ] Neon prosjekt opprettet: `catohansen-prod`
- [ ] Connection string kopiert
- [ ] pgvector extension enabled
- [ ] Prisma schema pushet (`npx prisma db push`)
- [ ] Prisma Studio åpner og viser tabeller

### Test Connection:

```bash
# Test med Prisma:
DATABASE_URL="din-connection-string" npx prisma db pull

# Skal returnere: "Introspecting based on datasource defined in prisma/schema.prisma"
```

---

## 🆘 TROUBLESHOOTING

### **"Connection refused" eller "Connection timeout":**

```
Problem: Database ikke tilgjengelig eller IP whitelist
Fix: 
1. Sjekk at prosjektet er aktivt i Neon dashboard
2. Sjekk at connection string er korrekt
3. Sjekk at sslmode=require er inkludert
```

### **"Extension vector does not exist":**

```
Problem: pgvector ikke installert
Fix: Kjør i SQL Editor:
CREATE EXTENSION IF NOT EXISTS vector;
```

### **"Schema push failed":**

```
Problem: Prisma schema har feil
Fix:
1. Sjekk prisma/schema.prisma for syntaksfeil
2. Kjør: npx prisma validate
3. Prøv igjen: npx prisma db push
```

### **"Authentication failed":**

```
Problem: Feil brukernavn/passord i connection string
Fix:
1. Gå til Neon dashboard → Connection Details
2. Kopier connection string på nytt
3. Sjekk at hele strengen er kopiert (inkludert ?sslmode=require)
```

---

## 📋 NESTE STEG

Når database er satt opp:

1. **Kopier DATABASE_URL** - Du trenger den i Vercel
2. **Gå til Vercel Setup** - Se `docs/guides/GITHUB_VERCEL_NEON_SETUP.md`
3. **Sett Environment Variables** - Legg til DATABASE_URL i Vercel

---

## 💡 TIPS

- **Backup:** Neon har automatisk backups, men du kan også eksportere data
- **Scaling:** Neon skalerer automatisk basert på bruk
- **Monitoring:** Se database metrics i Neon dashboard
- **Connection Pooling:** Neon bruker connection pooling automatisk

---

**Spørsmål?** Sjekk Neon dokumentasjon eller kontakt support.

