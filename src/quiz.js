// Three-question self check. Every answer nudges gently towards booking;
// only "no" to everything leads to the playful extra question.

const QUESTIONS = [
  {
    q: 'Fühlen Sie sich im Alltag öfter überfordert, ohne genau zu wissen, wo Sie anfangen sollen?',
    yes: 'Das kennen viele. Genau da fangen wir an.',
    no: 'Schön. Dann ist der Kopf frei für den Rest.',
  },
  {
    q: 'Wünschen Sie sich jemanden, der regelmäßig mit Ihnen sortiert, plant und dranbleibt?',
    yes: 'Dranbleiben ist mein Lieblingsteil.',
    no: 'Selbstständig unterwegs. Gefällt mir.',
  },
  {
    q: 'Belasten Sie Themen wie Arbeit, Wohnen, Beziehungen oder Behördengänge stärker, als Sie möchten?',
    yes: 'Dann lohnt es sich, das gemeinsam anzuschauen.',
    no: 'Gut so. Das behalten wir bei.',
  },
]

const RESULTS = {
  3: {
    title: 'Beratung könnte Sie gut entlasten.',
    text: 'Genau bei solchen Themen setzt psychosoziale Beratung an: gemeinsam sortieren, kleine Schritte planen, dranbleiben. Das Erstgespräch ist kostenlos und unverbindlich.',
    cta: 'Erstgespräch vereinbaren',
  },
  2: {
    title: 'Das klingt nach einem guten Anlass für ein Erstgespräch.',
    text: 'Zwei von drei Punkten kennen Sie. Genau da hilft es, gemeinsam zu sortieren und kleine Schritte zu planen, die in Ihren Alltag passen. Das Erstgespräch ist kostenlos.',
    cta: 'Erstgespräch vereinbaren',
  },
  1: {
    title: 'Ein Erstgespräch lohnt sich.',
    text: 'Manchmal hilft schon ein Gespräch, um zu klären, was gerade dran ist. Wir schauen gemeinsam, ob und wie ich Sie unterstützen kann. Ohne Verpflichtung.',
    cta: 'Erstgespräch vereinbaren',
  },
  bonusYes: {
    title: 'Gern. Reden wir.',
    text: 'Manchmal zeigt sich erst im Gespräch, wo ein bisschen Rückenwind gut tut. 30 Minuten, kostenlos, ohne Anmeldung im Hintergrund.',
    cta: 'Erstgespräch vereinbaren',
  },
  bonusNo: {
    title: 'Respekt.',
    text: 'Offenbar brauchen Sie gerade keine Hilfe. Aber vielleicht Gesellschaft? Kaffee gibt es bei mir auch ohne Beratung. Und falls sich das mal ändert: Sie wissen jetzt, wo ich bin.',
    cta: 'Trotzdem hallo sagen',
  },
}

const BONUS = {
  q: 'Klingt, als hätten Sie vieles gut im Griff. Trotzdem kurz reden, um herauszufinden, wobei ich Sie unterstützen könnte?',
  yesLabel: 'Ja, warum nicht',
  noLabel: 'Nein, ich schaffe das allein',
}

