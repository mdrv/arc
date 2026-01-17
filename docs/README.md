# @mdsv/arc Documentation Site

Built with Astro + Svelte 5, deployed to GitHub Pages at https://mdrv.github.io/arc/

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
# or shorthand
bun run d

# Visit http://localhost:4321/arc/
```

## Building

```bash
# Build for production
bun run build
# or shorthand
bun run b

# Preview production build
bun run preview
# or shorthand  
bun run p
```

## Deployment

Automatic deployment to GitHub Pages happens on every push to `main`/`master` via GitHub Actions.

The workflow:

1. Checks out code
2. Installs dependencies with Bun
3. Builds the Astro site
4. Deploys to GitHub Pages

See `.github/workflows/deploy-docs.yml` for details.

## Structure

```
docs/
├── src/
│   ├── pages/              # Routes (index, getting-started, examples)
│   ├── layouts/            # Page layout
│   ├── components/         # Svelte components (including live demos)
│   └── styles/             # Global CSS
├── public/                 # Static assets (.nojekyll)
├── markdown/               # Existing markdown documentation
├── astro.config.ts         # Astro configuration
├── package.json
└── tsconfig.json
```

## Live Demos

The site includes interactive Svelte 5 components that showcase the router in action:

- `RouterDemo.svelte` - Live navigation example with transitions
- Demo pages in `components/demo-pages/`

These components import `@mdsv/arc` directly from the source code via Vite alias.

## Configuration

- **Site**: https://mdrv.github.io
- **Base**: /arc
- **Static output**: SSR disabled (GitHub Pages compatible)
- **Assets**: `_astro/` directory
- **Jekyll**: Disabled via `.nojekyll` file
