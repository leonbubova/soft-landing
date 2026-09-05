import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'

// GitHub Pages serves the site under /<repo>/ — override with VITE_BASE=/ for a custom domain.
const base = process.env.VITE_BASE || '/soft-landing/'

// Social preview caches (WhatsApp, LinkedIn, Slack …) key on the image URL. Append the commit
// hash so every deploy is a new URL and old previews are not served for weeks.
function ogCacheBust() {
  let v
  try { v = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { v = String(Date.now()) }
  return {
    name: 'og-cache-bust',
    transformIndexHtml(html) { return html.replaceAll('/og.jpg"', `/og.jpg?v=${v}"`) },
  }
}

export default defineConfig({
  base,
  build: { target: 'es2020' },
  plugins: [ogCacheBust()],
})
