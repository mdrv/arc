# Design: Comprehensive Test Suite for @mdrv/arc

## Architecture Overview

This design document outlines the testing architecture for @mdrv/arc, a Svelte 5 router library with View Transition API support.

## Testing Philosophy

### Principles

1. **Test Behavior, Not Implementation** - Focus on what functions do, not how they do it
2. **Isolation** - Unit tests should not depend on external state or other functions
3. **Fast Feedback** - Tests should run quickly (<10s total)
4. **Maintainable** - Tests should be easy to understand and update
5. **Coverage** - Aim for >80% coverage of critical paths

### Testing Pyramid

```
      /\
     /  \    E2E (Future)
    /____\
   /      \  Integration Tests (~30%)
  /________\
 /          \
/ Unit Tests \ (~70%)
\____________/
```

We prioritize unit tests over integration tests for speed and isolation. E2E tests with real browsers are out of scope for this change.

## Tool Selection

### Vitest vs Jest

| Criteria   | Vitest               | Jest                  | Decision   |
| ---------- | -------------------- | --------------------- | ---------- |
| Speed      | ⚡️ Fast (ESM native) | 🐌 Slower (CommonJS)  | **Vitest** |
| Modern     | ✅ Vite ecosystem    | ❌ Older architecture | **Vitest** |
| TypeScript | ✅ Native support    | ⚠️ Needs ts-jest       | **Vitest** |
| Watch Mode | ✅ Smart & fast      | ✅ Good               | **Vitest** |
| Coverage   | ✅ Built-in (v8)     | ✅ Built-in           | Tie        |
| API        | ✅ Jest-compatible   | ✅ Familiar           | Tie        |

**Winner: Vitest** - Modern, fast, and aligned with the project's tech stack.

### happy-dom vs jsdom

| Criteria     | happy-dom     | jsdom            | Decision      |
| ------------ | ------------- | ---------------- | ------------- |
| Size         | 📦 Smaller    | 📦 Larger        | **happy-dom** |
| Speed        | ⚡️ Faster     | 🐌 Slower        | **happy-dom** |
| Standards    | ✅ Modern     | ✅ Comprehensive | **happy-dom** |
| Maintenance  | ✅ Active     | ✅ Active        | Tie           |
| API Coverage | ✅ Sufficient | ✅ Complete      | Tie           |

**Winner: happy-dom** - Faster and lighter, with sufficient DOM API coverage for router testing.

## Test Organization

### Directory Structure

```
tests/
├── setup.ts                  # Global test setup
├── tsconfig.json             # Test-specific TS config
├── unit/                     # Unit tests (pure functions)
│   ├── path-utils.test.ts
│   ├── location.test.ts
│   ├── route-matching.test.ts
│   ├── component-resolution.test.ts
│   ├── tree-calculation.test.ts
│   ├── route-validation.test.ts
│   └── transitions.test.ts
└── integration/              # Integration tests (flows)
    ├── navigation.test.ts
    ├── params.test.ts
    ├── layouts.test.ts
    ├── hooks.test.ts
    └── errors.test.ts
```

### Naming Conventions

- Test files: `*.test.ts`
- Test suites: `describe('functionName', ...)`
- Test cases: `test('should do something when condition', ...)`
- Use `it` for behavior: `it('navigates to the specified route', ...)`

## What to Test

### Unit Tests (70% of tests)

#### Path Utilities (`src/utils.ts`)

```typescript
// join()
- Empty segments
- Single segment
- Multiple segments
- Trailing/leading slashes
- Double slashes removal

// constructPath()
- No params
- Single param replacement
- Multiple params
- Missing params (should leave :param)
- Extra params (should ignore)
- Special characters in params
```

#### Location Utilities (`src/utils.ts`)

```typescript
// getLocation()
- Browser environment
- SSR environment (fallback)
- All location properties present

// isActive()
- Exact path match
- No match
- With params
- Without params

// isActive.startsWith()
- Prefix match
- No match
- Nested paths
```

#### Route Matching (`src/utils.ts`)

```typescript
// matchRoute()
- Static routes
- Dynamic params (/users/:id)
- Multiple params (/posts/:category/:slug)
- Nested routes
- Wildcard routes (*)
- Route priority (specific before wildcard)
- Parameter extraction
- Layout accumulation
- Hook accumulation
```

#### Component Resolution (`src/utils.ts`)

```typescript
// isLazyImport()
- Detects lazy imports
- Rejects eager components
- Edge cases

// resolveRouteComponent()
- Eager component
- Lazy component (mocked import)
- Array format with submodule
- Error handling
```

#### Tree Calculation (`src/utils.ts`)

```typescript
// calculateTree()
- Equality point calculation
- Component key generation
- Tree cycling (a → ba → b → ab)
- Mounted component reuse
- New component creation
```

#### Transitions (`src/transitions.ts`)

```typescript
// supportsViewTransitions()
- Returns true when available
- Returns false when unavailable

// detectNavigationDirection()
- Forward detection
- Backward detection
- Replace detection
- Hash change detection

// transitionPresets
- Each preset returns valid config
- CSS generation works
```

### Integration Tests (30% of tests)

#### Navigation Flows

