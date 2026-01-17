# Project Context

## Purpose

**@mdrv/arc** is a modern, lightweight client-side router for Svelte 5 with native View Transition API support and advanced animation control.

### Goals

- Provide seamless page transitions using browser's native View Transition API
- Maintain zero overhead for simple transitions through GPU acceleration
- Support complex routing patterns (nested routes, layouts, dynamic params, wildcards)
- Enable dual-tree rendering system for browsers without View Transition support
- Offer maximum control over animations with lifecycle hooks
- Deliver type-safe routing with TypeScript inference

## Tech Stack

- **Language**: TypeScript (100% - used everywhere possible per AGENTS.md)
- **Framework**: Svelte 5 (with runes and snippets)
- **Runtime**: Bun (preferred package manager and runtime)
- **Formatting**: dprint (automated code formatting)
- **Browser APIs**: View Transition API, History API
- **Build Target**: Modern browsers (Chrome 111+, Edge 111+, Safari 18+, Opera 97+)

## Project Conventions

### Code Style

- **Inline styling**: Prefer inline styles directly on HTML tags in Svelte components
- **TypeScript everywhere**: All code must use TypeScript, including configuration
- **Formatting**: Use dprint for consistent formatting (run at end of sessions)
- **No emojis**: Avoid emojis in code unless explicitly requested
- **File naming**: Lowercase with dots for special purposes (e.g., `create.svelte.ts`, `router.svelte`)

### Architecture Patterns

#### Dual-Tree System

The core architecture uses two component trees (A and B) that alternate:

- **State machine**: Cycles through `'a'` → `'ba'` → `'b'` → `'ab'` → `'a'`
- **Equality point**: Tracks where trees diverge to minimize re-renders
- **Shared layouts**: Components before the equality point stay mounted
- **Overlapping animations**: Both trees visible during transitions

#### View Transition Integration

- **Native first**: Use View Transition API when available for GPU acceleration
- **Progressive enhancement**: Fallback to dual-tree for unsupported browsers
- **Force option**: Allow `forceDualTree` for complex programmatic animations
- **Direction detection**: Automatically detect forward/back navigation

#### Type Safety

- **Path inference**: Extract valid paths from route configuration
- **Param extraction**: Infer required parameters from route patterns
- **Router API**: Fully typed navigate, isActive, and route objects

### Testing Strategy

Currently not explicitly defined in the project. Recommended approach:

- Unit tests for routing logic (matchRoute, path parsing)
- Integration tests for navigation flows
- Browser tests for View Transition API fallbacks
- Type tests for TypeScript inference

### Git Workflow

- **No auto-commit**: Never commit without developer consent (per AGENTS.md)
- **No auto-build**: Must not build the project without explicit permission
- Standard branching with main/master as primary branch
- Conventional commits preferred

## Domain Context

### Router Terminology

- **Route**: A URL pattern mapped to a component (e.g., `/users/:id`)
- **Layout**: A wrapper component that persists across child routes
- **Hooks**: Lifecycle callbacks (beforeLoad, duringLoad, duringRender, afterRender)
- **Transition**: Animation configuration for page changes
- **Navigation phases**: idle → beforeLoad → duringLoad → duringRender → afterRender → idle

### Component Tree Structure

```typescript
ComponentTree = {
  a: ComponentTreeNode[]    // Current route components
  b: ComponentTreeNode[]    // Next route components  
  eq: number                // Equality point (where trees diverge)
}
```

### Transition Presets

Built-in transitions available:

- `fade()` - Simple crossfade
- `slide()` - Directional slide with auto-detection
- `scale()` - Scale + fade effect
- `material()` - Material Design style
- `none()` - Disable transitions
- `custom()` - Full manual control

## Important Constraints

### Technical Constraints

- **Browser compatibility**: View Transition API only in Chrome 111+, Edge 111+, Safari 18+, Opera 97+
- **Svelte version**: Requires Svelte 5 (uses runes like `$derived`, `$state`)
- **Client-side only**: No SSR support (client-side routing only)
- **Bundle size**: Must remain lightweight and tree-shakeable

### Design Constraints

- **Type safety**: All public APIs must have full TypeScript support
- **Zero overhead**: Native transitions should have no JavaScript cost
- **Progressive enhancement**: Must work without View Transition API
- **Developer experience**: Prefer simple API over configuration complexity

### Documentation Standards

- **Location**: All markdown docs (except README) stored in `/docs` directory (per AGENTS.md)
- **Examples**: Every feature should have code examples
- **Migration guides**: Document breaking changes and upgrade paths

## External Dependencies

### Browser APIs

- **View Transition API**: Core feature for smooth page transitions
  - `document.startViewTransition(callback)`
  - CSS pseudo-elements: `::view-transition-old()`, `::view-transition-new()`

- **History API**: Navigation and state management
  - `history.pushState()`, `history.replaceState()`
  - `popstate` event listener

### Svelte 5 Features

- **Runes**: `$state`, `$derived`, `$effect`
- **Snippets**: For layout children pattern
- **Component types**: `Component<Props>`, `Snippet`

### NPM Packages

- **None for runtime**: Zero dependencies for the library itself
- **Dev dependencies**: TypeScript, Svelte, dprint, and build tools (managed via Bun)

### Version Management

- **NPM registry**: Always check for latest versions of packages (per AGENTS.md)
- **Semver**: Follow semantic versioning for releases
