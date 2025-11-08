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

# 🔧 Lokal Dev Server Fix - Komplett Guide

**Dato:** 2025-01-16  
**Problem:** Siden viser blankt i Chrome, "cannot see code" i DevTools

---

## 🎯 Rask Løsning

### Metode 1: npm script (Anbefales)

```bash
npm run fix:local
```

Dette gjør:
- ✅ Rens Cursor cache (fixer "cannot see code")
- ✅ Stopper alle Next.js prosesser
- ✅ Frigjør porter 3000-3005
- ✅ Rydder prosjekt cache
- ✅ Spør om reinstall node_modules (valgfritt)
- ✅ Henter env fra Vercel (valgfritt)
- ✅ Starter dev server på port 3001

### Metode 2: Quick fix (rask restart)

```bash
npm run fix:quick
```

Rask restart uten reinstall - bruk når du bare trenger å starte på nytt.

### Metode 3: One-click fra Desktop

Dobbeltklikk på: **`fix-catohansen-dev.command`** på skrivebordet

---

## 🔍 Hva gjør scriptet?

### `fix-local-complete.sh` (komplett fix)

1. **Cursor cache-rens** - Fixer "cannot see code" problemet
2. **Stopper prosesser** - Dreper alle hengende Next.js prosesser
3. **Frigjør porter** - Frigjør porter 3000-3005
4. **Rens cache** - Sletter .next, node_modules/.cache, .turbo
5. **Reinstall** (valgfritt) - Reinstallerer node_modules hvis nødvendig
6. **Vercel env** (valgfritt) - Henter environment variables fra Vercel
7. **Prisma** - Regenererer Prisma Client
8. **Build test** (valgfritt) - Tester build før start
9. **Start server** - Starter på port 3001

### `fix-dev-server.sh` (quick fix)

- Rask restart uten reinstall
- Bruk når du bare trenger å starte på nytt

---

## 🆘 Når bruke hva?

### Bruk `fix:local` når:
- ❌ Siden viser blankt i Chrome
- ❌ "Cannot see code" i DevTools
- ❌ Dev server starter ikke
- ❌ Port conflicts
- ❌ Cursor viser ikke kode

### Bruk `fix:quick` når:
- ✅ Server bare trenger restart
- ✅ Ingen cache-problemer
- ✅ Rask oppstart

---

## 🌐 Global Versjon (GitHub)

For å bruke fra hvilket som helst prosjekt:

### Steg 1: Opprett GitHub repo

1. Gå til [github.com/new](https://github.com/new)
2. Navn: `scripts`
3. Description: "Cato Hansen - Dev Utilities"
4. Public repo
5. Opprett repo

### Steg 2: Push scriptet

```bash
cd ~/Dev
mkdir scripts && cd scripts
git init
cp /Users/catohansen/Dev/catohansen-projeckt/catohansen-online/scripts/fix-local-global.sh .
chmod +x fix-local-global.sh
git add .
git commit -m "Add global fix-local script"
git branch -M main
git remote add origin https://github.com/catohansen/scripts.git
git push -u origin main
```

### Steg 3: Bruk globalt

```bash
curl -sSL https://raw.githubusercontent.com/catohansen/scripts/main/fix-local-global.sh | bash
```

### Steg 4: Lag alias (valgfritt)

```bash
echo 'alias fixlocal="curl -sSL https://raw.githubusercontent.com/catohansen/scripts/main/fix-local-global.sh | bash"' >> ~/.zshrc
source ~/.zshrc
```

Deretter kan du bare skrive:
```bash
fixlocal
```

---

## 📋 Troubleshooting

### Scriptet stopper midt i kjøring?

- Sjekk at du har skriverettigheter i prosjektmappen
- Sjekk at Node.js og npm er installert
- Prøv å kjøre manuelt: `chmod +x scripts/fix-local-complete.sh`

### Port 3001 er fortsatt opptatt?

```bash
lsof -ti :3001 | xargs kill -9
```

### Cursor cache kan ikke slettes?

- Lukk Cursor helt først (Cmd+Q)
- Prøv å slette manuelt:
```bash
rm -rf ~/Library/Application\ Support/Cursor/Cache
```

### node_modules reinstall feiler?

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## ✅ Checklist

Før du kjører scriptet:
- [ ] Cursor er lukket (Cmd+Q)
- [ ] Du er i prosjektmappen
- [ ] Node.js er installert (`node -v`)
- [ ] npm er installert (`npm -v`)

Etter scriptet:
- [ ] Server starter på port 3001
- [ ] Du ser "Ready - started server on http://localhost:3001"
- [ ] Chrome kan åpne http://localhost:3001
- [ ] DevTools viser kode (ikke blankt)

---

## 💡 Tips

- **Hold desktop-filen** (`fix-catohansen-dev.command`) på skrivebordet for rask tilgang
- **Bruk `fix:quick`** for daglig bruk, `fix:local` for når ting låser seg
- **Sett opp alias** hvis du jobber med flere prosjekter

---

**Spørsmål?** Sjekk scriptene i `scripts/` mappen eller kontakt support.

