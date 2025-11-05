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

# Hansen Global Solutions - Module Standard v1.0

**Version:** 1.0.0  
**Last Updated:** 2025-01-16  
**Author:** Cato Hansen

## 🎯 Formål

Gi enhetlig struktur for alle moduler (Nora, Pengeplan, Resilient13, Hansen Security, CRM 2.0, etc.) slik at de kan utvikles, testes og distribueres konsekvent.

## 📁 Standard Mappestruktur

Alle moduler skal følge denne strukturen:

```
src/modules/[modulnavn]/
├── core/                    # Core business logic
│   ├── [module]-engine.ts  # Main engine
│   ├── [module]-utils.ts   # Utilities
│   └── index.ts            # Exports
├── api/                     # API routes
│   ├── [endpoint]/
│   │   └── route.ts
│   └── index.ts            # Re-export all routes
├── components/              # React components
│   ├── [Component].tsx
│   └── index.ts
├── dashboard/               # Admin dashboard (optional)
│   └── [Dashboard].tsx
├── sdk/                     # External SDK (optional)
│   ├── index.ts
│   └── package.json
├── types/                   # TypeScript types
│   └── [module].types.ts
├── tests/                   # Unit & integration tests
│   ├── [module].test.ts
│   └── api.test.ts
├── MODULE_INFO.json         # Module metadata
├── README.md                # Module documentation
└── package.json             # NPM package config (if publishable)
```

## 📝 MODULE_INFO.json

Hver modul skal ha en `MODULE_INFO.json` fil:

```json
{
  "name": "nora",
  "version": "2.0.0",
  "displayName": "Nora AI Assistant",
  "description": "Revolutionary AI assistant for Hansen Global Solutions",
  "author": "Cato Hansen",
  "license": "PROPRIETARY",
  "category": "AI & Automation",
  "status": "Production Ready",
  "exports": {
    "api": "./api/index.ts",
    "components": "./components/index.ts",
    "core": "./core/index.ts",
    "sdk": "./sdk/index.ts"
  },
  "dependencies": {
    "required": ["hansen-security"],
    "optional": ["user-management"]
  }
}
```

## 🏗️ Navnestandard

### Moduler
- **Navn**: lowercase, kebab-case (`nora`, `hansen-security`, `pengeplan-2.0`)
- **Mappe**: `src/modules/[modulnavn]/`

### Komponenter
- **Filnavn**: PascalCase (`NoraChatBubble.tsx`, `SecurityPolicyEditor.tsx`)
- **Komponentnavn**: PascalCase (`NoraChatBubble`, `SecurityPolicyEditor`)

### API Routes
- **Mappe**: lowercase (`status/`, `chat/`, `memory/`)
- **Fil**: `route.ts`

### Core Functions
- **Filer**: lowercase, kebab-case (`memory-engine.ts`, `security-engine.ts`)
- **Functions**: camelCase (`getMemoryEngine`, `checkPermission`)

## 🔗 Imports

### Interne Imports (innen modul)
```typescript
// ✅ Bruk relative paths
import { MemoryEngine } from '../core/memory-engine'
import { getConfig } from '../../config'
```

### Eksterne Imports (fra andre moduler)
```typescript
// ✅ Bruk path aliases
import { policyEngine } from '@/modules/hansen-security/core/PolicyEngine'
import { logger } from '@/lib/logger'
```

### Globale Imports
```typescript
// ✅ Bruk @/ alias
import { prisma } from '@/lib/db/prisma'
import { Z_INDEX } from '@/lib/design-tokens'
```

## 📦 API Routes

### Struktur
Alle API-ruter skal ligge i `src/modules/[modulnavn]/api/` og re-eksporteres i `src/app/api/v1/modules/[modulnavn]/`.

### Eksempel
```typescript
// src/modules/nora/api/status/route.ts
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}

// src/app/api/v1/modules/nora/status/route.ts
export { GET } from '@/modules/nora/api/status/route'
```

## 🧪 Testing

### Minimum Requirements
- **Unit tests**: Core business logic
- **Integration tests**: API routes
- **Coverage**: Minimum 80% for core functions

### Test Structure
```
tests/
├── [module].test.ts         # Unit tests
├── api.test.ts              # API integration tests
└── __mocks__/               # Mock data
```

## 📚 Dokumentasjon

### README.md
Hver modul skal ha en `README.md` med:
- Oversikt og formål
- Installasjon og setup
- Bruk og eksempler
- API-dokumentasjon
- Konfigurasjon

### JSDoc
Alle public functions skal ha JSDoc-kommentarer:

```typescript
/**
 * Get memory engine instance
 * 
 * @returns MemoryEngine instance
 * @throws Error if engine fails to initialize
 */
export function getMemoryEngine(): MemoryEngine {
  // ...
}
```

## 🚀 Distribusjon (NPM)

### package.json
Hvis modulen skal publiseres som NPM-pakke:

```json
{
  "name": "@hansenglobal/nora",
  "version": "2.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./api": "./dist/api/index.js",
    "./sdk": "./dist/sdk/index.js"
  }
}
```

## ✅ Checklist for Ny Modul

- [ ] Opprett mappestruktur (`src/modules/[modulnavn]/`)
- [ ] Legg til `MODULE_INFO.json`
- [ ] Opprett `README.md`
- [ ] Implementer core logic i `core/`
- [ ] Opprett API routes i `api/`
- [ ] Opprett React components i `components/`
- [ ] Legg til TypeScript types i `types/`
- [ ] Skriv tester i `tests/`
- [ ] Re-eksporter API routes i `src/app/api/v1/modules/[modulnavn]/`
- [ ] Oppdater `src/lib/modules/ModuleRegistry.ts`
- [ ] Test build: `npm run build`
- [ ] Test imports: Verifiser at alle imports fungerer

## 📚 Relatert Dokumentasjon

- [System Architecture](./SYSTEM_ARCHITECTURE.md)
- [API Structure](./API_STRUCTURE.md)
- [Design Tokens](./DESIGN_TOKENS.md)



