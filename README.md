# soft-landing

One-page site for a psychosocial counselling practice. Plain HTML + CSS + JS, bundled with Vite, deployed to GitHub Pages.

## Run

```
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/
npm run preview
```

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
| `.github/workflows/deploy.yml` | Build + deploy to GitHub Pages on push to `main` |

Fonts are self-hosted via `@fontsource` (no Google Fonts request → no consent needed). No cookies, no tracking.

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
