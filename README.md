# BAS Logg

A local-first, fast and offline-friendly PWA for logging gymnastics training based on the Swedish Gymnastics Federation BAS programme.

## MVP scope
- One gymnast per device
- Local storage only
- Swedish UI
- Fast loading
- Training history and last-used level per exercise

## Recommended stack
- Vite
- TypeScript
- React or Svelte, but keep dependencies minimal
- IndexedDB for structured local storage
- PWA support for install and offline use
- GitHub Pages for hosting

## Working principles
- No backend
- No accounts
- No sync
- No analytics
- Clean and coach-friendly UI
- JSON-driven exercise content
- Easy to extend later

## Content model
- BAS exercises are stored in JSON
- Each exercise has name, category, levels, short description, coaching tips, video URL, and logging type
- Keep texts short and mobile-friendly
- Reference Svenska Gymnastikforbundet in the app
