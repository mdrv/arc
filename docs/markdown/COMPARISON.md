# @mdsv/arc vs Other Routers: Feature Comparison

## When to Use @mdsv/arc

### ✅ **Perfect For:**

1. **Complex SPAs with animations**
   - Product showcases, portfolios
   - E-commerce with smooth transitions
   - Dashboards with dynamic content

2. **Modern browser targets**
   - Chrome 111+, Safari 18+
   - Can use latest web APIs
   - Want best performance

3. **Maximum animation control**
   - Need both simple AND complex transitions
   - Want programmatic control via hooks
   - Per-route customization

4. **Type-safe routing**
   - Full TypeScript support
   - Compile-time route validation
   - Auto-complete for paths

### ❌ **Not Ideal For:**

1. **Server-side rendering**
   - Use SvelteKit instead
   - No SSR/SSG support (client-only)

2. **Simple static sites**
   - Overkill for basic pages
   - Use native `<a>` tags or page.js

3. **Legacy browser support**
   - Need IE11? Use a simpler router
   - @mdsv/arc targets modern browsers only

---

## Feature Matrix

| Feature | @mdsv/arc (This) | SvelteKit | TanStack Router | React Router | Vue Router |
|---------|-------------|-----------|-----------------|--------------|------------|
| **View Transition API** | ✅ Native | ⚠️ Experimental | ❌ | ❌ | ❌ |
| **Client-side only** | ✅ | ❌ (Full-stack) | ❌ (Full-stack) | ❌ (Can do SSR) | ❌ (Can do SSR) |
| **Nested layouts** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Type safety** | ✅ Strong | ✅ Strong | ✅ Strong | ⚠️ Basic | ⚠️ Basic |
| **Lazy loading** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Hooks system** | ✅ 4 phases | ✅ Multiple | ✅ Multiple | ⚠️ Limited | ⚠️ Limited |
| **Animation control** | ✅ **Maximum** | ⚠️ Basic | ❌ | ❌ | ⚠️ Basic |
| **Dual-tree system** | ✅ Unique | ❌ | ❌ | ❌ | ❌ |
| **Bundle size** | ~8KB | ~200KB+ | ~15KB | ~12KB | ~10KB |
| **Learning curve** | Medium | High | Medium | Low | Low |
| **Framework** | Svelte 5 only | Svelte only | Framework-agnostic | React only | Vue only |

---

## Detailed Comparisons

### vs SvelteKit

**SvelteKit:**
- Full-stack framework (SSR, SSG, API routes)
- File-based routing
- Server-side rendering
- Much larger bundle
- Great for complex apps with server needs

**@mdsv/arc:**
- Client-side only
- Configuration-based routing
- View Transition API native support
- Smaller bundle (8KB vs 200KB+)
- Great for SPAs without server needs

**When to choose @mdsv/arc:**
- Building a client-side SPA
- Don't need SSR/SSG
- Want smaller bundle
- Need complex animations
- Want maximum control

**When to choose SvelteKit:**
- Need server-side rendering
- Want file-based routing
- Building full-stack app
- Need API routes
- SEO is critical

---

### vs TanStack Router

**TanStack Router:**
- Framework-agnostic
- Very type-safe
- Advanced caching
- Full-stack focus
- No View Transitions

**@mdsv/arc:**
- Svelte 5 specific
- Type-safe
- View Transition API
- Client-side focus
- Simpler API

**When to choose @mdsv/arc:**
- Using Svelte 5
- Want View Transitions
- Need animation control
- Prefer simpler API

**When to choose TanStack:**
- Need framework flexibility
- Want advanced caching
- Building full-stack
- Don't care about transitions

---

### vs React Router / Vue Router

**React/Vue Router:**
- Battle-tested
- Huge ecosystem
- Well-documented
- No View Transitions
- Basic animation support

**@mdsv/arc:**
- Modern API
- View Transitions native
- Maximum animation control
- Smaller, focused
- Svelte 5 specific

**When to choose @mdsv/arc:**
- Using Svelte (obviously!)
- Want modern transitions
- Need animation control
- Prefer smaller bundle

**When to choose React/Vue Router:**
- Using React/Vue
- Want massive ecosystem
- Need battle-tested solution

---

## Unique Features of @mdsv/arc

### 1. **View Transition API Integration**

No other router has this level of integration:

```ts
// Automatic, native transitions
navigate('/page', {
  transition: transitionPresets.material()
})
```

### 2. **Dual-Tree Rendering**

For complex animations when you need full control:

```ts
navigate('/complex', {
  transition: { forceDualTree: true }
})
```

### 3. **4-Phase Hook System**

```ts
beforeLoad  → Auth, redirects
duringLoad  → Data fetching, preloading
duringRender → Animations
afterRender → Analytics, cleanup
```

### 4. **Direction Detection**

Automatic forward/back detection:

```ts
navigate('/next')  // Forward animation
navigate(-1)       // Back animation
```

### 5. **Element-Specific Transitions**

Shared element transitions:

```svelte
<img use:viewTransitionName="hero" />
```

### 6. **Built-in Image Loader**

Progressive image loading with progress:

```svelte
<img data-src="/image.jpg" use:loader.load />
```

---

## Performance Comparison

### Bundle Size (minified + gzipped)

```
@mdsv/arc:           ~8KB   ████
page.js:        ~3KB   ██
React Router:  ~12KB   ██████
Vue Router:    ~10KB   █████
SvelteKit:    ~200KB+  ████████████████████████████████
```

### Runtime Performance

**Page Transition Speed:**
1. **@mdsv/arc w/ View Transitions**: ⚡ Fastest (native GPU)
2. **@mdsv/arc w/ dual-tree**: ⚡⚡ Fast (optimized JS)
3. **SvelteKit**: ⚡⚡ Fast
4. **React Router**: ⚡⚡⚡ Medium
5. **Traditional MPA**: ⚡⚡⚡⚡ Slow (full reload)

---

## Real-World Use Cases

### Perfect Match ✅

1. **Portfolio / Agency Site**
   - Smooth page transitions
   - Image-heavy content
   - Client-side only
   - Modern browsers

2. **E-commerce Frontend**
   - Product catalogs
   - Cart management
   - Smooth animations
   - SPA experience

3. **Dashboard / Admin Panel**
   - Complex nested routes
   - Data loading hooks
   - Real-time updates
   - Modern UI

4. **Interactive Experiences**
   - Games, demos
   - Animations critical
   - Creative projects
   - Experimental UIs

### Not Recommended ❌

1. **Content-heavy sites** → Use SvelteKit (SSR for SEO)
2. **Blog / News sites** → Use SvelteKit (SSG for speed)
3. **Enterprise w/ legacy browsers** → Use simpler router
4. **Simple brochure sites** → Use plain HTML

---

## Summary

**Choose @mdsv/arc when:**
- ✅ Building modern SPA
- ✅ Need amazing transitions
- ✅ Want maximum control
- ✅ Using Svelte 5
- ✅ Target modern browsers
- ✅ Don't need SSR

**Choose something else when:**
- ❌ Need SSR/SSG → SvelteKit
- ❌ Using React → React Router
- ❌ Using Vue → Vue Router
- ❌ Need minimal bundle → page.js
- ❌ Support old browsers → simpler router

---

**Bottom line:** @mdsv/arc is the **best choice for modern Svelte 5 SPAs** that need professional transitions and maximum animation control.
