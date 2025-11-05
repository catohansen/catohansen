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

# API Structure - Hansen Global Solutions

**Version:** 1.0.0  
**Last Updated:** 2025-01-16  
**Author:** Cato Hansen

## 📋 Oversikt

API-strukturen er organisert med versjonering (`v1`) og klar separasjon mellom moduler, admin, og public APIs.

## 🏗️ API-Struktur

```
src/app/api/
├── v1/                      # API Version 1 (Current)
│   ├── core/               # Core system APIs
│   │   └── health/          # Health check endpoint
│   ├── modules/            # Module-specific APIs
│   │   ├── nora/           # Nora module APIs
│   │   ├── hansen-security/ # Security module APIs
│   │   └── [module]/       # Other modules
│   ├── admin/              # Admin APIs (requires auth)
│   └── public/             # Public APIs (no auth)
├── admin/                   # Legacy admin APIs (deprecated, use v1/admin)
├── modules/                 # Legacy module APIs (deprecated, use v1/modules)
└── nora/                    # Legacy Nora APIs (deprecated, use v1/modules/nora)
```

## 🎯 Versjonering

### API Version 1 (`/api/v1/`)

**Status:** ✅ Active (Current)

Alle nye APIs skal bruke `/api/v1/` prefix:

```
GET  /api/v1/core/health
POST /api/v1/modules/nora/chat
GET  /api/v1/modules/hansen-security/check
GET  /api/v1/admin/users
```

### Legacy APIs

**Status:** ⚠️ Deprecated (Maintained for backward compatibility)

Legacy APIs uten `/v1/` prefix fungerer fortsatt, men skal ikke brukes i nye integrasjoner:

```
POST /api/nora/chat          → Use /api/v1/modules/nora/chat
POST /api/modules/hansen-security/check → Use /api/v1/modules/hansen-security/check
```

## 📦 Module APIs

### Struktur

Hver modul har sine API-ruter i `src/modules/[modulnavn]/api/` og re-eksporteres i `src/app/api/v1/modules/[modulnavn]/`.

### Eksempel: Nora Module

```
src/modules/nora/api/
├── chat/
│   └── route.ts            # POST /api/v1/modules/nora/chat
├── memory/
│   └── route.ts            # GET/POST /api/v1/modules/nora/memory
├── status/
│   └── route.ts            # GET /api/v1/modules/nora/status
└── index.ts                # Re-export all routes

src/app/api/v1/modules/nora/
├── chat/
│   └── route.ts            # Re-export from module
├── memory/
│   └── route.ts            # Re-export from module
└── status/
    └── route.ts            # Re-export from module
```

### Re-export Pattern

```typescript
// src/app/api/v1/modules/nora/chat/route.ts
export { POST } from '@/modules/nora/api/chat/route'
```

## 🔐 Autentisering

### Public APIs (`/api/v1/public/`)
- Ingen autentisering kreves
- Eksempel: `/api/v1/public/modules` (liste over moduler)

### Module APIs (`/api/v1/modules/*`)
- Avhenger av modulens requirements
- Noen krever auth, andre ikke
- Eksempel: `/api/v1/modules/nora/chat` (kan være public)

### Admin APIs (`/api/v1/admin/*`)
- Krever alltid autentisering
- RBAC/ABAC autorisasjon
- Eksempel: `/api/v1/admin/users` (krever ADMIN role)

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "timestamp": "2025-01-16T12:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-16T12:00:00.000Z"
}
```

### Pagination

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  }
}
```

## 🛡️ Error Handling

Alle API-ruter skal:
1. Bruke `try/catch` for error handling
2. Returnere konsistente error responses
3. Logge errors med `logger.error()`
4. Bruke `withLogging()` wrapper for automatisk logging

### Eksempel

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { withLogging } from '@/lib/observability/withLogging'
import { logger } from '@/lib/logger'

export const GET = withLogging(async (req: NextRequest) => {
  try {
    // API logic
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    logger.error('API error', { path: req.nextUrl.pathname }, error as Error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
})
```

## 📈 Observability

### Logging
- Alle API requests logges automatisk med `withLogging()`
- Strukturert logging med `logger` fra `@/lib/logger`

### Metrics
- Response time tracking
- Error rate monitoring
- Cache hit rate (hvis relevant)

### Health Checks
- `/api/v1/core/health` - System health check
- `/api/v1/modules/[moduleId]/health` - Module-specific health

## ✅ Best Practices

1. **Bruk versjonering** - Alle nye APIs skal være under `/api/v1/`
2. **Re-eksporter routes** - Module APIs skal re-eksporteres i `src/app/api/v1/modules/`
3. **Konsistent responses** - Bruk samme response format overalt
4. **Error handling** - Alltid bruk `try/catch` og logger
5. **Autentisering** - Sjekk auth først i admin APIs
6. **Validering** - Bruk Zod for input validation
7. **Dokumentasjon** - Dokumenter alle API endpoints i modulens README

## 📚 Relatert Dokumentasjon

- [Module Standard](./MODULE_STANDARD.md)
- [System Architecture](./SYSTEM_ARCHITECTURE.md)
- [Observability Guide](../guides/OBSERVABILITY.md)



