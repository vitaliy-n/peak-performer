import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
// Автовизначення base для GitHub Pages:
// - локально та в інших середовищах: '/'
// - на GitHub Actions (GITHUB_REPOSITORY=owner/repo):
//   * якщо repo закінчується на '.github.io' -> base = '/'
//   * інакше base = '/repo/'
const githubRepo = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
const isGithubPagesEnv = !!process.env.GITHUB_REPOSITORY

const base = isGithubPagesEnv
  ? githubRepo && githubRepo.endsWith('.github.io')
    ? '/'
    : `/${githubRepo}/`
  : '/'

export default defineConfig({
  base,
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Peak Performer',
        short_name: 'PeakPerformer',
        description: 'Ваша особиста система ефективності та успіху',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
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
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
