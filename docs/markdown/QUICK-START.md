# Quick Reference: v002 View Transitions

## 🚀 Ultra-Quick Start

```svelte
<!-- App.svelte -->
<script>
  import { Router, generateTransitionCSS } from '@mdsv/arc'
</script>

<svelte:head>
  <style>{@html generateTransitionCSS()}</style>
</svelte:head>

<Router />
```

```ts
// routes.ts
import { createRouter, transitionPresets } from '@mdsv/arc'

export const { navigate } = createRouter({
  routes: {
    '/': Home,
    '/about': About,
  }
})

// Use it
navigate('/about', { transition: transitionPresets.fade() })
```

---

## 🎨 Transition Presets Cheat Sheet

```ts
import { transitionPresets } from '@mdsv/arc'

// FADE - Subtle, professional
transitionPresets.fade()
// Use for: About pages, info pages

// SLIDE - Directional, spatial
transitionPresets.slide()
// Use for: Products, galleries, wizards

// SCALE - Focus effect
transitionPresets.scale()
// Use for: Details, modals, zoom

// MATERIAL - Modern, polished
transitionPresets.material()
// Use for: Dashboards, apps, SPAs

// NONE - Instant
transitionPresets.none()
// Use for: Skip transitions

// CUSTOM - Full control
transitionPresets.custom({
  name: 'my-transition',
  direction: 'forward',
  classes: ['my-class'],
  onTransitionStart: (t) => console.log('start'),
  onTransitionEnd: (t) => console.log('end')
})
```

---

## 📐 Common Patterns

### Pattern 1: Simple SPA

```ts
const { navigate } = createRouter({
  routes: {
    '/': Home,
    '/about': About,
    '/contact': Contact,
  }
})

// All pages get default browser transition
navigate('/about')
```

### Pattern 2: Themed Sections

```ts
const router = createRouter({
  routes: {
    '/': Home,
    
    '/products': {
      transition: transitionPresets.slide(),
      '/:id': ProductDetail,
    },
    
    '/blog': {
      transition: transitionPresets.fade(),
      '/:slug': BlogPost,
    },
    
    '/app': {
      transition: transitionPresets.material(),
      layout: DashboardLayout,
      '/dashboard': Dashboard,
    }
  }
})
```

### Pattern 3: Complex Gallery

```ts
const router = createRouter({
  routes: {
    '/gallery': {
      hooks: {
        duringLoad: async () => {
          // Preload images
          await loadImages()
        },
        duringRender: async ({ transition }) => {
          if (!transition) {
            // Custom GSAP animation
            await animateWithGSAP()
          }
        }
      },
      '/:id': GalleryItem,
    }
  }
})

// Use dual-tree for this route
navigate('/gallery/123', {
  transition: { forceDualTree: true }
})
```

---

## 🎯 Decision Tree

```
Need transition?
├─ Yes
│  ├─ Simple fade/slide?
│  │  └─ Use: transitionPresets.fade() or .slide()
│  │
│  ├─ App-like feel?
│  │  └─ Use: transitionPresets.material()
│  │
│  ├─ Complex animation needed?
│  │  └─ Use: { forceDualTree: true } + hooks
│  │
│  └─ Custom effect?
│     └─ Use: transitionPresets.custom({...})
│
└─ No
   └─ Use: transitionPresets.none() or don't specify
```

---

## 🔧 Configuration Options

### NavigateOptions

```ts
navigate('/path', {
  // Standard options
  replace?: boolean,
  search?: string,
  hash?: string,
  state?: any,
  scrollToTop?: boolean | ScrollBehavior,
  
  // NEW in v002
  transition?: {
    name?: string,                    // CSS class prefix
    direction?: 'forward'|'back'|'replace',
    classes?: string[],               // Additional CSS classes
    forceDualTree?: boolean,          // Skip View Transitions
    onTransitionStart?: (t) => void,
    onTransitionEnd?: (t) => void,
  }
})
```

### Route Config

```ts
const router = createRouter({
  routes: {
    '/path': {
      // NEW in v002
      transition?: TransitionConfig,  // Default for this route
      
      // Existing
      layout?: LayoutComponent,
      hooks?: Hooks,
      
      // Child routes...
    }
  }
})
```

---

## 🎬 Animation Hooks

```ts
hooks: {
  // 1. Before anything loads
  beforeLoad: async ({ match, params }) => {
    // Auth checks, redirects
  },
  
  // 2. After routes resolved, before render
  duringLoad: async ({ componentTree, transition }) => {
    // Data loading, image preloading
    // transition = ViewTransition object or null
  },
  
  // 3. During render phase
  duringRender: async ({ keys, transition }) => {
    // Custom animations
    // keys.in = entering components
    // keys.out = exiting components
    
    if (!transition) {
      // Dual-tree mode - do custom animations
      await myAnimation(keys.in, keys.out)
    }
  },
  
  // 4. After render complete
  afterRender: ({ transition }) => {
    // Analytics, cleanup
  }
}
```

---

## 💡 Pro Tips

### Tip 1: Shared Elements

```svelte
<script>
  import { viewTransitionName } from '@mdsv/arc'
</script>

<!-- This element morphs between pages -->
<img use:viewTransitionName="hero" src={image} alt="Hero" />
```

### Tip 2: Direction Detection

```ts
// Automatic!
navigate('/next')   // Detects "forward"
navigate(-1)        // Detects "back"

// Manual override
navigate('/page', {
  transition: {
    direction: 'back'  // Force back animation
  }
})
```

### Tip 3: Per-Link Transitions

```svelte
<!-- Via data attribute -->
<a href="/products" data-transition="slide">
  Products
</a>

<!-- Will automatically use slide transition -->
```

### Tip 4: Conditional Transitions

```ts
const transition = user.prefersReducedMotion 
  ? transitionPresets.none()
  : transitionPresets.material()

navigate('/page', { transition })
```

### Tip 5: Debugging

```ts
navigate('/page', {
  transition: {
    onTransitionStart: (t) => {
      console.log('Transition started:', t)
    },
    onTransitionEnd: (t) => {
      console.log('Transition ended:', t)
    }
  }
})
```

---

## 🐛 Troubleshooting

### Transitions not working?

```ts
// 1. Check browser support
const { supportsViewTransitions } = createRouter({ routes })
console.log(supportsViewTransitions) // true/false

// 2. Ensure CSS is loaded
<style>{@html generateTransitionCSS()}</style>

// 3. Check for errors in console
```

### Flickering during transitions?

```css
/* Add to your CSS */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
  mix-blend-mode: normal;
}
```

### Want to disable temporarily?

```ts
navigate('/page', {
  transition: transitionPresets.none()
})
```

---

## 📊 Performance Checklist

- ✅ Use View Transitions for simple cases (GPU-accelerated)
- ✅ Use `forceDualTree` only when necessary
- ✅ Keep transitions under 400ms
- ✅ Preload routes with `data-preload`
- ✅ Lazy load heavy components
- ✅ Test on target devices

---

## 🎓 Learning Path

1. **Day 1**: Basic routing + fade transition
2. **Day 2**: Different presets (slide, material, scale)
3. **Day 3**: Per-route transitions
4. **Day 4**: Shared element transitions
5. **Day 5**: Complex animations with dual-tree + hooks

---

## 📚 Full Docs

- **README.md** - Complete guide
- **COMPARISON.md** - vs other routers
- **CHANGELOG.md** - What's new
- **SUMMARY.md** - Overview

---

**Made with ❤️ for Svelte 5 + View Transition API**
