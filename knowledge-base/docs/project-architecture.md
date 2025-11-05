# 🏗️ Project Architecture

## Teknologi-stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Struktur

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx            # Hovedsiden
│   └── globals.css         # Global styling
├── components/             # React komponenter
│   ├── Hero3D.tsx         # Hero-seksjon
│   ├── Navigation.tsx     # Navigasjon
│   ├── PricingCalculator.tsx
│   └── ...
└── ...

knowledge-base/            # Kunnskapsbase
├── components/            # Gjenbrukbare komponenter
├── patterns/              # Kodemønstre
└── ...
```

## Design Principles

1. **Performance First** - Lazy loading, code splitting, optimizations
2. **Mobile First** - Responsivt design
3. **Accessibility** - WCAG compliance
4. **Type Safety** - Full TypeScript coverage
5. **Reusability** - Komponenter i knowledge-base

## Deployment

- **Primary**: GitHub Actions → Domeneshop FTP
- **Alternative**: Vercel (anbefalt for Next.js)
- **Build**: Statisk export til `out/` mappen

## Future Improvements

- [ ] Legg til analytics
- [ ] Implementer blog/seksjon
- [ ] Legg til kontakt-skjema backend
- [ ] Optimaliser bilder videre

