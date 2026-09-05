# Decisions

## 2026-09-05 · Initial build
- **Vite, vanilla JS.** No framework; the page has one quiz, one form, one modal. Vite only for bundling fonts/CSS and for the GitHub Pages base path.
- **Fonts self-hosted** (`@fontsource`). Google Fonts from Google servers would need consent (LG München 2022). Removes the need for a cookie banner entirely.
- **Contact form = endpoint-agnostic POST.** Static hosting can't send mail. `VITE_CONTACT_ENDPOINT` empty → placeholder mode. Consent checkbox is required because inquiries can contain health data (Art. 9 DSGVO → explicit consent, not just legitimate interest).
- **Legal texts as a modal** with hash routes (`#impressum`, `#datenschutz`) so they are linkable and reachable in one click from every state. Impressum cites § 5 DDG (TMG was replaced May 2024) and § 18 MStV. No EU-ODR link (platform shut down July 2025).
- **Photo placeholder** instead of the Unsplash image; label changed from yellow to ink/white so it doesn't fight with the gradient.
- **Quiz logic:** yes-count 1–3 → booking nudge with different warmth. 0 yes → bonus question; "yes" → soft nudge, "no" → playful "Respekt … vielleicht Gesellschaft?" with a "Trotzdem hallo sagen" CTA.
- **Animations:** IntersectionObserver reveal (once, staggered), drifting linear gradient + floating radial blobs on all gradient surfaces, particle burst + quip + slide transition on quiz answers. All disabled under `prefers-reduced-motion`.

## 2026-09-05 · Layout system sweep
- **One grid for chrome and content.** Top bar and footer are full-bleed bands whose inner content sits on `--pad-x`, same as every section. Brand left, nav right; footer mirrors it. Nothing hugs the viewport edge anymore.
- **Sticky top bar** (`--bar` = 76px / 64px mobile, translucent paper + blur). Nav links are muted until hovered/active; scroll-spy sets `.is-active` (lilac dot). "Kontakt" is the one filled pill = single primary action in the chrome.
- **Hero:** two equal columns inside the content width, copy at optical center, meta row (availability pill, Köln/Video) anchored to the bottom above a hairline so the column reads top → middle → bottom instead of everything sinking to the bottom. Panel's right edge = content edge.
- **Tinted section bands removed.** `--tint` on paper was barely visible, so sections looked "almost full-bleed". Now: paper everywhere, 1px hairline between sections, only the check section stays a full-bleed gradient. Quote cards use `--tint` so they still separate from the ground.
- **Footer** is a full-bleed gradient band: brand + section links on top, hairline, emergency note + legal links below.
