import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
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
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
