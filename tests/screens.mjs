// Screenshot sweep across modern viewport sizes + layout sanity checks.
// Needs `npm run build` + `npm run preview` (port 4173) running, or set URL=…
// Output: test-results/screens/<name>.png and test-results/screens/index.html (contact sheet).
import { chromium } from 'playwright-core'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'

const TARGET = process.env.URL || 'http://localhost:4173/soft-landing/'
const out = new URL('../test-results/screens/', import.meta.url).pathname
await mkdir(out, { recursive: true })

// name, width, height, deviceScaleFactor, mobile
const SIZES = [
  ['desktop-2560', 2560, 1440, 1, false],
  ['desktop-1920', 1920, 1080, 1, false],
  ['laptop-1536', 1536, 864, 1, false],
  ['laptop-1440', 1440, 900, 1, false],
  ['laptop-1280', 1280, 800, 1, false],
  ['tablet-1024', 1024, 768, 2, true],
  ['tablet-820', 820, 1180, 2, true],
  ['phone-430', 430, 932, 3, true],
  ['phone-390', 390, 844, 3, true],
  ['phone-360', 360, 800, 3, true],
]

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

const browser = await chromium.launch({ executablePath: await findChrome() })
const rows = []
const problems = []

for (const [name, w, h, dpr, mobile] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(TARGET, { waitUntil: 'networkidle' })
  // reveal everything, then back to top
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.waitForTimeout(900)

  const m = await page.evaluate(() => {
    const de = document.documentElement
    const hero = document.querySelector('.hero').getBoundingClientRect()
    const h1 = document.querySelector('.hero h1').getBoundingClientRect()
    const cta = document.querySelector('.hero__cta .btn--ink').getBoundingClientRect()
    const content = document.querySelector('#leistungen .section__head').getBoundingClientRect()
    return {
      hscroll: de.scrollWidth > de.clientWidth,
      heroFills: hero.bottom >= innerHeight - 1,
      heroCtaAboveFold: cta.bottom <= innerHeight,
      h1Lines: Math.round(h1.height / parseFloat(getComputedStyle(document.querySelector('.hero h1')).lineHeight)),
      contentWidth: Math.round(content.width),
      pageHeight: de.scrollHeight,
    }
  })
  await page.screenshot({ path: `${out}${name}.png`, fullPage: true })
  await page.screenshot({ path: `${out}${name}-fold.png` })
  await ctx.close()

  const bad = []
  if (m.hscroll) bad.push('horizontal scroll')
  if (!m.heroFills) bad.push('hero shorter than viewport')
  if (!m.heroCtaAboveFold) bad.push('hero CTA below fold')
  if (w >= 1280 && m.h1Lines > 3) bad.push(`headline wraps to ${m.h1Lines} lines`)
  if (w >= 1440 && m.contentWidth > 1330) bad.push(`content ${m.contentWidth}px wider than max`)
  if (errors.length) bad.push(`js errors: ${errors.join(' | ')}`)
  if (bad.length) problems.push(`${name} (${w}×${h}): ${bad.join('; ')}`)
  rows.push({ name, w, h, ...m, bad })
  console.log(`${bad.length ? '✗' : '✓'} ${name.padEnd(13)} ${String(w).padStart(4)}×${h}  h1 ${m.h1Lines}L  content ${m.contentWidth}px  page ${m.pageHeight}px${bad.length ? '  ← ' + bad.join('; ') : ''}`)
}
await browser.close()

const html = `<!doctype html><meta charset="utf-8"><title>Screens</title>
<style>body{font:14px system-ui;margin:24px;background:#f4f4f4}h1{font-size:18px}.grid{display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start}
figure{margin:0;background:#fff;padding:10px;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.1)}figcaption{font-weight:600;margin-bottom:8px}
.bad figcaption{color:#b3261e}img{display:block;border:1px solid #ddd}details{margin-top:8px}details img{width:100%}</style>
<h1>Screens · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} · ${TARGET}</h1>
<div class="grid">${rows.map((r) => `<figure class="${r.bad.length ? 'bad' : ''}">
<figcaption>${r.name} · ${r.w}×${r.h}${r.bad.length ? ' · ' + r.bad.join('; ') : ''}</figcaption>
<img src="${r.name}-fold.png" width="${Math.min(r.w, 480)}" alt="">
<details><summary>full page</summary><img src="${r.name}.png" alt=""></details></figure>`).join('')}</div>`
await writeFile(`${out}index.html`, html)

console.log(`\ncontact sheet: ${out}index.html`)
if (problems.length) {
  console.log('\nPROBLEMS:\n' + problems.map((p) => ' - ' + p).join('\n'))
  process.exit(1)
}
