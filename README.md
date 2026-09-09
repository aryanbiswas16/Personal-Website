# aryanbiswas.ca

Personal site for Aryan Biswas, software developer in Toronto.

Built with React 19 and Vite. No UI framework: a small set of CSS modules, self-hosted fonts
(Instrument Serif, Geist, Geist Mono), and a couple of hooks for theme, scroll reveals, and
the Toronto clock.

Motion comes from three libraries:

- **Three.js + react-three-fiber** for two scenes built from small instanced "parts", sharing
  the helpers in `src/lib/parts.js` and loaded lazily so they never block first paint. In the
  hero (`src/components/HeroScene.jsx`) up to 2,400 parts fill the viewport and sort themselves
  into a torus knot as you scroll, nudged by the cursor. In Contact (`src/components/PlaneScene.jsx`)
  1,000 of them fold into a paper plane that leans toward the cursor; the figure is a mailto link.
- **GSAP ScrollTrigger** for the pinned hero, image parallax, the experience rules and dates,
  the About pull-quote, the footer masthead, and the nav progress line.
- **Lenis** for smooth scrolling. Everything respects `prefers-reduced-motion`: the scene
  becomes a static grid and the scroll effects switch off.

`src/lib/scroll.js` owns the GSAP and Lenis setup.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

## Editing content

Everything shown on the page lives in `src/data/`:

- `site.js` – name, email, social links, nav items, the availability line, and the résumé URL
  (the PDF itself is `public/Aryan-Biswas-Resume.pdf`)
- `projects.js` – the Selected Work grid (images live in `src/assets/`). A project can also
  carry a `paper`: the PDF goes in `public/papers/` so its URL stays stable, and a page-one
  preview (rendered with `pypdfium2`) goes in `src/assets/`. It shows up as a sheet in the
  project card and opens in an in-page reader.
- `experience.js` – the Experience list (wrap text in `**` to emphasize it)
- `skills.js` – the skill rows at the end of About

Hero, About, and footer copy live in their components under `src/components/`.

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
The custom domain is set in `public/CNAME`.

## SEO

`index.html` carries the title, description, Open Graph and Twitter tags, and JSON-LD for the
Person, WebSite, ProfilePage, the CUCAI paper, and the DeepfakeGuard repo. `public/robots.txt`
and `public/sitemap.xml` point crawlers at the page, the résumé, and the paper. When content
changes, bump `dateModified` in the JSON-LD and `lastmod` in the sitemap.
