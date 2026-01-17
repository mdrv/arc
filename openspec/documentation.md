# Documentation Site

## Overview

The @mdrv/arc documentation is built with **Astro + Svelte 5** and deployed to **GitHub Pages** at
https://mdrv.github.io/arc/

## Why Astro?

- **Svelte 5 support**: Can use actual Svelte components in docs
- **Live demos**: Interactive examples using the real router library
- **Static output**: Perfect for GitHub Pages (no server needed)
- **Fast builds**: Optimized for content-heavy documentation
- **SSR-safe**: Router library has guards for server-side rendering

## Architecture

### Directory Structure

```
docs/
├── src/
│   ├── pages/              # Routes become HTML pages
│   │   ├── index.astro     # Homepage
│   │   ├── getting-started.astro
│   │   ├── examples.astro  # Live Svelte demos
│   │   ├── api.astro       # API reference
│   │   └── testing.astro   # Testing documentation
│   ├── layouts/
│   │   └── Layout.astro    # Shared layout with nav
│   ├── components/
│   │   ├── RouterDemo.svelte      # Interactive demo
│   │   └── demo-pages/            # Demo pages for router
│   └── styles/
│       └── global.css      # Dark theme styles
├── public/
│   └── .nojekyll          # Disables Jekyll on GitHub Pages
├── markdown/               # Original markdown docs
├── astro.config.ts
├── package.json
└── tsconfig.json
```

### Configuration

**astro.config.ts**:

```typescript
{
  site: 'https://mdrv.github.io',
  base: '/arc',                    // Subpath for GitHub Pages
  integrations: [svelte()],        // Svelte 5 with runes
  vite: {
    resolve: {
      alias: {
        '@mdrv/arc': '../src/index.ts'  // Import from source
      }
    }
  }
}
```

Key settings:

- `site` - Full GitHub Pages URL
- `base` - Repository name as subpath
- `alias` - Import library directly from source code

### GitHub Pages Setup

**Requirements**:

1. `.nojekyll` file in `public/` (copied to build output)
2. Workflow with proper permissions
3. Static build output (no SSR)

**Why `.nojekyll`?**

- Astro outputs assets to `_astro/` directory
- GitHub Pages uses Jekyll by default
- Jekyll ignores directories starting with `_`
- `.nojekyll` disables Jekyll processing

### Deployment Workflow

Location: `.github/workflows/deploy-docs.yml`

Process:

1. **Trigger**: Push to main/master or manual dispatch
2. **Build job**:
   - Checkout code
   - Setup Bun
   - Install dependencies (`docs/` directory)
   - Build Astro site
   - Upload artifact from `docs/dist/`
3. **Deploy job**:
   - Deploy artifact to GitHub Pages

Permissions needed:

- `contents: read`
- `pages: write`
- `id-token: write`

## Live Demos

### How It Works

1. **Import library**: `import { createRouter } from '@mdrv/arc'`
2. **Create Svelte component**: Use router in component
3. **Hydrate on client**: `<RouterDemo client:load />`
4. **SSR-safe**: Library has guards for `window`/`document`

### RouterDemo Component

Shows live navigation with:

- Three routes (Home, About, Contact)
- Fade transitions
- Active state highlighting
- Real router behavior

The component imports the router directly and works because:

- Vite alias resolves `@mdrv/arc` to source code
- Router has SSR guards for `getLocation()`
- Astro hydrates component on client

## Development

### Local Development

```bash
cd docs
bun install
bun run dev
```

Visit: `http://localhost:4321/arc/`

The dev server:

- Hot reloads on file changes
- Supports Svelte HMR
- Uses same base path as production

### Adding Pages

1. Create `.astro` file in `src/pages/`
2. Add to navigation in `Layout.astro`
3. Page is accessible at `/arc/filename`

**Current pages**:

- `index.astro` - Homepage with overview
- `getting-started.astro` - Installation and quick start
- `examples.astro` - Live interactive demos
- `api.astro` - API reference documentation
- `testing.astro` - Test suite documentation (67+ passing tests)

### Adding Svelte Demos

1. Create `.svelte` file in `src/components/`
2. Import in `.astro` page
3. Use `client:load` directive for interactivity

Example:

```astro
---
import MyDemo from '../components/MyDemo.svelte'
---

<MyDemo client:load />
```

## Production Build

```bash
cd docs
bun run build
```

Output: `docs/dist/`

The build:

- Generates static HTML
- Bundles JavaScript/CSS
- Includes `.nojekyll` file
- Uses `/arc` base path

## Enabling GitHub Pages

1. Go to repository settings
2. Pages → Source: **GitHub Actions**
3. Push to main/master triggers deployment

Site will be live at: https://mdrv.github.io/arc/

## Troubleshooting

### Assets not loading (404s)

**Symptom**: JavaScript/CSS files return 404 **Cause**: Jekyll is processing `_astro/` directory
**Fix**: Ensure `.nojekyll` exists in `docs/public/`

### Wrong base path

**Symptom**: Links go to root instead of `/arc/` **Cause**: Base path not configured **Fix**: Check
`base: '/arc'` in `astro.config.ts`

### Router crashes during build

**Symptom**: `Cannot read properties of undefined (reading 'pathname')` **Cause**: Router accessing
`window` during SSR **Fix**: Library has SSR guards - ensure using latest version

### Component not interactive

**Symptom**: Svelte component doesn't respond to clicks **Cause**: Missing client directive **Fix**:
Add `client:load` to component in `.astro` file

## Future Enhancements

Potential additions:

- API reference page
- More interactive examples
- Search functionality
- Code playground
- Version switcher
- Dark/light mode toggle
