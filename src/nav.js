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

  // Scroll-spy: mark the nav link whose section is currently in view.
  const links = Array.from(nav.querySelectorAll('a[href^="#"]'))
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean)
  if (!sections.length || !('IntersectionObserver' in window)) return
  const visible = new Map()
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0))
      const [top] = [...visible.entries()].sort((a, b) => b[1] - a[1])
      const current = top && top[1] > 0 ? top[0] : null
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`))
    },
    { rootMargin: '-35% 0px -45% 0px', threshold: [0, .1, .25, .5, .75, 1] },
  )
  sections.forEach((s) => spy.observe(s))
}
