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

# 🚀 Quick Database Setup

## Fastest Option: Neon (5 minutes)

### Step 1: Create Neon Database (2 min)
1. Visit: https://neon.tech
2. Click "Sign Up" (free)
3. Click "Create Project"
4. Copy the connection string

### Step 2: Configure (1 min)
1. Create `.env` file in project root:
```bash
DATABASE_URL="[paste connection string from Neon]"
```

### Step 3: Setup Database (2 min)
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npm run db:push

# Seed owner account
npm run seed:owner
```

### Step 4: Test Login
1. Go to: `http://localhost:3000/admin/login`
2. Email: `cato@catohansen.no`
3. Password: `Kilma2386!!`
4. ✅ You should be logged in!

---

## Alternative: Supabase

1. Visit: https://supabase.com
2. Create project
3. Copy connection string from Settings > Database
4. Add to `.env` file
5. Run: `npx prisma generate && npm run db:push && npm run seed:owner`

---

## ✅ Done!

Your database is now set up and ready to use!

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no







