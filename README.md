# Cato Hansen - Premium Portfolio Website

Verdensklasse nettside med moderne design for AI-ekspert, systemarkitekt og entreprenør.

## 🚀 Funksjoner

- **Moderne Design**: Gradient-tekster, glassmorfisme og smooth animasjoner
- **Pris-kalkulator**: Interaktiv kalkulator for å estimere prosjektkostnader
- **3D-animasjoner**: Flytende elementer og partikkelbakgrunn
- **Responsiv**: Fungerer perfekt på alle enheter
- **Performance**: Optimalisert for rask lasting og smooth scrolling
- **SEO-vennlig**: Optimalisert for søkemotorer

## 🛠️ Teknologier

- **Next.js 14**: React-framework med App Router
- **Framer Motion**: Smooth animasjoner og transitions
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-sikkerhet
- **Lucide Icons**: Moderne ikoner

## 📦 Installasjon

```bash
# Installer avhengigheter
npm install

# Start utviklingsserver
npm run dev

# Bygg for produksjon
npm run build

# Start produksjonsserver
npm start
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

## 🚢 Deployment

### GitHub Setup

```bash
# Initialiser git (hvis ikke allerede gjort)
git init

# Legg til remote repository
git remote add origin https://github.com/ditt-brukernavn/catohansen-website.git

# Push til GitHub
git branch -M main
git push -u origin main
```

### Vercel (Anbefalt)

1. Gå til [Vercel](https://vercel.com)
2. Logg inn med GitHub
3. Importer prosjektet fra GitHub
4. Vercel vil automatisk deploye ved hver push

### Domeneshop Webhotell

Se `docs/guides/DEPLOY.md` for detaljerte instruksjoner om hvordan du eksporterer og laster opp til Domeneshop.

## 📁 Prosjektstruktur

```
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx         # Hovedsiden
│   │   └── globals.css      # Globale stiler
│   └── components/
│       ├── Hero3D.tsx       # Hero-seksjon
│       ├── Navigation.tsx   # Navigasjonsbar
│       ├── ExpertiseSection.tsx
│       ├── PortfolioSection.tsx
│       ├── PricingCalculator.tsx
│       ├── StatsSection.tsx
│       ├── TestimonialsSection.tsx
│       ├── ContactSection.tsx
│       ├── Footer.tsx
│       ├── ParticlesBackground.tsx
│       └── FloatingElements.tsx
├── public/                  # Statiske filer
├── scripts/                 # Deployment scripts
├── package.json
└── tailwind.config.js
```

## 🎨 Tilpasning

- Endre farger i `tailwind.config.js`
- Oppdater innhold i komponentene
- Legg til egne prosjekter i `PortfolioSection.tsx`
- Tilpass kontaktinformasjon i `ContactSection.tsx`
- Endre priser i `PricingCalculator.tsx`

## 📝 Lisens

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

© 2025 Cato Hansen. All rights reserved. PROPRIETARY License.
