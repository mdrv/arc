# Changelog

## v002 - 2026-01-17

### 🎬 View Transition API Support

**Major Features:**
- **Native View Transitions** - Full integration with browser View Transition API
- **Automatic Direction Detection** - Forward/back animations automatically applied
- **Transition Presets** - Built-in fade, slide, scale, and Material Design transitions
- **Element Transitions** - Shared element transitions with `viewTransitionName` action
- **Dual-Tree Fallback** - Seamless fallback for browsers without support

**New APIs:**
- `supportsViewTransitions()` - Check if View Transition API is available
- `startViewTransition(callback, config)` - Manual transition wrapper
- `detectNavigationDirection(from, to, isReplace)` - Detect navigation direction
- `transitionPresets` - Pre-built transition configurations
- `generateTransitionCSS()` - Generate CSS for transitions
- `viewTransitionName(node, name)` - Svelte action for shared elements

**Enhanced Types:**
- `ViewTransition` - View Transition object type
- `TransitionDirection` - 'forward' | 'back' | 'replace'
- `TransitionConfig` - Comprehensive transition configuration
- All hooks now receive `transition: ViewTransition | null` parameter

**Navigation Options:**
- `transition?: TransitionConfig` - Configure transitions per navigation
- `forceDualTree` - Force use of dual-tree system instead of View Transitions

**Route Configuration:**
- Routes can now have `transition?: TransitionConfig` property
- Per-route transition defaults

**Performance:**
- GPU-accelerated transitions when using View Transition API
- Zero JavaScript overhead for simple transitions
- Faster page changes with native browser compositing

### 🎨 Transition System

**Built-in Presets:**
```ts
transitionPresets.fade()           // Simple crossfade
transitionPresets.slide()          // Directional slide
transitionPresets.scale()          // Scale + fade
transitionPresets.material()       // Material Design
transitionPresets.none()           // No transition
transitionPresets.custom({...})    // Custom config
```

**CSS Generation:**
- Auto-generated CSS for all presets
- Customizable animations
- Direction-aware transitions (forward/back)

**Advanced Control:**
- `onTransitionStart` callback
- `onTransitionEnd` callback
- Custom CSS classes per transition
- Per-element transition names

### 📊 Router Enhancements

**Improved Hook System:**
- All hooks receive `transition` parameter
- Can check if View Transition is active
- Better coordination with native transitions

**Better Direction Detection:**
- Automatic forward/back based on URL depth
- Configurable per navigation
- Different animations for different directions

### 🔧 Developer Experience

**Type Safety:**
- Full TypeScript support for all new features
- Type-safe transition configurations
- Better IntelliSense support

**Documentation:**
- Comprehensive README with View Transition examples
- COMPARISON.md - Detailed feature comparison with other routers
- Code examples for all transition types
- Migration guide from v001

### 🚀 Performance

**Bundle Size:**
- Smaller when only using View Transitions (no dual-tree overhead)
- ~8KB minified + gzipped with all features
- Tree-shakeable transition presets

**Runtime:**
- Native transitions = GPU-accelerated
- No JavaScript execution during transitions
- Faster perceived performance

### ⚙️ Configuration

**New Router Options:**
- `supportsViewTransitions` - Exposed in router API
- Per-route transition defaults
- Global transition configuration

**Link Enhancements:**
- `data-transition` attribute support
- Automatic transition application to links

### 🔄 Backward Compatibility

**Fully Compatible:**
- All v001 APIs work unchanged
- Dual-tree system still available
- No breaking changes
- Opt-in to View Transitions

**Migration:**
- Simply update imports
- Add CSS for transitions (optional)
- Start using `transition` option (optional)

### 📝 Documentation

**New Files:**
- `README.md` - Full View Transition guide
- `COMPARISON.md` - vs other routers
- Updated types with comprehensive JSDoc

**Examples:**
- Basic View Transition usage
- Custom transitions
- Direction-aware animations
- Shared element transitions
- Fallback strategies

### 🐛 Bug Fixes

- Fixed transition cleanup on navigation cancel
- Improved memory management during transitions
- Better error handling in transition callbacks
- Fixed race conditions in rapid navigation

---

## v001 - 2026-01-16

### Added
- Comprehensive documentation
- Better type organization
- Improved code quality

### Changed
- Split types into dedicated module
- Cleaned up codebase
- Removed experimental code

### Removed
- External dependencies
- Legacy files
- Commented code

---

## v000 - 2025-06-16

Initial version with:
- Client-side routing
- Nested layouts
- Dual-tree rendering
- Navigation hooks
- Image loader
- Multiple experimental features
