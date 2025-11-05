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

# 📊 Database Setup Guide

## Option 1: Neon (PostgreSQL) - Recommended ⭐

### 1. Create Neon Account
1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project

### 2. Get Connection String
1. Copy the connection string from Neon dashboard
2. Format: `postgresql://user:password@host/database?sslmode=require`

### 3. Configure Environment
Create `.env` file in project root:

```bash
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### 4. Push Schema
```bash
npm run db:push
```

### 5. Seed Owner Account
```bash
npm run seed:owner
```

---

## Option 2: Supabase (PostgreSQL)

### 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project

### 2. Get Connection String
1. Go to Project Settings > Database
2. Copy connection string
3. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### 3. Configure Environment
Create `.env` file:

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

### 4. Push Schema & Seed
```bash
npm run db:push
npm run seed:owner
```

---

## Option 3: Local PostgreSQL

### 1. Install PostgreSQL
```bash
# macOS (Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14
```

### 2. Create Database
```bash
psql -U postgres
CREATE DATABASE catohansen;
\q
```

### 3. Configure Environment
Create `.env` file:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/catohansen"
```

### 4. Push Schema & Seed
```bash
npm run db:push
npm run seed:owner
```

---

## ✅ Verification

After setup, test login:
1. Go to `/admin/login`
2. Email: `cato@catohansen.no`
3. Password: `Kilma2386!!`

You should be able to login successfully!

---

## 🔧 Troubleshooting

### "Prisma client not available"
- Run: `npx prisma generate`
- Make sure `DATABASE_URL` is set in `.env`

### "Connection refused"
- Check database is running
- Verify `DATABASE_URL` is correct
- For Neon/Supabase: Check SSL mode is enabled

### "Schema is out of sync"
- Run: `npm run db:push`
- Or: `npx prisma migrate dev`

---

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no
