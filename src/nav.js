// Mobile burger menu. On desktop the nav is always visible; the burger is hidden via CSS.
export function initNav() {
  const burger = document.querySelector('.burger')
  const nav = document.querySelector('.nav')
  if (!burger || !nav) return

  Array.from(nav.children).forEach((a, i) => a.style.setProperty('--i', i))

  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open))
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen')
    nav.classList.toggle('is-open', open)
    document.body.classList.toggle('menu-open', open)
  }

  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'))
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false)
  })
  window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false)
  })
}
