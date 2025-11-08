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

# Session Management - Automatisk Fornyelse

## 🎯 Oversikt

Session management systemet har nå automatisk fornyelse av sessions før de utløper. Dette sikrer at aktive brukere ikke blir logget ut uventet.

---

## ✨ Funksjoner

### 1. **Automatisk Session Fornyelse**
- Sessions fornyes automatisk når 25% av levetiden gjenstår
- Standard: Sessions fornyes når de har 25% av levetiden igjen
- Kan konfigureres via `renewalThreshold` parameter

### 2. **Manuell Session Fornyelse**
- API endpoint for manuell fornyelse: `/api/modules/user-management/auth/session/renew`
- Støtter `rememberMe` flagg for lengre sessions (30 dager vs 7 dager)

### 3. **Client-side Session Renewal Manager**
- Automatisk sjekk hvert 5. minutt
- Fornyer sessions automatisk i bakgrunnen
- Kan konfigureres med egendefinerte intervaller

---

## 📁 Filer Opprettet/Endret

### Backend:
- ✅ `src/modules/user-management/core/AuthEngine.ts` - Lagt til automatisk fornyelse i `verifySession()`
- ✅ `src/modules/user-management/core/AuthEngine.ts` - Lagt til `renewSession()` metode
- ✅ `src/modules/user-management/api/auth/session/route.ts` - Oppdatert med auto-renew støtte
- ✅ `src/modules/user-management/api/auth/session/renew/route.ts` - Ny API route for manuell fornyelse

### Frontend:
- ✅ `src/lib/auth/sessionRenewal.ts` - Client-side session renewal manager

### Tester:
- ✅ `tests/session-management.test.ts` - Omfattende tester for session-expiry og renewal

---

## 🔧 Tekniske Detaljer

### Automatisk Fornyelse

```typescript
// Standard oppførsel - fornyer når 25% av levetiden gjenstår
const result = await auth.verifySession(token, {
  autoRenew: true, // Default: true
  renewalThreshold: 25, // Default: 25%
})

if (result.renewed) {
  console.log('Session was automatically renewed')
}
```

### Manuell Fornyelse

```typescript
// Forny session manuelt
const result = await auth.renewSession(token, rememberMe)

if (result.success) {
  console.log('Session renewed until:', result.session?.expiresAt)
}
```

### Client-side Bruk

```typescript
import { sessionRenewal } from '@/lib/auth/sessionRenewal'

// Start automatisk fornyelse (sjekker hvert 5. minutt)
sessionRenewal.start()

// Stopp automatisk fornyelse
sessionRenewal.stop()

// Manuell fornyelse
await sessionRenewal.renew(rememberMe)
```

---

## 🧪 Testing

### Kjøre Tester

```bash
npm test -- session-management.test.ts
```

### Test Coverage

Tester dekker:
- ✅ Session expiry verifisering
- ✅ Automatisk fornyelse når threshold nås
- ✅ Ingen fornyelse når threshold ikke nås
- ✅ Manuell session fornyelse
- ✅ Feilhåndtering for utløpte sessions
- ✅ `rememberMe` flagg støtte

---

## 📊 Session Levetid

### Standard Sessions
- **Default**: 7 dager
- **Max**: 30 dager (med `rememberMe`)

### Fornyelse Threshold
- **Default**: 25% av levetiden gjenstår
- **Eksempel**: For en 7-dagers session, fornyes når 1.75 dager gjenstår

---

## 🔒 Sikkerhet

- Sessions fornyes kun hvis:
  - Session er fortsatt gyldig (ikke utløpt)
  - Bruker er aktiv (`status === 'ACTIVE'`)
  - Session token er gyldig

- Utløpte sessions kan ikke fornyes
- Inaktive brukere kan ikke fornye sessions

---

## 📝 API Endpoints

### GET `/api/modules/user-management/auth/session`
Verifiser session med automatisk fornyelse

**Query Parameters:**
- `autoRenew` (boolean, default: true) - Aktiver/deaktiver automatisk fornyelse
- `renewalThreshold` (number, default: 25) - Prosent av levetid før fornyelse

**Response:**
```json
{
  "valid": true,
  "user": { ... },
  "session": { ... },
  "renewed": true
}
```

### POST `/api/modules/user-management/auth/session/renew`
Manuell session fornyelse

**Body:**
```json
{
  "rememberMe": false
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "...",
    "token": "...",
    "expiresAt": "..."
  }
}
```

---

## 🚀 Bruk i Komponenter

### React Component Eksempel

```typescript
'use client'

import { useEffect } from 'react'
import { sessionRenewal } from '@/lib/auth/sessionRenewal'

export default function MyComponent() {
  useEffect(() => {
    // Start automatisk session fornyelse
    sessionRenewal.start()

    // Cleanup ved unmount
    return () => {
      sessionRenewal.stop()
    }
  }, [])

  return <div>...</div>
}
```

---

**Rapport generert:** 2025-01-XX  
**Status:** ✅ Implementert og testet


