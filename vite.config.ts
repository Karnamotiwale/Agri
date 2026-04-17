import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000';

  return {
    plugins: [
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
        '/decide': apiUrl,
        '/feedback': apiUrl,
        '/recommendations': apiUrl,
        '/valves': apiUrl,
        '/crop/journey': apiUrl,
        '/crop/stages': apiUrl,
        '/crop/rotation': apiUrl,
        '/yield': apiUrl,
        '/ai/health-detect': apiUrl,
        '/ai/rl-performance': apiUrl,
        '/ai/rl-actions': apiUrl,
        '/ai/rl-rewards': apiUrl,
        '/ai/rl-insights': apiUrl,
        '/ai/detailed-advisory': apiUrl,
        '/ai/valves': apiUrl,
        '/sensors': apiUrl
      }
    },
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    }
  };
});
