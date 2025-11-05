# 📎 Assets & Media Files

Mappe for PDF-filer, dokumentasjon, bilder og andre ressursfiler.

## 📁 Struktur

```
assets/
├── pdfs/              # PDF-filer med kunnskap og dokumentasjon
├── code-files/        # Code-filer, scripts, eksempler
└── images/            # Bilder, diagrammer, skjermbilder
```

## 📄 PDF-filer

### Hva kan legges i `pdfs/`:

- **Dokumentasjon** - Tekniske dokumenter, specs
- **Guides** - Tutorials og guides
- **Designs** - Design dokumenter, wireframes
- **Requirements** - Prosjektkrav og spesifikasjoner
- **Reference** - Referansedokumenter

### Hvordan bruke PDF-er:

AI kan lese innholdet i PDF-filer og bruke informasjonen til å:
- Forstå krav og spesifikasjoner
- Følge designs og wireframes
- Implementere funksjoner basert på dokumentasjon
- Bruke eksempler fra dokumenter

**Eksempel:**
```
"Se på requirements.pdf i knowledge-base/assets/pdfs/ og implementer funksjonen der"
```

### Filtyper:
- ✅ PDF (`.pdf`)
- ✅ Markdown (`.md`)
- ✅ Text (`.txt`)

## 💻 Code Files

### Hva kan legges i `code-files/`:

- **Scripts** - Utility scripts, build scripts
- **Configs** - Konfigurasjonsfiler
- **Examples** - Kodeeksempler
- **Snippets** - Kodebiter

AI kan lese og bruke kode-filer direkte.

## 🖼️ Images

### Hva kan legges i `images/`:

- **Designs** - Designmockups, wireframes
- **Diagrams** - Arkitekturdiagrammer
- **Screenshots** - Skjermbilder for referanse
- **Icons** - Ikoner og assets

AI kan analysere bilder og:
- Forstå designspesifikasjoner
- Følge wireframes
- Implementere basert på mockups
- Lese tekst fra bilder (OCR)

## 📝 Eksempel Bruk

### Legg til PDF:
```bash
cp dokumentasjon.pdf knowledge-base/assets/pdfs/
```

### Spør AI:
"Les requirements.pdf i assets/pdfs/ og implementer funksjonen der beskrevet"

### Legg til kode:
```bash
cp awesome-function.ts knowledge-base/assets/code-files/
```

### Spør AI:
"Bruk funksjonen fra assets/code-files/awesome-function.ts"

## 🔍 AI-capabilities

AI kan:
- ✅ Les PDF-innhold (tekst)
- ✅ Analysere bilder og design
- ✅ Lese og kopiere kode-filer
- ✅ Forstå struktur fra diagrammer
- ✅ Implementere basert på dokumentasjon

## ⚠️ Viktig

- Ikke legg **sensitive data** her (passwords, API keys, etc.)
- Ikke commit store binærfiler hvis ikke nødvendig
- Bruk beskrivende filnavn

