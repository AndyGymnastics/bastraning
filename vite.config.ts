import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages project sites are served from /repo-name/ — absolute base avoids broken relative asset URLs.
const base = process.env.VITE_BASE ?? './';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'BAS Logg',
        short_name: 'BAS Logg',
        description: 'Logga BAS-träning lokalt på enheten',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        lang: 'sv',
        start_url: base,
        icons: [
          {
            src: `${base}icon.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,json,woff2}'],
        navigateFallback: base.endsWith('/') ? `${base}index.html` : `${base}/index.html`,
      },
    }),
  ],
});
