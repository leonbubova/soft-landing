# soft-landing

One-page site for a psychosocial counselling practice. Plain HTML + CSS + JS, bundled with Vite, deployed to GitHub Pages.

## Run

```
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/
npm run preview
```

## Tests

```
npm run build && npm run preview   # in one terminal
npm test          # ~20 s: quiz paths, form, legal modal, mobile menu, no JS errors (desktop + mobile)
npm run screens   # ~60 s: full-page shots at 10 viewport sizes + layout asserts → test-results/screens/index.html
```

`npm test` also runs in the deploy workflow and blocks the deploy on failure. Both scripts need a Chrome: a cached Playwright Chromium, `/Applications/Google Chrome.app`, or `CHROME_PATH=…`.

## Structure

| Path | What |
|---|---|
| `index.html` | All content (sections, form, legal modal) |
| `src/style.css` | Design tokens, layout, animations, responsive rules |
| `src/main.js` | Entry: fonts, noise overlays, wires modules |
| `src/reveal.js` | Scroll fade/slide-in (`.reveal`, `.stagger`) |
| `src/quiz.js` | 3-question self check + bonus question, micro-animations |
| `src/contact.js` | Contact form (placeholder mode / form backend) |
| `src/legal.js` | Impressum & Datenschutz modal (`#impressum`, `#datenschutz`) |
| `src/nav.js` | Mobile burger menu |
| `tests/smoke.mjs` | Flow test (`npm test`) |
| `tests/screens.mjs` | Viewport sweep (`npm run screens`) |
| `tests/og.mjs` | Renders the social preview card to `public/og.jpg` (`npm run og`); re-run after changing hero copy |
| `.github/workflows/deploy.yml` | Build + smoke test + deploy to GitHub Pages on push to `main` |

Fonts are self-hosted from `public/fonts/` (latin woff2 copied from `@fontsource`, declared in `style.css` with `font-display: block` and preloaded in `index.html`, so there is no fallback-font flash). No Google Fonts request → no consent needed. No cookies, no tracking. The CSS bundle is inlined into the HTML at build time (`vite.config.js`), so first paint waits only for the HTML.

## Kontaktformular

The site is static, so the form needs a tiny form backend. Minimal setup:

1. Pick a provider: [Web3Forms](https://web3forms.com) (access key, free), [Formspree](https://formspree.io), Netlify Forms, or any endpoint accepting `multipart/form-data` POST.
2. Set the endpoint:
   - locally: copy `.env.example` → `.env`, fill `VITE_CONTACT_ENDPOINT` (and `VITE_CONTACT_KEY` if the provider needs one)
   - on GitHub: repo → Settings → Secrets and variables → Actions → variable `CONTACT_ENDPOINT`, secret `CONTACT_KEY`
3. Sign a data-processing agreement (Art. 28 DSGVO) with the provider and name it in the Datenschutzerklärung (section 4).

**Without an endpoint the form runs in placeholder mode**: validation + sending state + success message, nothing leaves the browser (payload is logged to the console).

Fields sent: `firstname`, `lastname`, `contact`, `message`, `consent`, `subject`. Honeypot field `website` is stripped.

## Placeholders to replace before launch

- Portrait: replace the `.photo__placeholder` block in `index.html` with `<img src="/portrait.jpg" alt="…">` (put the file in `public/`).
- Address, phone, e-mail in the contact section and footer.
- Instagram URL in the footer.
- Impressum: every `[…]` field, USt-ID vs. Kleinunternehmer.
- Datenschutz: `[…]` fields, form provider (section 4), date.

## Deploy

Push to `main` → GitHub Actions builds and publishes to `https://<user>.github.io/<repo>/`.
For a custom domain set repository variable `VITE_BASE` is not needed — edit `vite.config.js` base to `/` and add a `public/CNAME`.
