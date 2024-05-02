import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        "name": "desafio-votacao-dbserver-frontend",
        "short_name": "desafio-votacao-dbserver-frontend",
        "start_url": "/",
        "theme_color":"#f0f0f0",
        "display": "standalone",
        "background_color": "#f0f0f0",
        "lang": "en",
        "scope": "/",
        "icons": [
          {
            "src": '/icons/144.png', // <== don't add slash, for testing
            "sizes": '144x144',
            "type": 'image/png',
            "purpose": "any"
          },
          {
            "src": '/icons/192.png', // <== don't add slash, for testing
            "sizes": '192x192',
            "type": 'image/png',
            "purpose": "any"
          },
          {
            "src": '/icons/512.png', // <== don't remove slash, for testing
            "sizes": '512x512',
            "type": 'image/png',
            "purpose": "any"
          },
          {
            "src": '/icons/512.png', // <== don't add slash, for testing
            "sizes": '512x512',
            "type": 'image/png',
            "purpose": 'any maskable',
          },
        ],
      }
    })
  ],
})
