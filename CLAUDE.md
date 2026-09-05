# soft-landing (Lea website)

Static one-pager: HTML + CSS + JS via Vite, deployed to GitHub Pages. See `README.md` for structure and the contact-form setup, `notes/` for decisions.

## Rules
- Source design lives in Claude Design project `215aa3dc-c0f7-4f56-a9c0-b19a1c126884` (file `Lea Bertoncello Final Final.dc.html`). Don't re-import wholesale; port changes by hand.
- No third-party requests at runtime (fonts self-hosted, no analytics). Keeps the Datenschutz text true and avoids a cookie banner.
- Personal data in Impressum/Datenschutz stays as `[…]` placeholders until Lea provides it.
- Repo name is deliberately anonymous; don't put the client's name in repo name, commit messages, or PR titles.
- Run `npm run build` before committing; the Pages workflow builds from `main`.

## Workflow
Feature branch (`feat/<topic>`) per change → edit → `npm run dev` → check desktop 1280 + mobile 390 → `npm run build` + `npm test` → commit → merge into `main` (no PR needed; branches stay as restore points) → push → Actions deploys.
