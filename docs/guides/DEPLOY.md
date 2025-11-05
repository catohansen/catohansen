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
# Deployment Guide

## GitHub Setup

1. Opprett en ny repository på GitHub (f.eks. `catohansen-website`)
2. Push koden til GitHub:
   ```bash
   git remote add origin https://github.com/ditt-brukernavn/catohansen-website.git
   git branch -M main
   git push -u origin main
   ```

## Deployment til Vercel (Anbefalt for Next.js)

1. Gå til [Vercel](https://vercel.com)
2. Logg inn med GitHub
3. Importer prosjektet fra GitHub
4. Vercel vil automatisk deploye ved hver push til main branch

## Deployment til Domeneshop Webhotell (Alternativ)

Siden Next.js krever en Node.js server, må du eksportere som statiske filer:

### Opprett statisk export:

1. Endre `next.config.js` og legg til:
   ```js
   output: 'export',
   ```

2. Bygg statisk versjon:
   ```bash
   npm run build
   ```

3. Upload via FTP:
   - Server: `ftp.domeneshop.no`
   - Brukernavn: `catohansen`
   - Passord: [ditt passord]
   - Mappe: `/www`
   - Upload hele `out/` mappen til `/www/`

### FTP Upload Alternativer:

**Via FileZilla eller lignende FTP-klient:**
- Connect til `ftp.domeneshop.no`
- Logg inn med `catohansen` og passordet ditt
- Naviger til `/www` mappen
- Upload alle filer fra `out/` mappen

**Via Terminal (SCP):**
```bash
scp -r out/* catohansen@scp.domeneshop.no:/www/
```

**Via Terminal (SFTP):**
```bash
sftp catohansen@sftp.domeneshop.no
cd /www
put -r out/*
```

## Merk

For beste ytelse anbefales Vercel siden det er optimalisert for Next.js. Domeneshop webhotell støtter tradisjonelle statiske filer, men vil ikke gi deg samme optimaliserte ytelse som Vercel.

