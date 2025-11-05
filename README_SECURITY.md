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

# 🔐 Sikkerhetsguide - Verdens Beste Sikkerhetssystem

## ✅ Owner Account Setup

### Default Credentials
- **Email**: `cato@catohansen.no`
- **Password**: `Kilma2386!!`
- **Role**: `OWNER` (Full access)

### Seeding Owner Account

#### Metode 1: Automatisk (Anbefalt)
Owner-kontoen opprettes/oppdateres automatisk ved første innlogging med riktige credentials.

#### Metode 2: Manuell seeding
```bash
npm run seed:owner
```

#### Metode 3: Via API (Development)
```bash
curl -X POST http://localhost:3000/api/admin/seed-owner \
  -H "x-seed-secret: dev-secret-change-in-production"
```

---

## 🔑 Login

1. Gå til `/admin/login`
2. Login med:
   - Email: `cato@catohansen.no`
   - Password: `Kilma2386!!`
3. Du vil bli logget inn som OWNER med full tilgang

---

## 📱 Password Reset via SMS

### Hvis du glemmer passordet:

1. Gå til `/admin/forgot-password`
2. Skriv inn email: `cato@catohansen.no`
3. (Optional) Skriv inn telefonnummer (hvis registrert)
4. Klikk "Send Reset SMS"
5. Sjekk SMS for midlertidig passord (6 siffer)
6. Logg inn med midlertidig passord
7. Endre passord i profil (`/admin/profile`)

### Registrer Telefonnummer:

1. Logg inn
2. Gå til `/admin/profile`
3. Legg til telefonnummer under "Phone Number"
4. Klikk "Save Profile"
5. Nå kan du bruke SMS password reset!

---

## 👤 Profile Management

### Redigere Profil

1. Gå til `/admin/profile`
2. Rediger:
   - Navn
   - Telefonnummer (for SMS reset)
   - Timezone
   - Locale
3. Klikk "Save Profile"

### Endre Passord

1. Gå til `/admin/profile`
2. I "Change Password" seksjonen:
   - Skriv inn nåværende passord
   - Skriv inn nytt passord (minst 8 tegn)
   - Bekreft nytt passord
3. Klikk "Change Password"

---

## 🔒 Sikkerhetsfeatures

### Implementert ✅
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ Password verification med error handling
- ✅ HttpOnly cookies for secure token storage
- ✅ Session management (database-backed)
- ✅ Account locking (5 failed attempts = 30 min lock)
- ✅ Failed login tracking
- ✅ Last login tracking (IP & timestamp)
- ✅ Audit logging (all actions logged)
- ✅ Hansen Security (RBAC/ABAC)
- ✅ Password reset via SMS
- ✅ Profile management

### Best Practices
1. ✅ **Deny by Default** - Default access er denied
2. ✅ **Password Hashing** - Bcrypt med 12 rounds
3. ✅ **HttpOnly Cookies** - XSS protection
4. ✅ **Account Locking** - Brute force protection
5. ✅ **Audit Logging** - All actions logged
6. ✅ **Input Validation** - All inputs validated
7. ✅ **Secure Error Messages** - Ingen sensitiv info i errors

---

## 🚀 Setup Instructions

### 1. Database Setup
```bash
# Push schema to database
npm run db:push

# Or create migration
npm run db:migrate
```

### 2. Seed Owner Account
```bash
npm run seed:owner
```

### 3. Test Login
- Gå til `/admin/login`
- Login med `cato@catohansen.no` / `Kilma2386!!`

### 4. Registrer Telefonnummer
- Gå til `/admin/profile`
- Legg til telefonnummer
- Save

---

## 📞 Support

Hvis du har problemer:
1. Sjekk at database er kjørende
2. Kjør `npm run seed:owner`
3. Sjekk audit logs i `/admin/hansen-security/audit`
4. Kontakt: cato@catohansen.no

---

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no
