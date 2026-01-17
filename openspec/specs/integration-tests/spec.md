# integration-tests Specification

## Purpose
TBD - created by archiving change add-comprehensive-test-suite. Update Purpose after archive.
## Requirements
### Requirement: The project MUST have Navigation Flow Tests

Complete Complete Complete navigation flows must MUST SHALL be tested to ensure the router correctly handles various navigation scenarios.

#### Scenario: Testing programmatic navigation

**Given** a router instance is configured
**When** `navigate()` is called programmatically
**Then** it must:

- Update `location.pathname`
- Call `history.pushState()` or `history.replaceState()` based on options
- Update internal route state
- Trigger component rendering
- Execute lifecycle hooks in correct order

**Test flow:**

```typescript
const router = createRouter({
	'/': Home,
	'/about': About,
})

await navigate('/about')
// Assert: location updated, component changed, hooks executed
```

---

#### Scenario: Testing pushState vs replaceState

**Given** navigation options with `replace` flag
**When** `navigate()` is called
**Then** it must:

- Call `history.pushState()` when `replace: false` (default)
- Call `history.replaceState()` when `replace: true`
- Maintain correct history stack

---

#### Scenario: Testing hash navigation

**Given** a navigation to a path with hash
**When** `navigate('/page#section')` is called
**Then** it must:

- Update `location.pathname` and `location.hash`
- Preserve hash in navigation
- Handle hash-only changes correctly

---

#### Scenario: Testing search params handling

**Given** a navigation with search params
**When** `navigate('/search?q=test')` is called
**Then** it must:

- Update `location.search`
- Parse search params correctly
- Make params accessible via `searchParams` proxy

---

#### Scenario: Testing scroll behavior

**Given** navigation with scroll options
**When** `navigate()` is called with `scrollToTop` option
**Then** it must:

- Scroll to top when `scrollToTop: true`
- Use specified scroll behavior (`auto`, `smooth`, `instant`)
- Respect `scrollToTop: false` (no scroll)

---

### Requirement: The project MUST have Parameter Handling Tests

Dynamic Dynamic Dynamic route parameters must MUST SHALL be correctly extracted and made available throughout the navigation lifecycle.

#### Scenario: Testing single parameter extraction

**Given** a route with one dynamic parameter
**When** navigating to a matching path
**Then** it must:

- Extract the parameter value
- Populate the `params` object
- Make params accessible to components
- Pass params to hooks

**Test example:**

```typescript
const router = createRouter({
	'/users/:id': UserDetail,
})

await navigate('/users/123')
// Assert: params.value.id === '123'
```

---

#### Scenario: Testing multiple parameters

**Given** a route with multiple dynamic parameters
**When** navigating to a matching path
**Then** it must:

- Extract all parameters
- Maintain correct parameter names
- Handle parameters in any order

**Test example:**

```typescript
const router = createRouter({
	'/posts/:category/:slug': PostDetail,
})

await navigate('/posts/tech/vitest-guide')
// Assert: params.value.category === 'tech', params.value.slug === 'vitest-guide'
```

---

#### Scenario: Testing nested route parameters

**Given** nested routes with parameters at multiple levels
**When** navigating to a nested path
**Then** it must:

- Accumulate parameters from all route levels
- Handle parameter conflicts (child overrides parent)
- Make all params available

---

### Requirement: The project MUST have Layout Persistence Tests

Layout Layout Layout components must MUST SHALL persist across route changes and maintain their state.

#### Scenario: Testing layout component persistence

**Given** routes with a shared layout
**When** navigating between child routes
**Then** the layout must:

- Stay mounted (not re-render)
- Maintain internal state
- Only re-mount when navigating away from layout scope

**Test example:**

```typescript
const router = createRouter({
	'/dashboard': {
		layout: DashboardLayout,
		'/': Overview,
		'/stats': Stats,
	},
})

await navigate('/dashboard')
const layoutInstance = /* capture layout instance */
	await navigate('/dashboard/stats')
// Assert: layout instance is same (not re-created)
```

