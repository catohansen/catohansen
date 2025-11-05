# 📂 Reference Projects & AI Functions

Dette er en mappe hvor du kan legge **andre prosjekter** og **ferdige AI-funksjoner** som AI kan lese, kopiere fra og bruke til dette prosjektet.

## 🎯 Hva kan du legge her?

### Prosjekter
- Andre Next.js/React prosjekter (kopier mapper eller filer)
- Ferdige komponenter fra andre prosjekter
- API-integrasjoner fra andre prosjekter
- Konfigurasjonsfiler fra andre prosjekter

### AI-funksjoner
- Ferdiglagde funksjoner og komponenter
- API-endpoints
- Utility functions
- Hooks og helpers

### Code Files
- `.ts`, `.tsx`, `.js`, `.jsx` filer
- Konfigurasjonsfiler
- Type definitions
- Test-filer

## 📝 Hvordan legge til

### Legg til et helt prosjekt:
```bash
# Kopier prosjektmappen hit:
cp -r /sti/til/annet-prosjekt knowledge-base/reference-projects/navn-på-prosjekt/
```

### Legg til enkeltfiler:
```bash
# Kopier filer direkte hit:
cp /sti/til/komponent.tsx knowledge-base/reference-projects/
```

### Legg til via filsystemet:
1. Åpne Finder/Filutforsker
2. Naviger til `knowledge-base/reference-projects/`
3. Dra og slipp filer/mapper hit

## 🔍 Hvordan AI bruker dette

Når du spør AI om å implementere noe, kan den:

1. **Søke gjennom referanse-prosjekter** for lignende løsninger
2. **Kopiere og tilpasse kode** fra andre prosjekter
3. **Inspirere seg fra** mønstre i andre prosjekter
4. **Bruke ferdige funksjoner** direkte eller tilpasse dem

### Eksempler på spørsmål:

- "Bruk login-funksjonen fra reference-projects/login-system/"
- "Implementer checkout som i reference-projects/ecommerce/"
- "Kopier API-strukturen fra reference-projects/api-setup/"
- "Bruk komponenten fra reference-projects/ui-library/"

## 📋 Best Practice

### Organisering:
```
reference-projects/
├── project-1-name/        # Hel prosjektmappe
│   ├── src/
│   ├── components/
│   └── ...
├── component-example.tsx  # Enkelt komponent
├── api-example.ts        # API eksempel
└── utility-example.ts    # Utility funksjon
```

### Naming:
- Bruk beskrivende navn
- Legg til README.md i prosjektmapper hvis nødvendig
- Kommenter hva hver fil/funksjon gjør

## ✅ Støttede Filtyper

AI kan lese:
- ✅ TypeScript/JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`)
- ✅ CSS/SCSS (`.css`, `.scss`)
- ✅ JSON (`.json`)
- ✅ Markdown (`.md`)
- ✅ Config-filer (`.config.js`, `.json`)
- ✅ Type definitions (`.d.ts`)
- ✅ Test-filer (`.test.ts`, `.spec.ts`)

## 🚫 Ikke legg hit

- Node_modules
- .next eller build-mapper
- Store media-filer (bruk assets/ i stedet)
- Sensitive data eller secrets

## 📖 Eksempel

Hvis du har et prosjekt med en fantastisk login-funksjon:

```bash
# Kopier relevante filer
cp -r /sti/til/login-prosjekt/src/auth knowledge-base/reference-projects/auth-system/

# Når du trenger det, si til AI:
"Bruk auth-systemet fra reference-projects/auth-system/"
```

AI vil da:
1. Les filene i `reference-projects/auth-system/`
2. Forstå hvordan det fungerer
3. Tilpasse det til ditt nåværende prosjekt
4. Implementere det i riktig kontekst

