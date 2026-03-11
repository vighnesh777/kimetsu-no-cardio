import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves from /repo-name/ — set via VITE_REPO_NAME in the Actions workflow.
// Locally VITE_REPO_NAME is unset so base stays '/' and dev server works normally.
const base = process.env.VITE_REPO_NAME ? `/${process.env.VITE_REPO_NAME}/` : '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      base,
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'Kimetsu no Cardio',
        short_name: 'KnC',
        description: 'Train like a Demon Slayer — sync your fitness stats with your breathing style.',
        theme_color: '#FF4500',
        background_color: '#0D0500',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.googleapis\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-api-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 300 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.jikan\.moe\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jikan-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
    }),
  ],
});