const COLORS = ['#8f6fe8', '#f7df6e', '#c9b6f2', '#1e1a2e', '#f3e29a']
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initQuiz(root) {
  if (!root) return
  const view = root.querySelector('[data-quiz-view]')
  const dots = Array.from(root.querySelectorAll('.quiz__dot'))

  let state = { step: 0, yes: 0, phase: 'question' } // phase: question | bonus | result
  let result = null
  let busy = false

  const render = () => {
    dots.forEach((d, i) => {
      const done = state.phase !== 'question' || i < state.step
      d.classList.toggle('is-done', done)
      d.classList.toggle('is-current', state.phase === 'question' && i === state.step)
    })

    if (state.phase === 'question') {
      const item = QUESTIONS[state.step]
      view.innerHTML = `
        <div class="quiz__counter">Frage ${state.step + 1} von ${QUESTIONS.length}</div>
        <div class="quiz__q">${item.q}</div>
        <div class="quiz__actions">
          <button type="button" class="btn btn--ink" data-answer="yes">Ja, das kenne ich</button>
          <button type="button" class="btn btn--white" data-answer="no">Eher nicht</button>
        </div>`
    } else if (state.phase === 'bonus') {
      view.innerHTML = `
        <div class="quiz__counter">Noch eine Frage</div>
        <div class="quiz__q">${BONUS.q}</div>
        <div class="quiz__actions">
          <button type="button" class="btn btn--ink" data-answer="bonusYes">${BONUS.yesLabel}</button>
          <button type="button" class="btn btn--white" data-answer="bonusNo">${BONUS.noLabel}</button>
        </div>`
    } else {
      view.innerHTML = `
        <div class="quiz__result-title">${result.title}</div>
        <div class="quiz__result-text">${result.text}</div>
        <div class="quiz__result-actions">
          <a class="btn btn--ink" href="#kontakt">${result.cta}</a>
          <button type="button" class="btn btn--white" data-reset>Noch einmal</button>
        </div>`
    }
  }

  const swap = (apply) => {
    if (reduceMotion()) { apply(); render(); return Promise.resolve() }
    return new Promise((resolve) => {
      view.classList.add('is-leaving')
      view.addEventListener('animationend', function onLeave() {
        view.removeEventListener('animationend', onLeave)
        view.classList.remove('is-leaving')
        apply()
        render()
        view.classList.add('is-entering')
        view.addEventListener('animationend', function onEnter() {
          view.removeEventListener('animationend', onEnter)
          view.classList.remove('is-entering')
          resolve()
        }, { once: true })
      }, { once: true })
    })
  }

  const showQuip = (text) => {
    const actions = view.querySelector('.quiz__actions')
    if (!actions) return
    const quip = document.createElement('div')
    quip.className = 'quiz__quip'
    quip.textContent = text
    actions.replaceWith(quip)
  }

  const celebrate = () => {
    if (reduceMotion()) return
    root.classList.remove('is-celebrating')
    void root.offsetWidth
    root.classList.add('is-celebrating')
  }

  const answer = async (btn, kind) => {
    if (busy) return
    busy = true
    burst(btn)
    view.querySelectorAll('button').forEach((b) => (b.disabled = true))

    if (state.phase === 'question') {
      const item = QUESTIONS[state.step]
      const yes = kind === 'yes'
      showQuip(yes ? item.yes : item.no)
      const nextStep = state.step + 1
      const nextYes = state.yes + (yes ? 1 : 0)
      // fill the dot right away so the answer feels acknowledged
      dots[state.step].classList.add('is-done')
      dots[state.step].classList.remove('is-current')
      await wait(reduceMotion() ? 250 : 800)
      await swap(() => {
        state.yes = nextYes
        state.step = nextStep
        if (nextStep >= QUESTIONS.length) {
          if (nextYes === 0) {
            state.phase = 'bonus'
          } else {
            state.phase = 'result'
            result = RESULTS[nextYes]
          }
        }
      })
      if (state.phase === 'result') celebrate()
    } else if (state.phase === 'bonus') {
      await swap(() => {
        state.phase = 'result'
        result = kind === 'bonusYes' ? RESULTS.bonusYes : RESULTS.bonusNo
      })
      celebrate()
    }
    busy = false
  }

  root.addEventListener('click', (e) => {
    const a = e.target.closest('[data-answer]')
    if (a) return answer(a, a.dataset.answer)
    if (e.target.closest('[data-reset]')) {
      if (busy) return
      busy = true
      swap(() => { state = { step: 0, yes: 0, phase: 'question' }; result = null }).then(() => (busy = false))
    }
  })

  render()
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// Little particle burst from the clicked button.
function burst(btn) {
  if (reduceMotion()) return
  const r = btn.getBoundingClientRect()
  const host = document.createElement('div')
  host.className = 'burst'
  host.style.transform = `translate(${r.left + r.width / 2}px, ${r.top + r.height / 2}px)`
  const n = 14
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i')
    const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.6
    const dist = 60 + Math.random() * 70
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
    p.style.setProperty('--dy', `${Math.sin(angle) * dist - 20}px`)
    p.style.setProperty('--c', COLORS[i % COLORS.length])
    p.style.animationDelay = `${Math.random() * 60}ms`
    host.appendChild(p)
  }
  document.body.appendChild(host)
  setTimeout(() => host.remove(), 900)
}
