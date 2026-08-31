# Muhammad Ali Asif — Portfolio

A cinematic, dark single-page portfolio built from the résumé in `public/Muhammad_Ali_Asif_Resume.pdf`.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (theme tokens in `src/app/globals.css`)
- **GSAP + ScrollTrigger** — entrance timelines, scroll-scatter parallax, word-by-word text fill
- **Lenis** — inertial smooth scrolling, driven off the GSAP ticker
- **three.js** — seven polished-brass shapes drifting through the page, driven by scroll
- **next/font** — Anton (display), Oswald (condensed), Inter (UI)

The hero orb, atmospheric haze, film grain and the AI Surveillance artwork are all
CSS gradients and inline SVG. The only bitmaps are the real project assets in
`public/projects/` (see below).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

## Structure

```
src/
  app/
    globals.css      design tokens, atmosphere, orb, marquee, wordmark
    layout.tsx       fonts, metadata, grain overlay, smooth scroll
    page.tsx         section composition
  components/
    Scene3D.tsx      three.js shapes floating behind the content
    SmoothScroll.tsx Lenis + ScrollTrigger sync, anchor routing
    Nav.tsx          sticky nav + mobile overlay menu
    Hero.tsx         headline, HUD cards, orb, scroll scatter
    Capabilities.tsx "From idea. To production." + stair-stepped cards
    HighlightText.tsx scroll-linked word fill
    CardArt.tsx      abstract SVG artwork for capability cards
    Projects.tsx     Tasky, ReminderLink, AI Surveillance
    Experience.tsx   role timeline
    Skills.tsx       grouped skill grid + education
    Contact.tsx      email / phone / links
    Footer.tsx       oversized clipped wordmark
  lib/
    data.ts          ALL résumé content lives here
```

## Project assets

`public/projects/` holds the real imagery pulled from each shipped product:

| File | Source |
|---|---|
| `tasky-site.png` | Screenshot of the live tasky.ae homepage |
| `tasky-logo.png` | Tasky wordmark from tasky.ae |
| `tasky-hero.png` | Tasky hero photo (spare, currently unused) |
| `reminderlink-icon.jpg` | ReminderLink App Store icon |
| `reminderlink-1..3.jpg` | ReminderLink App Store screenshots |

These belong to their respective products; they are used here as portfolio
references to shipped work. Swap them if a client prefers not to be shown.

## Editing content

Everything text-facing is in [`src/lib/data.ts`](src/lib/data.ts) — profile, roles,
projects, skills, education, marquee items.

Each entry in `projects` can carry a `logo`, a wide `shot` (rendered in a browser
frame), a `phones` array (rendered as a three-phone cluster), a live `href`, and a
`stats` row. Projects with none of those fall back to the inline SVG artwork.

`profile` carries the contact details and social URLs used by the nav, contact
section and footer.

## Accessibility notes

- Respects `prefers-reduced-motion`: Lenis is skipped and all scroll animations
  resolve immediately.
- Small uppercase body copy is a deliberate part of the design language; contrast
  was raised above the reference to stay legible.
