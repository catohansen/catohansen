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

# System Architecture - Hansen Global Solutions

**Version:** 1.0.0  
**Last Updated:** 2025-01-16  
**Author:** Cato Hansen  
**System Architect:** Cato Hansen

## 🏗️ Oversikt

Hansen Global Solutions er en modulær, skalerbar plattform bygget med Next.js 14, TypeScript, og Prisma. Plattformen er designet som en multi-product system hvor hver modul kan selges separat eller brukes sammen.

## 🧩 Arkitekturprinsipper

### 1. Modularitet
- Hver modul er standalone og kan fungerer uavhengig
- Moduler kan selges separat som NPM-pakker
- Løs kobling mellom moduler

### 2. Skalerbarhet
- API-versjonering (`v1`) for fremtidig kompatibilitet
- Caching-strategier for ytelse
- Database sharding-ready struktur

### 3. Type-sikkerhet
- Full TypeScript coverage
- Zod for runtime validation
- Type-safe API responses

### 4. Observability
- Strukturert logging
- Health checks
- Metrics collection
- Error tracking

## 📁 Prosjektstruktur

```
catohansen-online/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   └── v1/         # API Version 1
│   │   ├── admin/          # Admin panel pages
│   │   ├── [module]/       # Module landing pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Shared React components
│   │   ├── shared/         # Shared components (Navigation, Footer)
│   │   └── modules/        # Module-specific components
│   ├── lib/                # Shared libraries
│   │   ├── design-tokens.ts # Design system tokens
│   │   ├── logger.ts       # Structured logging
│   │   ├── db/             # Database (Prisma)
│   │   └── observability/  # Observability tools
│   └── modules/            # Business modules
│       ├── nora/           # Nora AI module
│       ├── hansen-security/ # Security module
│       └── [module]/       # Other modules
├── apps/
│   └── nora/               # Legacy Nora location (to be migrated)
├── prisma/                 # Prisma schema & migrations
├── docs/                   # Documentation
│   ├── architecture/      # Architecture docs
│   ├── guides/             # User guides
│   └── reports/            # Status reports
└── tailwind.config.js      # Tailwind configuration
```

## 🔧 Teknologistack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Design Tokens
- **Animations**: Framer Motion
- **State**: React Hooks + Context

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache**: Upstash Redis (for rate limits, queues)
- **Auth**: NextAuth.js + Hansen Security (RBAC/ABAC)

### Infrastructure
- **Hosting**: Vercel
- **Database**: Neon/Supabase (PostgreSQL)
- **Cache**: Upstash Redis
- **CDN**: Vercel Edge Network

## 🧩 Modularkitektur

### Modulstruktur

Hver modul følger standard struktur:

```
src/modules/[modulnavn]/
├── core/        # Business logic
├── api/         # API routes
├── components/  # UI components
├── dashboard/   # Admin dashboard
├── sdk/         # External SDK
├── types/       # TypeScript types
└── MODULE_INFO.json
```

### Moduler

1. **Nora** - AI Assistant Module
2. **Hansen Security** - Authorization Engine
3. **User Management** - User Auth & Management
4. **Client Management** - CRM Module
5. **Project Management** - Project Tracking
6. **Billing System** - Payments & Invoicing
7. **Content Management** - CMS Module
8. **AI Agents** - Automation Module
9. **Analytics** - Analytics Module

## 🔐 Sikkerhet

### Autentisering
- NextAuth.js for session management
- 2FA support
- SMS verification

### Autorisation
- **Hansen Security** - Policy-based authorization (RBAC/ABAC)
- Resource-specific roles
- Permission inheritance
- Audit logging

### Data Protection
- Field-level encryption (sensitive data)
- Secure API keys management
- No hardcoded secrets

## 📊 Observability

### Logging
- Strukturert logging med `logger` fra `@/lib/logger`
- API request/response logging
- Error tracking

### Health Checks
- `/api/v1/core/health` - System health
- Module-specific health checks

### Metrics
- API response times
- Error rates
- Cache hit rates
- Security decision metrics

## 🚀 Deployment

### CI/CD
- GitHub Actions (planned)
- Automated testing
- Database migrations

### Environments
- **Development**: Local + Vercel Preview
- **Staging**: Vercel Preview (PR)
- **Production**: Vercel Production

## 📈 Skalerbarhet

### Performance
- Lazy loading av komponenter
- API route caching
- Image optimization (Next.js Image)
- Code splitting

### Database
- Prisma ORM for type-safe queries
- Connection pooling
- Query optimization
- Ready for sharding

### Caching
- API response caching
- ISR (Incremental Static Regeneration)
- Client-side caching

## 🔄 Migrasjonsplan

### Fase 6: Modulstandardisering
- [ ] Flytt `apps/nora/` til `src/modules/nora/`
- [ ] Oppdater alle imports
- [ ] Test build og runtime

### Fase 7: API Versjonering
- [x] Opprett `/api/v1/` struktur
- [x] Re-eksporter module APIs
- [ ] Migrer legacy APIs til v1

### Fase 8: Observability
- [x] Strukturert logging
- [x] Health check endpoint
- [ ] Metrics dashboard (planned)

### Fase 9: Dokumentasjon
- [x] Design Tokens dokumentasjon
- [x] Module Standard dokumentasjon
- [x] API Structure dokumentasjon
- [x] System Architecture dokumentasjon

## 📚 Relatert Dokumentasjon

- [Module Standard](./MODULE_STANDARD.md)
- [API Structure](./API_STRUCTURE.md)
- [Design Tokens](./DESIGN_TOKENS.md)
- [Quick Start Guide](../guides/QUICK_START.md)



