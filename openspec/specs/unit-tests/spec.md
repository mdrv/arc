# unit-tests Specification

## Purpose
TBD - created by archiving change add-comprehensive-test-suite. Update Purpose after archive.
## Requirements
### Requirement: The project MUST have Path Utility Tests

All All path manipulation utilities MUST SHALL have comprehensive unit tests covering normal and edge cases.

#### Scenario: Testing join() function

**Given** multiple path segments need to be joined
**When** `join()` is called with various inputs
**Then** it must correctly handle:

- Empty segments (returns empty string)
- Single segment (returns segment with leading slash)
- Multiple segments (joins with single slashes)
- Trailing slashes (removes them)
- Leading slashes (preserves first, removes duplicates)
- Double slashes (consolidates to single slash)

**Test cases:**

```typescript
join('') // → ''
join('users') // → '/users'
join('users', 'profile') // → '/users/profile'
join('/users/', '/profile/') // → '/users/profile'
join('//users//') // → '/users'
```

---

#### Scenario: Testing constructPath() function

**Given** a path template with parameters
**When** `constructPath()` is called with params
**Then** it must correctly:

- Replace single param (`:id` → actual value)
- Replace multiple params
- Leave unreplaced params when param missing
- Ignore extra params not in template
- Handle special characters in param values

**Test cases:**

```typescript
constructPath('/users/:id', { id: '123' }) // → '/users/123'
constructPath('/posts/:cat/:slug', { cat: 'tech', slug: 'hello' }) // → '/posts/tech/hello'
constructPath('/users/:id', {}) // → '/users/:id'
constructPath('/users', { extra: 'ignored' }) // → '/users'
```

---

### Requirement: The project MUST have Location Utility Tests

Location-related utilities SHALL be tested in both browser and SSR contexts.

#### Scenario: Testing getLocation() in browser context

**Given** running in a browser environment
**When** `getLocation()` is called
**Then** it must return an object with:

- `pathname` from `globalThis.location.pathname`
- `search` from `globalThis.location.search`
- `hash` from `globalThis.location.hash`
- `state` from `history.state`

---

#### Scenario: Testing getLocation() in SSR context

**Given** `globalThis.location` is undefined (SSR)
**When** `getLocation()` is called
**Then** it must return safe defaults:

- `pathname`: `/`
- `search`: ``
- `hash`: ``
- `state`: `null`

---

#### Scenario: Testing isActive() function

**Given** a current pathname and test pathname
**When** `isActive()` is called
**Then** it must return:

- `true` when paths match exactly
- `false` when paths don't match
- Correctly handle params in paths
- Work with and without params object

**Test cases:**

```typescript
// Assume current location is /users/123
isActive('/users/123') // → true
isActive('/about') // → false
isActive('/users/:id', { id: '123' }) // → true
isActive('/users/:id', { id: '456' }) // → false
```

---

#### Scenario: Testing isActive.startsWith() function

**Given** a current pathname and prefix to test
**When** `isActive.startsWith()` is called
**Then** it must return:

- `true` when current path starts with given path
- `false` otherwise
- Handle nested paths correctly

**Test cases:**

```typescript
// Assume current location is /users/123/posts
isActive.startsWith('/users') // → true
isActive.startsWith('/users/123') // → true
isActive.startsWith('/about') // → false
```

---

### Requirement: The project MUST have Route Matching Tests

The route matching The route matching The route matching algorithm must MUST SHALL correctly match routes and extract parameters.

#### Scenario: Testing matchRoute() with static routes

**Given** a routes configuration with static paths
**When** `matchRoute()` is called
**Then** it must:

- Match exact static routes
- Return the correct component
- Return empty params for static routes
- Return undefined for no match

---

#### Scenario: Testing matchRoute() with dynamic params

**Given** routes with parameter patterns (`:id`, `:slug`)
**When** `matchRoute()` is called with matching path
**Then** it must:

- Extract params correctly into params object
- Match single param routes
- Match multiple param routes
- Populate params with correct values

