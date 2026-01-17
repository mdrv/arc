# Tasks: Add Comprehensive Test Suite

## Overview

This document outlines the specific tasks needed to implement a comprehensive test suite for @mdsv/arc using Vitest.

## Task List

### Phase 1: Infrastructure Setup (1-2 hours)

- [ ] **T1.1**: Install Vitest dependencies
  - Add `vitest`, `happy-dom`, `@vitest/coverage-v8` to devDependencies
  - Check npm registry for latest versions
  - Run `bun add -D vitest happy-dom @vitest/coverage-v8`
  - **Validation**: Dependencies appear in package.json

- [ ] **T1.2**: Create Vitest configuration
  - Create `vitest.config.ts` in project root
  - Configure happy-dom as test environment
  - Set up coverage reporter (v8 provider)
  - Configure test file patterns (`tests/**/*.test.ts`)
  - Enable TypeScript support
  - **Validation**: `bun run vitest --version` works

- [ ] **T1.3**: Create test directory structure
  - Create `tests/` directory
  - Create `tests/unit/` subdirectory
  - Create `tests/integration/` subdirectory
  - Create `tests/setup.ts` for global test setup
  - Create `tests/tsconfig.json` extending root config
  - **Validation**: Directory structure exists

- [ ] **T1.4**: Add test scripts to package.json
  - Add `test` script: `vitest`
  - Add `test:ui` script: `vitest --ui`
  - Add `test:run` script: `vitest run`
  - Add `test:coverage` script: `vitest run --coverage`
  - **Validation**: `bun run test --help` works

- [ ] **T1.5**: Create global test setup file
  - Create `tests/setup.ts`
  - Mock `document.startViewTransition` for View Transition API
  - Mock `globalThis.location` and `history` APIs
  - Set up DOM environment globals
  - **Validation**: Setup file loads without errors

### Phase 2: Unit Tests - Utilities (2-3 hours)

- [ ] **T2.1**: Test path utilities
  - Create `tests/unit/path-utils.test.ts`
  - Test `join()` with various inputs (empty, single, multiple segments)
  - Test `constructPath()` with params replacement
  - Test edge cases (missing params, extra params, special characters)
  - **Validation**: All path utility tests pass

- [ ] **T2.2**: Test location utilities
  - Create `tests/unit/location.test.ts`
  - Test `getLocation()` in browser context
  - Test `getLocation()` SSR fallback
  - Test `isActive()` with exact matches
  - Test `isActive.startsWith()` with path prefixes
  - Test with and without params
  - **Validation**: All location tests pass

- [ ] **T2.3**: Test route matching
  - Create `tests/unit/route-matching.test.ts`
  - Test `matchRoute()` with static routes
  - Test dynamic params (`:id`, `:slug`)
  - Test nested routes
  - Test wildcard routes (`*`)
  - Test route priority (specific before wildcard)
  - Test parameter extraction
  - **Validation**: All route matching tests pass

- [ ] **T2.4**: Test component resolution
  - Create `tests/unit/component-resolution.test.ts`
  - Test `isLazyImport()` detection
  - Test `resolveRouteComponent()` with eager components
  - Test `resolveRouteComponent()` with lazy components
  - Test `resolveRouteComponents()` batch resolution
  - Test submodule extraction
  - **Validation**: All component resolution tests pass

- [ ] **T2.5**: Test tree calculation
  - Create `tests/unit/tree-calculation.test.ts`
  - Test `calculateTree()` with equality point calculation
  - Test tree cycling (`a` → `ba` → `b` → `ab`)
  - Test component key generation
  - Test mounted component reuse
  - **Validation**: All tree calculation tests pass

- [ ] **T2.6**: Test route validation
  - Create `tests/unit/route-validation.test.ts`
  - Test `validateRoutes()` with valid routes
  - Test wildcard vs dynamic route warnings
  - Test route path extraction
  - Test route sorting
  - **Validation**: All validation tests pass

### Phase 3: Unit Tests - Transitions (1 hour)

- [ ] **T3.1**: Test transition utilities
  - Create `tests/unit/transitions.test.ts`
  - Test `supportsViewTransitions()` detection
  - Test `detectNavigationDirection()` logic
  - Test transition presets (fade, slide, scale, material, none)
  - Test `generateTransitionCSS()` output
  - **Validation**: All transition tests pass

### Phase 4: Integration Tests (2-3 hours)

- [ ] **T4.1**: Test basic navigation flow
  - Create `tests/integration/navigation.test.ts`
  - Test programmatic navigation (`navigate()`)
  - Test pushState vs replaceState
  - Test hash navigation
  - Test search params handling
  - **Validation**: Navigation tests pass

- [ ] **T4.2**: Test parameter passing
  - Create `tests/integration/params.test.ts`
  - Test dynamic route params extraction
  - Test params object population
  - Test params in nested routes
  - Test multiple params in single route
  - **Validation**: Param tests pass

- [ ] **T4.3**: Test layout persistence
  - Create `tests/integration/layouts.test.ts`
  - Test layout components stay mounted
  - Test nested layout hierarchy
  - Test layout hooks execution
  - Test `breakFromLayouts` functionality
  - **Validation**: Layout tests pass

- [ ] **T4.4**: Test lifecycle hooks
  - Create `tests/integration/hooks.test.ts`
  - Test `beforeLoad` hook execution
  - Test `duringLoad` hook execution
  - Test `duringRender` hook execution
  - Test `afterRender` hook execution
  - Test hook execution order
  - Test transition parameter in hooks
  - **Validation**: Hook tests pass

- [ ] **T4.5**: Test error scenarios
  - Create `tests/integration/errors.test.ts`
  - Test 404 handling (no route match)
  - Test invalid route patterns
  - Test navigation during transition
  - Test hook errors
  - **Validation**: Error handling tests pass

### Phase 5: Documentation & CI (30 minutes)

- [ ] **T5.1**: Update README with testing info
  - Add "Running Tests" section
  - Document test commands
  - Add code coverage badge placeholder
  - **Validation**: README contains test documentation

- [ ] **T5.2**: Add .gitignore entries
  - Add `coverage/` to .gitignore
  - Add `*.lcov` to .gitignore
  - **Validation**: Coverage files not tracked

- [ ] **T5.3**: Verify full test suite
  - Run `bun run test:run` and ensure all tests pass
  - Run `bun run test:coverage` and check coverage report
  - Verify >80% coverage for utilities
  - **Validation**: Full test suite passes with good coverage

## Task Dependencies

```
T1.1 → T1.2 → T1.3 → T1.4 → T1.5
                 ↓
       T2.1, T2.2, T2.3, T2.4, T2.5, T2.6 (parallel)
                 ↓
              T3.1
                 ↓
       T4.1, T4.2, T4.3, T4.4, T4.5 (parallel)
                 ↓
       T5.1, T5.2, T5.3 (parallel)
```

## Acceptance Criteria

- ✅ All tasks completed and validated
- ✅ Test suite runs successfully
- ✅ >80% code coverage for utility functions
- ✅ All core navigation flows tested
- ✅ Tests execute in <10 seconds
- ✅ Documentation updated
- ✅ No breaking changes to existing code

## Notes

- Use `describe` and `test` (or `it`) from Vitest
- Follow AAA pattern: Arrange, Act, Assert
- Use descriptive test names
- Mock external dependencies (DOM APIs)
- Keep tests focused and isolated
- Prefer unit tests over integration tests where possible
