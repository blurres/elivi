# Elivi Portfolio (Frontend)

Rebuild of your portfolio UI/interaction layer using React + TypeScript + Vite.

## Stack

- React 19
- TypeScript
- Vite
- Framer Motion
- Lenis (smooth scrolling)
- Lucide Icons

## Features

- Draggable project cards in chaos mode
- Grid and chaos view toggle
- Search and tag filtering dock
- Animated liquid background
- Custom cursor (optimized to reduce lag)
- Expanded project modal preview
- Embedded mini snake game modal

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Important note

Run commands from this folder:

`portfolio/elivi`

If you run from `portfolio` root, npm will fail because `package.json` is inside `elivi`.

## Deployment (free hosting)

### Recommended now: Vercel (free)

1. Push this `elivi` project to GitHub.
2. Go to Vercel dashboard and import the repo.
3. Framework preset: `Vite`.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

You will get a free URL like:

`https://your-project-name.vercel.app`

After first deploy, update these files with your exact URL:

- `index.html` (`canonical`, `og:url`, `og:image`, `twitter:image`)
- `public/robots.txt` (Sitemap URL)
- `public/sitemap.xml` (`loc`)

### Other free options

- Netlify
- Cloudflare Pages
- GitHub Pages

## Deployment (static frontend)

This app is static and can be deployed to:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages (with Vite base config if needed)

For most platforms:

- Build command: `npm run build`
- Output directory: `dist`

## Next customization ideas

- Replace seeded demo items with your real portfolio content
- Add your own profile title/bio in `src/App.tsx`
- Swap media URLs for your own hosted assets
