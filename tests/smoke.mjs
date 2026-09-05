// Smoke test: needs `npm run build` + `npm run preview` (port 4173) running, or set URL=…
// Requires a Playwright Chromium build (npx playwright install chromium) or CHROME_PATH.
import { chromium } from 'playwright-core'
import { mkdir, readdir } from 'node:fs/promises'
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
const exe = await findChrome()
const TARGET = process.env.URL || 'http://localhost:4173/soft-landing/'
const out = new URL('../test-results/', import.meta.url).pathname; await mkdir(out, { recursive: true })
const browser = await chromium.launch({ executablePath: exe })
const errors = []

async function run(name, vw, vh) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name} console: ${m.text()}`) })
  await page.goto(TARGET, { waitUntil: 'networkidle' })
  // trigger all reveals
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 120)) }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${out}${name}-full.png`, fullPage: true })

  // quiz: all yes
  await page.locator('#check').scrollIntoViewIfNeeded()
  for (let i = 0; i < 3; i++) {
    await page.click('[data-answer="yes"]')
    await page.waitForSelector('[data-answer="yes"], [data-reset]', { state: 'attached' })
    await page.waitForTimeout(1500)
  }
  const r1 = await page.locator('.quiz__result-title').textContent()
  await page.screenshot({ path: `${out}${name}-quiz-yes.png`, clip: await page.locator('#quiz').boundingBox() })
  await page.click('[data-reset]'); await page.waitForTimeout(900)
  // all no → bonus → no
  for (let i = 0; i < 3; i++) { await page.click('[data-answer="no"]'); await page.waitForTimeout(1500) }
  const bonus = await page.locator('.quiz__q').textContent()
  await page.click('[data-answer="bonusNo"]'); await page.waitForTimeout(900)
  const r0 = await page.locator('.quiz__result-title').textContent()
  await page.screenshot({ path: `${out}${name}-quiz-no.png`, clip: await page.locator('#quiz').boundingBox() })
  // 1 yes
  await page.click('[data-reset]'); await page.waitForTimeout(900)
  await page.click('[data-answer="yes"]'); await page.waitForTimeout(1500)
  await page.click('[data-answer="no"]'); await page.waitForTimeout(1500)
  await page.click('[data-answer="no"]'); await page.waitForTimeout(1500)
  const r1b = await page.locator('.quiz__result-title').textContent()

  // contact form: empty submit → error; filled → done
  await page.locator('#kontakt').scrollIntoViewIfNeeded()
  await page.click('[data-submit]'); await page.waitForTimeout(200)
  const err = await page.locator('[data-status]').textContent()
  await page.fill('input[name=firstname]', 'Test'); await page.fill('input[name=contact]', 'test@example.com')
  await page.check('input[name=consent]')
  await page.click('[data-submit]'); await page.waitForTimeout(1500)
  const done = await page.locator('.form__done h3').textContent().catch(() => null)
  await page.screenshot({ path: `${out}${name}-form.png`, clip: await page.locator('#kontakt').boundingBox() })

  // legal modal
  await page.evaluate(() => { location.hash = '#datenschutz' }); await page.waitForTimeout(500)
  const legalOpen = await page.evaluate(() => document.getElementById('legal').open && !document.querySelector('[data-legal-page=datenschutz]').hidden)
  await page.screenshot({ path: `${out}${name}-legal.png` })
  await page.keyboard.press('Escape'); await page.waitForTimeout(300)
  const hashAfter = await page.evaluate(() => location.hash)

  // mobile menu
  let menu = 'n/a'
  if (vw < 760) {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.click('.burger'); await page.waitForTimeout(400)
    menu = await page.evaluate(() => document.querySelector('.nav').classList.contains('is-open'))
    await page.screenshot({ path: `${out}${name}-menu.png` })
    await page.click('.nav a[href="#ablauf"]'); await page.waitForTimeout(300)
    menu += ' → closed:' + await page.evaluate(() => !document.querySelector('.nav').classList.contains('is-open'))
  }
  const hscroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  console.log(JSON.stringify({ name, r3: r1, r0, bonus: bonus.slice(0, 40), r1: r1b, err, done, legalOpen, hashAfter, menu, hscroll }, null, 1))
  await ctx.close()
}

await run('desktop', 1280, 800)
await run('mobile', 390, 844)
await browser.close()
console.log('ERRORS:', errors.length ? errors : 'none')
if (errors.length) process.exit(1)
