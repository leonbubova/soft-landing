// Renders the social preview card (Open Graph image) to public/og.jpg.
// Uses the site's own gradient, grain and self-hosted fonts. Re-run after changing hero copy: `npm run og`.
import { chromium } from 'playwright-core'
import { readdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'

async function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const own = chromium.executablePath()
  if (existsSync(own)) return own
  const cache = `${homedir()}/Library/Caches/ms-playwright`
  const dirs = existsSync(cache) ? (await readdir(cache)).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse() : []
  for (const d of dirs) {
    const c = `${cache}/${d}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`
    if (existsSync(c)) return c
  }
  const gc = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (existsSync(gc)) return gc
  throw new Error('No Chrome found. Run `npx playwright install chromium` or set CHROME_PATH.')
}

const root = new URL('../', import.meta.url).href
const font = (p) => `${root}node_modules/@fontsource/${p}`
const out = new URL('../public/og.jpg', import.meta.url).pathname

const html = `<!doctype html><meta charset="utf-8">
<style>
@font-face { font-family: 'Instrument Serif'; src: url('${font('instrument-serif/files/instrument-serif-latin-400-normal.woff2')}') format('woff2'); }
@font-face { font-family: 'Plus Jakarta Sans'; font-weight: 600; src: url('${font('plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff2')}') format('woff2'); }
@font-face { font-family: 'Plus Jakarta Sans'; font-weight: 700; src: url('${font('plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2')}') format('woff2'); }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1e1a2e; background: #fbfaf8; -webkit-font-smoothing: antialiased; }
.card { position: relative; width: 1200px; height: 630px; padding: 64px 72px; display: flex; flex-direction: column; justify-content: space-between; isolation: isolate; }
.card::before { content: ''; position: absolute; inset: 0; z-index: -2;
  background: linear-gradient(160deg, #e6dbf3, #c9b6f2 45%, #a98ce9 70%, #f3e29a); }
.card::after { content: ''; position: absolute; inset: 0; z-index: -1;
  background:
    radial-gradient(ellipse 45% 40% at 78% 80%, #8f6fe8 0%, rgba(143,111,232,0) 70%),
    radial-gradient(ellipse 40% 36% at 12% 12%, #f7df6e 0%, rgba(247,223,110,0) 70%),
    radial-gradient(ellipse 36% 40% at 92% 6%, #f7df6e 0%, rgba(247,223,110,0) 70%); }
.grain { position: absolute; inset: 0; z-index: 0; opacity: .28; mix-blend-mode: multiply; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.top, .bottom { position: relative; z-index: 1; }
.top { display: flex; justify-content: space-between; align-items: flex-start; }
.name { font-family: 'Instrument Serif', serif; font-size: 44px; line-height: 1; }
.sub { margin-top: 8px; font-size: 15px; letter-spacing: .16em; text-transform: uppercase; font-weight: 600; opacity: .6; }
.pill { display: inline-flex; align-items: center; gap: 10px; padding: 12px 20px; border-radius: 999px; background: rgba(255,255,255,.55); font-weight: 600; font-size: 17px; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: #f7df6e; box-shadow: 0 0 0 4px rgba(247,223,110,.35); }
h1 { font-size: 78px; font-weight: 700; line-height: 1.02; letter-spacing: -.035em; max-width: 900px; }
.lead { margin-top: 26px; font-size: 25px; line-height: 1.45; max-width: 760px; opacity: .8; font-weight: 600; }
</style>
<div class="card">
  <span class="grain"></span>
  <div class="top">
    <div><div class="name">lea bertoncello</div><div class="sub">Psychosoziale Beraterin · Köln</div></div>
    <span class="pill"><span class="dot"></span>Vor Ort in Köln · Per Video</span>
  </div>
  <div class="bottom">
    <h1>Manchmal hilft es, nicht alles allein zu machen.</h1>
    <p class="lead">Einzelberatung bei Belastungen in Alltag, Beziehungen, Arbeit oder mit Behörden.</p>
  </div>
</div>`

const browser = await chromium.launch({ executablePath: await findChrome() })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
// file:// page so the file:// font URLs are same-origin (setContent from about:blank blocks them)
const tmp = `${tmpdir()}/og-${process.pid}.html`
await writeFile(tmp, html)
await page.goto(`file://${tmp}`, { waitUntil: 'load' })
await page.evaluate(async () => { await Promise.all([...document.fonts].map((f) => f.load())); await document.fonts.ready })
const loaded = await page.evaluate(() => [...document.fonts].map((f) => `${f.family}/${f.weight}:${f.status}`))
console.log(loaded.join(' '))
await page.screenshot({ path: out, type: 'jpeg', quality: 88 })
await browser.close()
await rm(tmp)
console.log(`wrote ${out}`)
