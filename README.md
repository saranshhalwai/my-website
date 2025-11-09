# Portfolio Website

This repository contains a personal portfolio site built with Next.js + TypeScript and Tailwind CSS.

## Quick start

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Features

- Next.js 16 + React 19 (TypeScript)
- Tailwind CSS for styling
- GSAP scroll animations (lazy-loaded on the client) with ScrollTrigger
  - Elements with `animate-on-scroll` will fade/slide in
  - Containers with `animate-stagger` reveal their children with a stagger
- Typewriter intro in the Hero
- Hero background image support:
  - Fallback to `/public/hero.jpg` if present
  - Optionally set a client-side image via the in-app "Choose hero image" control (stores a data-URL in `localStorage` under the key `heroImage`).

## Change the hero background

Recommended: place an image in the `public/` folder (e.g. `public/hero.jpg`) and it will be used automatically.

If you prefer the in-app chooser (client-side only):
- Open the site, click the "Choose hero image" button in the hero, upload an image, and click "Set as hero" on the preview. This saves a data-URL to `localStorage`.

You can also set/clear the hero image from the browser console:

```javascript
// use public/hero.jpg
localStorage.setItem('heroImage', '/hero.jpg');
window.dispatchEvent(new CustomEvent('heroImageChanged', { detail: { src: '/hero.jpg' } }));

// remove override and fall back to public/hero.jpg
localStorage.removeItem('heroImage');
window.dispatchEvent(new CustomEvent('heroImageChanged'));
```

Notes:
- Storing images as data URLs in `localStorage` can hit browser limits (~5MB). For large images, prefer adding them to `public/`.
- Public images are served statically and used with Next's `<Image />` optimization where possible.

## Development commands

- Dev server: `npm run dev`
- Build: `npm run build`
- Start (production): `npm run start`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`

## Developer notes

- Animations are implemented in `src/components/ScrollAnimations.tsx` and are lazy-loaded so they run only in the browser.
- The hero background logic is in `src/components/HeroBackground.tsx`. It prefers `localStorage.heroImage`, otherwise falls back to `/hero.jpg`.
- The in-app image chooser is `src/components/ImageChooser.tsx` (client-side only).
- To change the fade or opacity of the hero background, edit `HeroBackground.tsx` (the component uses CSS variables and a gradient that fades into `--background` so the fade respects light/dark themes).

## Troubleshooting

- If the hero image does not appear but `/hero.jpg` returns 200 in the Network tab, try a hard refresh (Ctrl+Shift+R) or restart the dev server. Also check `localStorage.getItem('heroImage')` to see if a bad value is set.
- If an uploaded image fails to save via the chooser, it may be too large for `localStorage`.