---

#### Scenario: Testing nested layout hierarchy

**Given** multiple levels of nested layouts
**When** navigating through nested routes
**Then** it must:

- Mount layouts in correct hierarchy order
- Persist all parent layouts
- Only change the deepest component

---

#### Scenario: Testing breakFromLayouts

**Given** a route with `breakFromLayouts: true`
**When** navigating to that route
**Then** it must:

- Unmount all parent layouts
- Render only the route component
- Restore layouts when navigating away

---

### Requirement: The project MUST have Lifecycle Hook Tests

Navigation lifecycle hooks SHALL execute in the correct order with correct parameters.

#### Scenario: Testing hook execution order

**Given** routes with all lifecycle hooks defined
**When** navigating between routes
**Then** hooks must execute in order:

1. `beforeLoad` - Before component loading
2. `duringLoad` - During async loading
3. `duringRender` - During DOM render
4. `afterRender` - After render completes

**Verification:**

```typescript
const executionOrder = []

const hooks = {
	beforeLoad: () => executionOrder.push('beforeLoad'),
	duringLoad: () => executionOrder.push('duringLoad'),
	duringRender: () => executionOrder.push('duringRender'),
	afterRender: () => executionOrder.push('afterRender'),
}

await navigate('/page')
// Assert: executionOrder === ['beforeLoad', 'duringLoad', 'duringRender', 'afterRender']
```

---

#### Scenario: Testing hook parameters

**Given** hooks defined on routes
**When** hooks are executed during navigation
**Then** each hook must receive:

- Current `location` object
- `params` object with route parameters
- `transition` object (ViewTransition or null)
- Context specific to the hook type

---

#### Scenario: Testing nested route hooks

**Given** nested routes with hooks at multiple levels
**When** navigating to a nested route
**Then** it must:

- Execute all parent hooks first
- Execute child hooks last
- Maintain correct order across hierarchy

---

### Requirement: The project MUST have Error Handling Tests

The router SHALL gracefully handle error scenarios without crashing.

#### Scenario: Testing 404 handling (no route match)

**Given** a navigation to a path with no matching route
**When** `matchRoute()` is called
**Then** it must:

- Return `undefined` for match
- Not throw an error
- Allow custom 404 handling

**Test example:**

```typescript
const router = createRouter({
	'/': Home,
	'*': NotFound, // Wildcard as 404
})

await navigate('/nonexistent')
// Assert: NotFound component rendered
```

---

#### Scenario: Testing invalid route patterns

**Given** routes with invalid patterns
**When** `validateRoutes()` is called
**Then** it must:

- Log warnings for problematic patterns
- Not crash the router
- Allow router to continue functioning

---

#### Scenario: Testing navigation during transition

**Given** a navigation is in progress
**When** another `navigate()` is called before completion
**Then** it must:

- Cancel the previous navigation
- Start the new navigation
- Not leave router in inconsistent state

---

#### Scenario: Testing hook errors

**Given** a hook that throws an error
**When** the hook is executed during navigation
**Then** it must:

- Catch the error gracefully
- Log the error
- Continue with navigation (or abort based on hook type)
- Not crash the entire router

---

### Requirement: The project MUST have Browser History Integration Tests

The router SHALL correctly integrate with browser history APIs.

#### Scenario: Testing back button navigation

**Given** multiple pages visited in history
**When** `history.back()` is called
**Then** it must:

- Navigate to previous route
- Update location correctly
- Trigger `popstate` event handler
- Execute lifecycle hooks
- Detect direction as `'back'`

---

#### Scenario: Testing forward button navigation

**Given** user has navigated back in history
**When** `history.forward()` is called
**Then** it must:

- Navigate to next route in history
- Handle the navigation correctly
- Detect direction as `'forward'`

---

#### Scenario: Testing popstate event handling

**Given** the router is listening to popstate events
**When** `popstate` event is triggered (back/forward button)
**Then** it must:

- Detect the event
- Read the new location
- Navigate to the correct route
- Update all reactive state

