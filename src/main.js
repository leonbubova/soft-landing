import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/instrument-serif/400.css'
import './style.css'

import { initReveal } from './reveal.js'
import { initQuiz } from './quiz.js'
import { initContact } from './contact.js'
import { initLegal } from './legal.js'
import { initNav } from './nav.js'

// Grain overlay for every gradient surface (kept out of the HTML to avoid repetition).
document.querySelectorAll('.noise').forEach((el) => {
  const layer = document.createElement('span')
  layer.className = 'noise-layer'
  layer.setAttribute('aria-hidden', 'true')
  el.prepend(layer)
})

initNav()
initReveal()
initQuiz(document.querySelector('[data-quiz]'))
initContact(document.querySelector('[data-contact-form]'))
initLegal()

// Dev-only: hero size switcher (S/M/L/XL) — sets --hs on <html>. Not shipped in the build.
if (import.meta.env.DEV) {
  const sizes = { S: 1, M: 1.12, L: 1.25, XL: 1.4, XXL: 1.6 }
  const box = document.createElement('div')
  box.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:999;display:flex;gap:4px;padding:6px;background:#1e1a2e;border-radius:999px;font:600 12px system-ui;color:#fff'
  const set = (k) => {
    document.documentElement.style.setProperty('--hs', sizes[k])
    localStorage.setItem('hs', k)
    box.querySelectorAll('button').forEach((b) => (b.style.background = b.textContent === k ? '#8f6fe8' : 'transparent'))
  }
  for (const k of Object.keys(sizes)) {
    const b = document.createElement('button')
    b.textContent = k
    b.style.cssText = 'border:0;color:#fff;padding:4px 10px;border-radius:999px;cursor:pointer;font:inherit'
    b.onclick = () => set(k)
    box.append(b)
  }
  document.body.append(box)
  set(localStorage.getItem('hs') || 'M')
}