**Test cases:**

```typescript
matchRoute('/users/123', { '/users/:id': Component })
// → { match: Component, params: { id: '123' } }

matchRoute('/posts/tech/hello', { '/posts/:category/:slug': Component })
// → { match: Component, params: { category: 'tech', slug: 'hello' } }
```

---

#### Scenario: Testing matchRoute() with nested routes

**Given** routes with nested structure
**When** `matchRoute()` is called
**Then** it must:

- Match nested paths correctly
- Accumulate layouts from parent routes
- Accumulate hooks from parent routes
- Calculate params from all levels

---

#### Scenario: Testing matchRoute() with wildcards

**Given** routes with wildcard patterns (`*`)
**When** `matchRoute()` is called
**Then** it must:

- Match wildcard routes for any unmatched path
- Prioritize specific routes over wildcards
- Use wildcard as fallback

---

### Requirement: The project MUST have Component Resolution Tests

Component resolution SHALL handle both eager and lazy-loaded components.

#### Scenario: Testing isLazyImport() detection

**Given** various component types
**When** `isLazyImport()` is called
**Then** it must:

- Return `true` for functions matching `() => import(...)` pattern
- Return `false` for regular components
- Return `false` for non-functions

---

#### Scenario: Testing resolveRouteComponent() with eager components

**Given** an eager-loaded component
**When** `resolveRouteComponent()` is called
**Then** it must return the component immediately without awaiting

---

#### Scenario: Testing resolveRouteComponent() with lazy components

**Given** a lazy-loaded component function
**When** `resolveRouteComponent()` is called
**Then** it must:

- Call the import function
- Extract the default export
- Return the resolved component

---

### Requirement: The project MUST have Tree Calculation Tests

The dual-tree The dual-tree The dual-tree calculation algorithm must MUST SHALL correctly compute equality points and component keys.

#### Scenario: Testing calculateTree() equality point

**Given** previous and next component arrays
**When** `calculateTree()` is called
**Then** it must:

- Calculate correct equality point where trees diverge
- Reuse components before equality point
- Create new components after equality point
- Maintain correct component keys

---

#### Scenario: Testing tree cycling

**Given** the current cycle state
**When** `calculateTree()` is called multiple times
**Then** the cycle must progress:

- `a` → `ba` → `b` → `ab` → `a`
- Components mount in correct tree
- Equality point recalculated each time

---

### Requirement: The project MUST have Route Validation Tests

Route validation SHALL detect problematic route configurations.

#### Scenario: Testing validateRoutes() with wildcard routes

**Given** routes with both wildcards and dynamic params at same level
**When** `validateRoutes()` is called
**Then** it must:

- Detect conflicts between wildcard and dynamic routes
- Log warning for conflicting configurations
- Not throw errors (warnings only)

---

### Requirement: The project MUST have Transition Utility Tests

Transition-related Transition-related Transition-related utilities must MUST SHALL be tested independently of browser APIs.

#### Scenario: Testing supportsViewTransitions()

**Given** the browser environment
**When** `supportsViewTransitions()` is called
**Then** it must:

- Return `true` when `document.startViewTransition` exists
- Return `false` when API is not available

---

#### Scenario: Testing detectNavigationDirection()

**Given** from and to paths
**When** `detectNavigationDirection()` is called
**Then** it must detect:

- `'forward'` when moving to deeper path
- `'back'` when moving to shallower path
- `'replace'` when `isReplace` is true
- `'forward'` for hash-only changes

**Test cases:**

```typescript
detectNavigationDirection('/users', '/users/123', false) // → 'forward'
detectNavigationDirection('/users/123', '/users', false) // → 'back'
detectNavigationDirection('/users', '/about', true) // → 'replace'
```

---

#### Scenario: Testing transition presets

**Given** the transition presets object
**When** each preset function is called
**Then** it must return:

- Valid `TransitionConfig` object
- Correct duration value
- Appropriate easing function
- Valid CSS class names

