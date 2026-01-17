# @mdsv/arc 🚀

A modern, lightweight client-side router for Svelte 5 with **View Transition API** support and advanced animation control.

## What's New in v002

### 🎬 View Transition API Integration

- **Native browser transitions** - GPU-accelerated, smooth animations
- **Automatic fallback** - Dual-tree system for browsers without support
- **Maximum control** - Choose per-route: use native or custom animations
- **Direction detection** - Automatic forward/back detection for different animations

### ⚡ Performance

- **Zero overhead** when using View Transitions API
- **Smaller bundle** when not using dual-tree fallback
- **Faster transitions** with native browser compositing

### 🎨 Built-in Transition Presets

- Fade, Slide, Scale, Material Design
- Easy custom transitions
- CSS generation helper

## Features

✅ **Client-side routing** - Fast, SPA-style navigation\
✅ **View Transition API** - Native, smooth transitions\
✅ **Nested routes & layouts** - Organize complex apps\
✅ **Dynamic parameters** - Extract params from URLs\
✅ **Wildcard routes** - Catch-all for 404s\
✅ **Lazy loading** - Code-split automatically\
✅ **Navigation hooks** - Full lifecycle control\
✅ **Dual-tree fallback** - Complex animations when needed\
✅ **Type-safe** - Full TypeScript support\
✅ **Direction-aware** - Different animations for back/forward\
✅ **Image loader** - Progressive loading utility

## Installation

```bash
npm install @mdsv/arc
```

## Quick Start

### 1. Define Routes

```ts
// routes.ts
import { createRouter } from '@mdsv/arc'
import About from './pages/about.svelte'
import Home from './pages/home.svelte'

export const { navigate, route, isActive } = createRouter({
	routes: {
		'/': Home,
		'/about': About,
		'/users/:id': () => import('./pages/user.svelte'),
	},
})
```

### 2. Add Router & Transitions

```svelte
<!-- App.svelte -->
<script>
	import { generateTransitionCSS, Router } from '@mdsv/arc'
</script>

<svelte:head>
	<style>
		{@html generateTransitionCSS()}
	</style>
</svelte:head>

<Router />
```

### 3. Navigate with Transitions

```svelte
<script>
	import { navigate, transitionPresets } from '@mdsv/arc'
</script>

<!-- Simple fade transition -->
<a href='/about'>About</a>

<!-- Custom transition via data attribute -->
<a href='/products' data-transition='slide'>Products</a>

<!-- Programmatic with transition -->
<button
	on:click={() =>
	navigate('/dashboard', {
		transition: transitionPresets.material(),
	})}
>
	Dashboard
</button>
```

## View Transition API Examples

### Basic Usage

```ts
import { navigate, transitionPresets } from '@mdsv/arc'

// Fade transition
navigate('/about', {
	transition: transitionPresets.fade(),
})

// Slide transition (auto-detects direction)
navigate('/products', {
	transition: transitionPresets.slide(),
})

// Material Design transition
navigate('/dashboard', {
	transition: transitionPresets.material(),
})
```

### Custom Transitions

```ts
navigate('/special', {
	transition: {
		name: 'my-transition',
		classes: ['custom-animation'],
		onTransitionStart: (transition) => {
			console.log('Transition starting...')
		},
		onTransitionEnd: (transition) => {
			console.log('Transition complete!')
		},
	},
})
```

### Direction-Aware Transitions

```ts
// Automatically detects forward/back
navigate('/next') // Slides left (forward)
navigate(-1) // Slides right (back)
```

### Force Dual-Tree Mode

For complex, programmatic animations:

```ts
navigate('/complex', {
	transition: {
		forceDualTree: true, // Use dual-tree instead of View Transitions
	},
})
```

## Advanced: Per-Route Transitions

```ts
const router = createRouter({
	routes: {
		'/': {
			transition: transitionPresets.fade(),
			'/home': Home,
		},
		'/app': {
			transition: transitionPresets.material(),
			layout: AppLayout,
			'/dashboard': Dashboard,
			'/settings': Settings,
		},
	},
})
```

## Custom CSS Transitions

```css
/* Your custom transition */
::view-transition-old(root) {
  animation: my-fade-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: my-fade-in 0.3s ease-in;
}

@keyframes my-fade-out {
  to { 
    opacity: 0;
    transform: scale(0.9) rotate(-2deg);
  }
}

@keyframes my-fade-in {
  from { 
    opacity: 0;
    transform: scale(1.1) rotate(2deg);
  }
}
```

Then use it:

```ts
navigate('/page', {
	transition: { classes: ['my-custom-transition'] },
})
```

## Element-Specific Transitions

For shared element transitions:

```svelte
<script>
	import { viewTransitionName } from '@mdsv/arc'
</script>

<!-- Image morphs between pages -->
<img
	src={hero}
	alt='Hero'
	use:viewTransitionName='hero-image'
/>
```

