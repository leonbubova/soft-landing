# TODO · launch & business

Status 2026-09-05. Site design is done and deployed. What remains is content, legal, infrastructure and getting clients.
`[Lea]` = needs input from Lea · `[Leon]` = we can do it · `[€]` = costs money

## 1 · Launch blockers (site can't go public without these)
- [ ] `[Lea]` Portrait photo (landscape + portrait crop, ≥ 1600px). Replace `.photo__placeholder` in `index.html`.
- [ ] `[Lea]` Real address, phone, e-mail → contact section, footer, Impressum, Datenschutz.
- [ ] `[Lea]` Impressum: full name, USt-ID or Kleinunternehmer (§ 19 UStG), Berufsbezeichnung check (DGSF certificate wording).
- [ ] `[Lea]` Confirm "Freie Plätze ab Oktober" is true, or tell us the month. Pill text in hero.
- [ ] `[Lea]` Quotes in "Stimmen": real client quotes with consent, or remove the section until there are some.
- [ ] `[Leon]` Contact form backend: Web3Forms/Formspree key → repo variable `CONTACT_ENDPOINT`. Sign AV-Vertrag, name provider in Datenschutz §4.
- [ ] `[Leon]` Datenschutz: fill `[…]`, set "Stand" date, remove the two alternative bracketed variants.
- [ ] `[Leon]` Instagram URL in footer (or drop the link if she has no account).

## 2 · Domain & mail `[€]`
- [ ] `[Lea]` Pick domain: `leabertoncello.de` (check availability), fallback `beratung-bertoncello.de`.
- [ ] `[Leon]` Register (~10 €/yr), `public/CNAME`, `vite.config.js` base → `/`, GitHub Pages custom domain + HTTPS. Update `og:url`, `og:image`, canonical.
- [ ] `[Leon]` E-mail on the domain (`hallo@…`): Google Workspace / mailbox.org / Hetzner. Replace Gmail-style address everywhere.
- [ ] `[Leon]` 301 from `leonbubova.github.io/soft-landing/` once the domain is live (meta refresh page in old repo path).

## 3 · Being found (SEO / local)
- [ ] `[Leon]` Google Business Profile: "Psychosoziale Beratung", Köln address, hours, photo, website, booking link. Biggest local lever.
- [ ] `[Leon]` Bing Places (imports from Google), Apple Business Connect.
- [ ] `[Leon]` Structured data: `LocalBusiness` / `ProfessionalService` JSON-LD with address, geo, openingHours, sameAs.
- [ ] `[Leon]` `robots.txt`, `sitemap.xml`, Google Search Console verification (DNS, no tracking needed).
- [ ] `[Leon]` Title/description tuned for "psychosoziale Beratung Köln", "Beratung Behörden Köln", "Angehörigenberatung Köln".
- [ ] `[Lea]` Listings: therapie.de-style directories, DGSF Beraterverzeichnis, Kölner Beratungsstellen lists, Stadt Köln Sozialberatung links.
- [ ] `[Lea]` Ask 3–5 former clients / colleagues for Google reviews once the profile exists.

## 4 · Converting visitors
- [ ] `[Lea]` Decide: online booking (Calendly / cal.com free tier, embedded as link, not iframe → no consent issue) for the free 30-min Erstgespräch.
- [ ] `[Lea]` Prices: publish a range or "Sozialtarif auf Anfrage"? Transparent pricing lowers the barrier for this audience.
- [ ] `[Leon]` "Häufige Fragen" section: costs, Krankenkasse (no), difference to therapy, how many sessions, video setup, confidentiality.
- [ ] `[Leon]` WhatsApp / Signal contact button if Lea wants it (many clients in this segment don't write e-mails).
- [ ] `[Leon]` Auto-reply for the contact form ("Danke, ich melde mich innerhalb von zwei Tagen") via the form provider.
- [ ] `[Lea]` Easy-language ("Leichte Sprache") variant of the hero + Leistungen: fits the target group, rare among competitors.

## 5 · Trust & legal hygiene
- [ ] `[Lea]` DGSF certificate, degree: mention year/institute in "Über mich" or a short CV line.
- [ ] `[Leon]` Berufshaftpflicht mention? (only if she has one, builds trust)
- [ ] `[Leon]` Accessibility pass (BFSG is B2C-relevant from 2025 for services; page already scores 100, but check contrast on gradient cards + focus order in the quiz).
- [ ] `[Leon]` Uptime/broken-link check monthly (GitHub Action with `lychee`).

## 6 · Content & channels (after launch)
- [ ] `[Lea]` Instagram or LinkedIn? Pick one. 2 posts/month: "Behördenbrief erklärt", "Was tun wenn…". We can help with templates.
- [ ] `[Lea]` Flyer for Ämter, Hausarztpraxen, Stadtteilbüros in Köln (print, A6). Reuse site gradient + QR to site.
- [ ] `[Lea]` Cooperation letter to Sozialpsychiatrischer Dienst, Hausärzte, Betreuungsvereine: referral source #1 for this work.
- [ ] `[Leon]` Newsletter? Probably not for this audience. Skip unless asked.

## 7 · Repo housekeeping
- [ ] `[Leon]` Delete merged feature branches older than the current design (keep `explore/compact` as reference? no, it's merged).
- [ ] `[Leon]` `.github/dependabot.yml` for npm updates.
- [ ] `[Leon]` Move `tests/og.mjs` + `tests/screens.mjs` into `scripts/`.

## Order of execution
1. Section 1 (everything Lea-side can be one call with her, ~30 min).
2. Domain + mail → then Google Business Profile (needs the final URL).
3. Structured data, sitemap, Search Console (Leon, one afternoon).
4. Booking link + FAQ.
5. Everything else.
