// Fade/slide-in on scroll. Elements with .reveal get .is-in once they enter the viewport.
// Children of .stagger get --i for a cascading delay.
export function initReveal() {
  document.querySelectorAll('.stagger').forEach((group) => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i))
  })

  const els = document.querySelectorAll('.reveal')
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'))
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )
  els.forEach((el) => io.observe(el))
}
