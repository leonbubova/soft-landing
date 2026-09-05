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

// The stylesheet is ~25 KB; inlining it removes the render-blocking request (first paint waits only for HTML).
function inlineCss() {
  return {
    name: 'inline-css',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        if (!bundle) return html
        for (const [name, asset] of Object.entries(bundle)) {
          if (asset.type !== 'asset' || !name.endsWith('.css')) continue
          const re = new RegExp(`<link[^>]+href="[^"]*${asset.fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`)
          if (!re.test(html)) continue
          html = html.replace(re, `<style>${asset.source}</style>`)
          delete bundle[name]
        }
        return html
      },
    },
  }
}

export default defineConfig({
  base,
  build: { target: 'es2020' },
  plugins: [ogCacheBust(), inlineCss()],
})
