// Impressum / Datenschutz modal, addressable via #impressum and #datenschutz.
const PAGES = ['impressum', 'datenschutz']

export function initLegal() {
  const dialog = document.getElementById('legal')
  if (!dialog) return
  const tabs = dialog.querySelectorAll('[data-legal-tab]')
  const pages = dialog.querySelectorAll('[data-legal-page]')
  let lastFocus = null

  const show = (name) => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.legalTab === name)))
    pages.forEach((p) => {
      p.hidden = p.dataset.legalPage !== name
      if (!p.hidden) p.scrollTop = 0
    })
  }

  const open = (name) => {
    show(name)
    if (!dialog.open) {
      lastFocus = document.activeElement
      dialog.showModal()
    }
    dialog.querySelector('[data-legal-close]').focus()
  }

  const close = () => {
    if (dialog.open) dialog.close()
  }

  dialog.addEventListener('close', () => {
    if (PAGES.includes(location.hash.slice(1))) {
      history.replaceState(null, '', location.pathname + location.search)
    }
    lastFocus?.focus?.()
  })

  tabs.forEach((t) => t.addEventListener('click', () => {
    history.replaceState(null, '', `#${t.dataset.legalTab}`)
    show(t.dataset.legalTab)
  }))
  dialog.querySelector('[data-legal-close]').addEventListener('click', close)
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close() // backdrop click
  })

  const fromHash = () => {
    const name = location.hash.slice(1)
    if (PAGES.includes(name)) open(name)
    else close()
  }
  window.addEventListener('hashchange', fromHash)
  fromHash()
}
