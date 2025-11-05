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

# Design Tokens - Hansen Global Solutions

**Version:** 1.0.0  
**Last Updated:** 2025-01-16  
**Author:** Cato Hansen

## 📋 Oversikt

Design tokens er sentrale designverdier som brukes på tvers av hele Hansen Global Solutions-plattformen. De gir konsistens, forutsigbarhet og enkel vedlikehold.

**Fil:** `src/lib/design-tokens.ts`

## 🎯 Formål

- **Konsistens**: Alle moduler bruker samme design-språk
- **Skalerbarhet**: Enkel å legge til nye moduler uten å bryte design
- **Vedlikehold**: Endre én fil for å oppdatere hele plattformen
- **Type-sikkerhet**: TypeScript-typer for alle tokens

## 📊 Z-Index Hierarki

Standardisert z-index hierarki for å unngå overlay-konflikter:

```typescript
export const Z_INDEX = {
  BACKGROUND: 0,             // Particles, backgrounds
  CONTENT: 10,               // Page sections
  NAVIGATION: 50,            // Navigation bar
  DROPDOWN: 100,             // Dropdowns, menus
  MODAL_BACKDROP: 200,       // Modal backdrops
  MODAL: 300,                // Modals, dialogs
  TOAST: 400,                // Toast notifications
  TOOLTIP: 500,              // Tooltips
  THEME_TOGGLE: 600,         // Theme toggle
  NORA_CHAT_BACKDROP: 700,   // Nora chat backdrop
  NORA_CHAT: 800,            // Nora chat (ALWAYS TOP)
}
```

### Bruk i Tailwind

```tsx
<div className="z-nora-chat">...</div>
<nav className="z-navigation">...</nav>
```

### Bruk i TypeScript

```tsx
import { Z_INDEX } from '@/lib/design-tokens'

<div style={{ zIndex: Z_INDEX.NORA_CHAT }}>...</div>
```

## 🎨 Farger

### Primary Colors (Brand)
- **500**: `#7A5FFF` - Main brand color
- **600**: `#6B46F0` - Hover states
- Gradient: `from-primary-500 to-accent-500`

### Accent Colors
- **500**: `#00FFC2` - Main accent (teal/mint)
- **600**: `#00E0B2` - Darker accent

### Nora Colors
- `purple`: `#7A5FFF`
- `teal`: `#00FFC2`
- `pink`: `#C6A0FF`
- `blue`: `#7DD3FC`

### Dark Mode
- `bg`: `#0E0E16`
- `surface`: `#171721`
- `border`: `#24243A`

## 📏 Spacing System

Bruk spacing-verdier for konsistent whitespace:

```typescript
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
}
```

## 🎭 Typography

### Font Families
- **Sans**: `Inter` (primary)
- **Mono**: `Fira Code` (code)

### Font Sizes
- `xs`: 12px
- `sm`: 14px
- `base`: 16px
- `lg`: 18px
- `xl`: 20px
- `2xl`: 24px
- `3xl`: 30px

## 🌉 Shadows

### Standard Shadows
- `sm`, `md`, `lg`, `xl`, `2xl`

### Nora-Specific
- `nora`: Glow effect for Nora chat
- `nora-chat`: Same as `nora`

## ✅ Best Practices

1. **Bruk alltid tokens** - Ikke hardkode verdier
2. **Bruk Tailwind-klasser** når mulig - `z-nora-chat` i stedet for `z-[800]`
3. **Importer tokens** i TypeScript når du trenger verdiene
4. **Oppdater tokens** i `src/lib/design-tokens.ts` - ikke i komponenter

## 📚 Relatert Dokumentasjon

- [Tailwind Config](../tailwind.config.js)
- [Module Standard](./MODULE_STANDARD.md)
- [System Architecture](./SYSTEM_ARCHITECTURE.md)



