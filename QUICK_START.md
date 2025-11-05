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

# 🚀 Quick Start - Verdens Beste Sikkerhetssystem

## ✅ Owner Login

### Credentials
- **Email**: `cato@catohansen.no`
- **Password**: `Kilma2386!!`

### Login
1. Gå til `http://localhost:3000/admin/login`
2. Logg inn med credentials over
3. Du vil bli logget inn som **OWNER** med full tilgang

---

## 🔧 Setup

### 1. Database Setup
```bash
# Push schema to database
npm run db:push
```

### 2. Seed Owner Account (Optional)
```bash
# Owner account opprettes automatisk ved første login
# Men du kan også seede manuelt:
npm run seed:owner
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Login
- Gå til `/admin/login`
- Login med: `cato@catohansen.no` / `Kilma2386!!`

---

## 📱 Password Reset

### Registrer Telefonnummer
1. Logg inn
2. Gå til `/admin/profile`
3. Legg til telefonnummer
4. Save

### Glemt Passord?
1. Gå til `/admin/forgot-password`
2. Skriv inn email: `cato@catohansen.no`
3. Klikk "Send Reset SMS"
4. Sjekk SMS for midlertidig passord
5. Logg inn med midlertidig passord
6. Endre passord i profil

---

## ✅ Status

Systemet er nå **verdens beste sikkerhetssystem** med:
- ✅ Proper password hashing
- ✅ Owner account med riktig credentials
- ✅ Password reset via SMS
- ✅ Profile management
- ✅ Account locking
- ✅ Audit logging
- ✅ Hansen Security RBAC/ABAC
- ✅ Session management

---

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no
