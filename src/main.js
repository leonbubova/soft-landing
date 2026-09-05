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