```typescript
// Basic navigation
- navigate() changes location
- pushState vs replaceState
- Hash navigation
- Search params handling
- Scroll behavior

// History
- Back button
- Forward button
- popstate event handling
```

#### Parameter Handling

```typescript
// Dynamic routes
- Params extracted correctly
- Params object populated
- Nested route params
- Multiple params in route
```

#### Layout Persistence

```typescript
// Layout mounting
- Layouts persist across routes
- Nested layouts work
- breakFromLayouts unmounts all
- Layout hooks execute
```

#### Lifecycle Hooks

```typescript
// Hook execution
- beforeLoad runs first
- duringLoad runs during transition
- duringRender runs after DOM update
- afterRender runs last
- Hook order preserved
- Transition object passed to hooks
```

#### Error Handling

```typescript
// Error scenarios
- 404 (no route match)
- Invalid route patterns
- Navigation during transition
- Hook errors don't crash router
```

## Mocking Strategy

### Browser APIs

We need to mock several browser APIs that aren't available in happy-dom:

```typescript
// tests/setup.ts

// Mock View Transition API
globalThis.document.startViewTransition = (callback) => {
	callback()
	return {
		finished: Promise.resolve(),
		ready: Promise.resolve(),
		updateCallbackDone: Promise.resolve(),
		skipTransition: () => {},
	}
}

// Mock history API
globalThis.history = {
	pushState: vi.fn(),
	replaceState: vi.fn(),
	state: null,
	// ... other methods
}

// Mock location
globalThis.location = {
	pathname: '/',
	search: '',
	hash: '',
	// ... other properties
}
```

### Component Mocking

For tests that need Svelte components, we'll use simple mock objects:

```typescript
const MockComponent = {
	$$typeof: Symbol.for('svelte.component'),
	render: vi.fn(),
}
```

### Async Resolution

For lazy imports, we'll mock the import function:

```typescript
const lazyComponent = () => Promise.resolve({ default: MockComponent })
```

## Coverage Strategy

### Coverage Targets

- **Overall**: >70%
- **Utilities (src/utils.ts)**: >80%
- **Core Router (src/create.svelte.ts)**: >60% (harder to test due to Svelte reactivity)
- **Transitions (src/transitions.ts)**: >80%
- **Types (src/types.ts)**: N/A (TypeScript types)

### Coverage Exclusions

- Type definitions files
- Demo/example code
- Build configuration

## Test Execution

### Local Development

```bash
# Watch mode for development
bun run test

# Run once
bun run test:run

# With coverage
bun run test:coverage

# With UI
bun run test:ui
```

### CI Integration (Future)

```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: bun run test:run

- name: Coverage Report
  run: bun run test:coverage
```

## Performance Considerations

### Speed Targets

- **Single test**: <100ms
- **Unit test suite**: <5s
- **Full test suite**: <10s

### Optimization Techniques

1. **Parallel execution** - Vitest runs tests in parallel by default
2. **Smart watch mode** - Only re-run affected tests
3. **Minimal setup** - Avoid expensive setup in each test
4. **Mock external dependencies** - Don't make real HTTP requests or DOM manipulations

## Challenges & Solutions

### Challenge 1: Testing Svelte 5 Runes

**Problem**: Svelte 5's `$state`, `$derived` require Svelte runtime.

**Solution**: Test utility functions separately from reactive state. For reactive tests, we can test the functions that manipulate state, not the reactive bindings themselves.

```typescript
// ❌ Don't test this directly
export const location: Location = $state(getLocation())

// ✅ Test this instead
export function getLocation(): Location { ... }
```

### Challenge 2: View Transition API

**Problem**: View Transition API not available in test environment.

**Solution**: Mock `document.startViewTransition` in setup.ts. Test that the router calls it correctly, not the API itself.

### Challenge 3: History API State

**Problem**: History API is stateful and affects global state.

**Solution**: Reset mocks before each test:

```typescript
beforeEach(() => {
	vi.clearAllMocks()
	globalThis.location.pathname = '/'
	globalThis.history.state = null
})
```

### Challenge 4: Async Component Loading

**Problem**: Lazy components use dynamic imports.

**Solution**: Mock import functions and use `vi.fn()` to track calls:

```typescript
const mockImport = vi.fn(() => Promise.resolve({ default: Component }))
await resolveRouteComponent(mockImport)
expect(mockImport).toHaveBeenCalledOnce()
```

## Success Metrics

1. ✅ All tests pass
2. ✅ >80% coverage on utility functions
3. ✅ Test suite runs in <10 seconds
4. ✅ Zero flaky tests
5. ✅ All core navigation flows covered
6. ✅ Tests serve as documentation

## Future Enhancements

### E2E Tests (Out of Scope)

After this change, we could add:

- Playwright tests with real browsers
- Visual regression tests
- Performance benchmarks

### Test Quality

- Mutation testing (Stryker)
- Property-based testing (fast-check)
- Snapshot testing for generated CSS

## References

- [Vitest Documentation](https://vitest.dev/)
- [happy-dom Documentation](https://github.com/capricorn86/happy-dom)
- [Svelte Testing Best Practices](https://svelte.dev/docs/testing)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles)
