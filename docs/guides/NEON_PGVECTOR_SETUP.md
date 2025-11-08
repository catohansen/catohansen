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

# 🔧 Enable pgvector i Neon - Rask Guide

**Dato:** 2025-01-16

---

## ⚡ RASK METODE (2 minutter)

### Steg 1: Åpne Neon SQL Editor

1. Gå til [neon.tech](https://neon.tech) og logg inn
2. Klikk på prosjektet `catohansen-prod`
3. Klikk **"SQL Editor"** i venstre meny
4. Klikk **"New query"**

### Steg 2: Enable pgvector

Lim inn denne SQL-koden:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Steg 3: Kjør SQL

1. Klikk **"Run"** (eller trykk `Cmd+Enter` / `Ctrl+Enter`)
2. Du skal se: **"Success"** eller **"Query executed successfully"**

### Steg 4: Verifiser

Kjør denne SQL for å bekrefte:

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

Du skal se en rad med `extname = 'vector'`.

---

## ✅ FERDIG!

Når pgvector er enabled, er databasen klar for:
- AI embeddings (Nora-modulen)
- Vektorsøk
- Semantic search

---

## 🆘 Hvis det feiler

**"Extension vector does not exist":**
- Sjekk at du er i riktig prosjekt i Neon
- Prøv å kjøre SQL på nytt
- Kontakt Neon support hvis problemet vedvarer

**"Permission denied":**
- Sjekk at du er logget inn med riktig konto
- Sjekk at prosjektet tilhører din konto

---

**Neste steg:** Fortsett til Vercel deployment!

