import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'AgriAI',
        short_name: 'AgriAI',
        description: 'Smart Farming & AI Automation',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      }
    }),
  ],
  server: {
    proxy: {
      '/decide': 'http://localhost:5000',
      '/feedback': 'http://localhost:5000',
      '/recommendations': 'http://localhost:5000',
      '/valves': 'http://localhost:5000',
      '/crop': 'http://localhost:5000',
      '/yield': 'http://localhost:5000',
      '/ai/health-detect': 'http://localhost:5000',
      '/ai/rl-performance': 'http://localhost:5000',
      '/ai/rl-actions': 'http://localhost:5000',
      '/ai/rl-rewards': 'http://localhost:5000',
      '/ai/rl-insights': 'http://localhost:5000',
      '/ai/detailed-advisory': 'http://localhost:5000',
      '/ai/valves': 'http://localhost:5000',
      '/sensors': 'http://localhost:5000',
    }
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