CSS for shared element:

```css
::view-transition-old(hero-image),
::view-transition-new(hero-image) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Complex Animations with Hooks

When you need maximum control:

```ts
const router = createRouter({
	routes: {
		'/gallery': {
			hooks: {
				async duringLoad({ keys, transition }) {
					// Preload images
					await loadImages()
				},

				async duringRender({ keys, transition }) {
					// Custom animations with GSAP, anime.js, etc.
					if (!transition) { // Only if not using View Transitions
						await animateGallery(keys.in, keys.out)
					}
				},
			},
			'/photos': PhotoGallery,
		},
	},
})
```

## Feature Detection

```svelte
<script>
	import { createRouter } from '@mdsv/arc'

	const { supportsViewTransitions } = createRouter({ routes })
</script>

{#if supportsViewTransitions}
	<p>🎉 Native smooth transitions!</p>
{:else}
	<p>Using dual-tree fallback</p>
{/if}
```

## Transition Presets Reference

```ts
import { transitionPresets } from '@mdsv/arc'

// Available presets:
transitionPresets.fade() // Simple crossfade
transitionPresets.slide('forward') // Slide animation
transitionPresets.scale() // Scale + fade
transitionPresets.material() // Material Design style
transitionPresets.none() // No transition
transitionPresets.custom({ // Full control
	name: 'my-transition',
	direction: 'forward',
	classes: ['my-class'],
	forceDualTree: false,
	onTransitionStart: (t) => {},
	onTransitionEnd: (t) => {},
})
```

## Browser Support

**View Transition API:**

- Chrome 111+
- Edge 111+
- Safari 18+
- Opera 97+

**Fallback:**

- All modern browsers (uses dual-tree system)

## Performance Tips

1. **Use View Transitions when possible** - They're GPU-accelerated
2. **Preload routes** - Add `data-preload` to links
3. **Lazy load heavy pages** - Use dynamic imports
4. **Keep transitions short** - 200-400ms is ideal
5. **Use `will-change` sparingly** - Only for custom animations

## Migration from v001

To use View Transitions, add the CSS:

```svelte
<svelte:head>
	<style>
		{@html generateTransitionCSS()}
	</style>
</svelte:head>
```

## API Reference

### `createRouter(config)`

**New in v002:**

- Returns `supportsViewTransitions: boolean`

### `navigate(path, options)`

**New options:**

- `transition?: TransitionConfig` - Transition configuration

### `NavigateOptions.transition`

```ts
{
  name?: string                      // Transition name
  direction?: TransitionDirection    // 'forward' | 'back' | 'replace'
  classes?: string[]                 // CSS classes to add
  forceDualTree?: boolean           // Skip View Transitions
  onTransitionStart?: (t) => void   // Start callback
  onTransitionEnd?: (t) => void     // End callback
}
```

### New Utilities

- `supportsViewTransitions()` - Check API support
- `startViewTransition(callback, config)` - Manual transition wrapper
- `detectNavigationDirection(from, to, isReplace)` - Direction helper
- `transitionPresets` - Built-in transition configs
- `generateTransitionCSS()` - CSS helper
- `viewTransitionName(node, name)` - Svelte action for shared elements

## Examples

### Simple SPA

```ts
import { createRouter, generateTransitionCSS } from '@mdsv/arc'

const { navigate, route } = createRouter({
	routes: {
		'/': () => import('./pages/home.svelte'),
		'/about': () => import('./pages/about.svelte'),
		'/contact': () => import('./pages/contact.svelte'),
	},
})
```

### E-commerce with Categories

```ts
const router = createRouter({
	routes: {
		'/': Home,
		'/products': {
			transition: transitionPresets.slide(),
			'/:category': ProductList,
			'/:category/:id': ProductDetail,
		},
		'/cart': {
			transition: transitionPresets.material(),
			'/': Cart,
			'/checkout': Checkout,
		},
	},
})
```

### Dashboard with Auth

```ts
const router = createRouter({
	routes: {
		'/': Landing,
		'/(auth)': {
			'/login': Login,
			'/register': Register,
		},
		'/app': {
			layout: DashboardLayout,
			transition: transitionPresets.fade(),
			hooks: {
				beforeLoad: async () => {
					if (!isAuthenticated()) throw navigate('/login')
				},
			},
			'/': Dashboard,
			'/profile': Profile,
			'/settings': Settings,
		},
	},
})
```

## Troubleshooting

### Transitions not working?

1. Check browser support: `supportsViewTransitions`
2. Ensure CSS is loaded: `generateTransitionCSS()`
3. Check console for errors

### Flickering during transitions?

Use `will-change` in CSS:

```css
[data-view-transition-name] {
  will-change: transform, opacity;
}
```

### Want to disable for specific routes?

```ts
navigate('/page', {
	transition: transitionPresets.none(),
})
```

## License

MIT
