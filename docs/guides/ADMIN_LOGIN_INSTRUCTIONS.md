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
# 🔐 Admin Panel - Login Instruksjoner

## 📍 Hvor logger du inn?

### Lokal utvikling (Development)
1. **Start dev-serveren:**
   ```bash
   npm run dev
   ```

2. **Gå til admin login-siden:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Login credentials (Mock data - development):**
   - **Email:** `cato@catohansen.no`
   - **Password:** `admin123`

4. **Etter innlogging:**
   - Du blir automatisk sendt til: `http://localhost:3000/admin`
   - Her ser du admin dashboardet med alle modulene

---

## 🚀 Admin Panel Features

### Dashboard (`/admin`)
- KPI-kort (Total Clients, Active Projects, Revenue, etc.)
- Quick Actions
- Recent Activity Feed

### Moduler som er implementert:
- ✅ **Hansen Security** - Authorization system (erstattet Cerbos)
- ✅ **User Management** - Foundation lagt (NextAuth integration kommer)
- 🚧 **AI Agents** - Under utvikling
- 🚧 **Content Management** - Under utvikling
- 🚧 **Client Management** - Under utvikling
- 🚧 **Project Management** - Under utvikling
- 🚧 **Billing System** - Under utvikling
- 🚧 **Analytics** - Under utvikling
- 🚧 **Automation** - Under utvikling

---

## 📂 Admin Panel Struktur

```
/admin                    # Dashboard (hovedsiden)
/admin/login              # Login side
/admin/content            # Content Management
/admin/clients            # Client Management
/admin/projects           # Project Management
/admin/portfolio          # Portfolio Management
/admin/billing            # Billing & Invoicing
/admin/analytics          # Analytics
/admin/ai                 # AI Studio
/admin/automation         # Automation & Jobs
/admin/security           # Security & Settings
```

---

## 🔧 Development Setup

### 1. Install dependencies:
```bash
npm install
```

### 2. Setup Prisma (database):
```bash
# Create .env file with DATABASE_URL
echo "DATABASE_URL=your_database_url" > .env

# Generate Prisma client
npx prisma generate

# Run migrations (when ready)
npx prisma migrate dev
```

### 3. Start dev server:
```bash
npm run dev
```

### 4. Login:
- Gå til: `http://localhost:3000/admin/login`
- Email: `cato@catohansen.no`
- Password: `admin123`

---

## 🌐 Production (Domeneshop)

### Admin login URL:
```
https://catohansen.no/admin/login
```

### Login credentials:
- Disse skal endres til produksjon! 🔒
- Bruk sterkere passord i produksjon
- Setup NextAuth med ekte database

---

## ⚠️ Viktig Notat

**Nåværende implementasjon:**
- Bruker **mock data** for authentication
- Admin token lagres i cookie
- Ikke produksjonsklar ennå!

**For produksjon trenger du:**
1. ✅ Database (Postgres via Prisma)
2. ⏳ NextAuth integration (User Management modul)
3. ⏳ Ekte brukere i database
4. ⏳ Sikre passord-hashing (bcrypt/argon2)
5. ⏳ JWT tokens eller sessions
6. ⏳ 2FA support

---

## 📱 Admin Panel URLs

| Side | URL | Status |
|------|-----|--------|
| Dashboard | `/admin` | ✅ Fungerer |
| Login | `/admin/login` | ✅ Fungerer |
| Content | `/admin/content` | 🚧 Under utvikling |
| Clients | `/admin/clients` | 🚧 Under utvikling |
| Projects | `/admin/projects` | 🚧 Under utvikling |
| Portfolio | `/admin/portfolio` | 🚧 Under utvikling |
| Billing | `/admin/billing` | 🚧 Under utvikling |
| Analytics | `/admin/analytics` | 🚧 Under utvikling |
| AI Studio | `/admin/ai` | 🚧 Under utvikling |
| Automation | `/admin/automation` | 🚧 Under utvikling |
| Security | `/admin/security` | 🚧 Under utvikling |

---

## 🔍 Sjekk Admin Panel Status

Se `ADMIN_PANEL_STATUS.md` for detaljert oversikt over hva som er implementert.

---

## 🚀 Quick Start

```bash
# 1. Start server
npm run dev

# 2. Åpne browser
# Gå til: http://localhost:3000/admin/login

# 3. Login
Email: cato@catohansen.no
Password: admin123

# 4. Se admin dashboard
# Du er nå på: http://localhost:3000/admin
```

---

**Tips:** Alle endringer i kode oppdateres automatisk med hot reload! 🔥

