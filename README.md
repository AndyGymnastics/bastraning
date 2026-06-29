# BAS Logg

En snabb, lokal-först PWA för att logga BAS-träning baserat på Svenska Gymnastikförbundets BAS-program.

## Funktioner

- En gymnast per enhet
- Svenskt gränssnitt
- IndexedDB för lokal lagring
- Översikt, pass, historik och inställningar
- Passflöde med "Spara och nästa"
- PWA med offline-stöd
- GitHub Pages-deploy

## Kom igång

```bash
npm install
npm run dev
```

Bygg för produktion:

```bash
npm run build
npm run preview
```

## Deploy till GitHub Pages

1. Aktivera GitHub Pages med **GitHub Actions** som källa.
2. Pusha till `main` — workflow i `.github/workflows/deploy.yml` bygger och publicerar `dist/`.

Appen använder `base: './'` så den fungerar på projekt-URL:er (`username.github.io/repo/`).

## Struktur

```
src/
  data/bas-exercises.json   # BAS-övningar (JSON-källa)
  lib/storage/              # IndexedDB + migration
  lib/types/                # Datamodell
  components/               # UI-komponenter
  pages/                    # Skärmar
```

## Lägga till övningar

Redigera `src/data/bas-exercises.json` och lägg till objekt enligt befintlig struktur. Ingen kodändring krävs för nya övningar.

## Teknik

- Vite + React + TypeScript
- idb (lätt IndexedDB-wrapper)
- vite-plugin-pwa
