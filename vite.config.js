import { defineConfig } from 'vite'

// GitHub Pages serves the site under /<repo>/ — override with VITE_BASE=/ for a custom domain.
export default defineConfig({
  base: process.env.VITE_BASE || '/soft-landing/',
  build: { target: 'es2020' },
})
