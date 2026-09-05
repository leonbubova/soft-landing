// Contact form.
//
// Minimal-tech design: the site is static (GitHub Pages), so the form POSTs to a form-backend
// service configured via VITE_CONTACT_ENDPOINT (Web3Forms, Formspree, Netlify Forms, own endpoint …).
// With no endpoint set, the form runs in PLACEHOLDER MODE: it validates, shows the sending state,
// then a success message. Nothing is sent anywhere. See README "Kontaktformular".

const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT || '').trim()
const ACCESS_KEY = (import.meta.env.VITE_CONTACT_KEY || '').trim()
const PLACEHOLDER_MODE = ENDPOINT === ''

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export function initContact(form) {
  if (!form) return
  const status = form.querySelector('[data-status]')
  const submit = form.querySelector('[data-submit]')
  const consent = form.querySelector('.consent')

  const setStatus = (msg, kind) => {
    status.textContent = msg
    status.className = 'form__status' + (kind ? ` is-${kind}` : '')
  }

  const validate = () => {
    let ok = true
    form.querySelectorAll('.field').forEach((f) => {
      const input = f.querySelector('input, textarea')
      const bad = input.required && !input.value.trim()
      f.classList.toggle('is-invalid', bad)
      if (bad) ok = false
    })
    const c = form.elements.consent
    consent.classList.toggle('is-invalid', !c.checked)
    if (!c.checked) ok = false
    return ok
  }

  form.addEventListener('input', (e) => {
    e.target.closest('.field')?.classList.remove('is-invalid')
    if (e.target.name === 'consent') consent.classList.remove('is-invalid')
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (submit.classList.contains('is-busy')) return
    if (form.elements.website.value) return // honeypot → silently drop
    if (!validate()) {
      setStatus('Bitte füllen Sie die markierten Felder aus.', 'err')
      form.querySelector('.is-invalid input, .is-invalid textarea')?.focus()
      return
    }

    submit.classList.add('is-busy')
    setStatus('Wird gesendet …')

    try {
      if (PLACEHOLDER_MODE) {
        await wait(900)
        console.info('[contact] placeholder mode – nothing sent. Payload:', Object.fromEntries(new FormData(form)))
      } else {
        await send(form)
      }
      showDone(form)
    } catch (err) {
      console.error('[contact]', err)
      setStatus('Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder schreiben Sie direkt an hallo@leabertoncello.de.', 'err')
    } finally {
      submit.classList.remove('is-busy')
    }
  })
}

async function send(form) {
  const fd = new FormData(form)
  fd.delete('website')
  fd.set('consent', 'ja')
  if (ACCESS_KEY) fd.set('access_key', ACCESS_KEY)
  fd.set('subject', 'Neue Anfrage über die Website')

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: fd,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json().catch(() => ({}))
  if (data && data.success === false) throw new Error(data.message || 'provider rejected')
}

function showDone(form) {
  form.classList.add('is-sent')
  form.querySelector('[data-status]').textContent = ''
  const done = document.createElement('div')
  done.className = 'form__done'
  done.innerHTML = `
    <h3>Danke, Ihre Nachricht ist angekommen.</h3>
    <p>Ich melde mich innerhalb von zwei Tagen bei Ihnen. Wenn es dringend ist: Telefonseelsorge 0800 111 0 111, rund um die Uhr.</p>
    ${PLACEHOLDER_MODE ? '<p style="font-size:12px;opacity:.5">(Platzhalter: Es wurde noch nichts verschickt.)</p>' : ''}`
  form.appendChild(done)
  form.reset()
}
