import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages 配信用のベースパス。独自ドメイン等で配信する場合は '/' に変更する。
const BASE = '/adventure/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'fonts/*.woff2', 'audio/*.mp3'],
      manifest: {
        id: BASE,
        name: 'FUTURE FANTASY -未来の地図-',
        short_name: 'FUTURE FANTASY',
        description: '60年の軌跡、ここから新たな冒険へ。仙台を舞台にしたRPG風の旅のしおり。',
        lang: 'ja',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#060b1c',
        theme_color: '#060b1c',
        categories: ['travel', 'lifestyle'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,webmanifest,mp3,jpg}'],
        // BGM を丸ごと先読みするので、既定の上限を引き上げる
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: `${BASE}index.html`,
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
  ],
})
