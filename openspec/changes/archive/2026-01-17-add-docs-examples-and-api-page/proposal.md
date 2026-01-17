# Change: Add More Examples and API Reference Page

## Why

The documentation site currently has:

- Only one basic router demo on the Examples page
- Links to a non-existent `/arc/api` page in navigation and getting-started
- Missing comprehensive examples showing different router features

Users need more practical examples demonstrating:

- Different transition types (slide, scale, material)
- Nested routes and layouts
- Dynamic parameters
- Lazy loading
- Navigation hooks
- Shared element transitions

Additionally, the broken API page link creates a poor user experience.

## What Changes

### Examples Page Enhancements

- Add multiple interactive Svelte demos showcasing:
  - Different transition presets (fade, slide, scale, material)
  - Nested routes with layouts
  - Dynamic route parameters
  - Programmatic navigation
  - Direction-aware transitions
- Organize examples by category (Basic, Transitions, Advanced)
- Include code snippets for each demo

### New API Reference Page

- Create `/arc/api` page documenting all public exports
- Organize by category:
  - Core Router API (`createRouter`, `Router`)
  - Navigation (`navigate`, `route`, `isActive`)
  - View Transitions (`transitionPresets`, `generateTransitionCSS`, etc.)
  - Types (all exported TypeScript types)
  - Utilities (`Loader`, `searchParams`)
- Include usage examples and parameter descriptions
- Link back from navigation and getting-started page

## Impact

- **Affected files**:
  - `docs/src/pages/examples.astro` - Enhanced with more demos
  - `docs/src/pages/api.astro` - NEW file
  - `docs/src/components/` - New demo components
- **User benefit**: Better documentation, working navigation, more learning resources
- **Breaking changes**: None
