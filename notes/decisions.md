# Decisions

## 2026-09-05 · Initial build
- **Vite, vanilla JS.** No framework; the page has one quiz, one form, one modal. Vite only for bundling fonts/CSS and for the GitHub Pages base path.
- **Fonts self-hosted** (`@fontsource`). Google Fonts from Google servers would need consent (LG München 2022). Removes the need for a cookie banner entirely.
- **Contact form = endpoint-agnostic POST.** Static hosting can't send mail. `VITE_CONTACT_ENDPOINT` empty → placeholder mode. Consent checkbox is required because inquiries can contain health data (Art. 9 DSGVO → explicit consent, not just legitimate interest).
- **Legal texts as a modal** with hash routes (`#impressum`, `#datenschutz`) so they are linkable and reachable in one click from every state. Impressum cites § 5 DDG (TMG was replaced May 2024) and § 18 MStV. No EU-ODR link (platform shut down July 2025).
- **Photo placeholder** instead of the Unsplash image; label changed from yellow to ink/white so it doesn't fight with the gradient.
- **Quiz logic:** yes-count 1–3 → booking nudge with different warmth. 0 yes → bonus question; "yes" → soft nudge, "no" → playful "Respekt … vielleicht Gesellschaft?" with a "Trotzdem hallo sagen" CTA.
- **Animations:** IntersectionObserver reveal (once, staggered), drifting linear gradient + floating radial blobs on all gradient surfaces, particle burst + quip + slide transition on quiz answers. All disabled under `prefers-reduced-motion`.

## 2026-09-05 · Compact scale + edge layout
- **Hero and footer hug the viewport** (`--edge`, 32px) instead of the 1320px content cap; on wide screens the old cap left the hero brand 300px in while the panel sat 20px from the edge.
- **Footer left gap was a bug:** `.footer > *` overrode `.noise-layer`'s absolute positioning, making the grain overlay a flex item. Fixed with `:not(.noise-layer)`.
- **Compact scale block** (before the responsive rules): content cap 1120px, smaller sections/cards/quiz/form. Hero copy is the exception and went *up* (h1 64px, lead 22px) with 52px CTAs — picked from a live size switcher.
- **Mobile hero:** eyebrow + headline at the optical centre, lead hidden, CTAs anchored at the bottom. Mobile nav overlay needs `height: auto` because the desktop nav row sets a height.
- **Mobile footer:** small rounded card, brand name only, one row of links, short emergency note.
