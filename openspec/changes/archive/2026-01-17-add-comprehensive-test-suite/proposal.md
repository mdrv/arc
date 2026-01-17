# Proposal: Add Comprehensive Test Suite

## Summary

Add a modern, comprehensive test suite to @mdrv/arc using Vitest to ensure reliability, prevent regressions, and provide confidence for future development and adoption.

## Problem Statement

Currently, @mdrv/arc has no automated tests, which presents several challenges:

1. **No regression protection** - Changes to the codebase may inadvertently break existing functionality
2. **Difficult refactoring** - Fear of breaking things prevents confident code improvements
3. **Adoption barrier** - Potential users hesitate to adopt libraries without test coverage
4. **Documentation gap** - Tests serve as executable documentation showing how the library works
5. **Quality assurance** - No automated way to verify router behavior across different scenarios

## Proposed Solution

Implement a comprehensive test suite with three main components:

### 1. Testing Infrastructure

- Set up Vitest as the modern test runner (faster than Jest, native ESM support)
- Configure happy-dom for DOM environment simulation (lighter than jsdom)
- Add TypeScript support for tests
- Set up test scripts in package.json
- Configure code coverage reporting

### 2. Unit Tests

Test individual functions and utilities in isolation:

- **Route matching** - Pattern matching, parameter extraction, wildcard handling
- **Path utilities** - join(), constructPath(), isActive()
- **Component resolution** - Lazy loading detection, component resolution
- **Tree calculation** - Dual-tree equality point calculation
- **Navigation utilities** - Location parsing, route validation
- **Transition utilities** - Direction detection, preset configurations

### 3. Integration Tests

Test complete routing flows and component interactions:

- **Navigation flows** - pushState, replaceState, popstate handling
- **Parameter passing** - Dynamic routes with params
- **Layout persistence** - Nested layouts staying mounted
- **Transition lifecycle** - Hook execution order
- **Error handling** - 404 scenarios, invalid routes
- **Browser history** - Back/forward navigation

## Benefits

1. **Confidence** - Developers can refactor and add features without fear
2. **Documentation** - Tests demonstrate how to use the library
3. **Quality** - Automated verification of complex routing logic
4. **Adoption** - Users trust tested libraries more
5. **CI/CD** - Enables automated testing in continuous integration
6. **Type safety** - Tests verify TypeScript types work correctly

## Scope

### In Scope

- Vitest setup and configuration
- Unit tests for all utility functions
- Integration tests for core navigation flows
- Test coverage reporting
- GitHub Actions CI integration (future consideration)

### Out of Scope

- E2E tests with real browsers (can be added later)
- Performance benchmarks (separate concern)
- Visual regression tests (not applicable for a router library)
- SSR testing (library is client-side only)

## Technical Approach

### Test Runner: Vitest

- **Modern** - Built for Vite ecosystem, native ESM
- **Fast** - Parallel execution, smart watch mode
- **Compatible** - Jest-like API for easy adoption
- **TypeScript** - First-class TypeScript support
- **Coverage** - Built-in coverage via v8/istanbul

### DOM Environment: happy-dom

- **Lightweight** - Smaller and faster than jsdom
- **Modern** - Better standards compliance
- **Sufficient** - Handles routing/navigation APIs needed

### Test Organization

```
tests/
├── unit/
│   ├── utils.test.ts
│   ├── transitions.test.ts
│   └── route-matching.test.ts
├── integration/
│   ├── navigation.test.ts
│   ├── layouts.test.ts
│   └── hooks.test.ts
├── setup.ts
└── tsconfig.json
```

## Risks & Mitigation

| Risk                        | Impact | Mitigation                                                            |
| --------------------------- | ------ | --------------------------------------------------------------------- |
| Svelte 5 testing complexity | Medium | Use happy-dom and test utilities as functions, not mounted components |
| View Transition API mocking | Medium | Mock `document.startViewTransition` in test setup                     |
| Time investment             | Low    | Start with critical paths, expand coverage incrementally              |
| Maintenance burden          | Low    | Well-structured tests reduce maintenance over time                    |

## Success Criteria

1. ✅ Vitest successfully runs tests
2. ✅ >80% code coverage for utility functions
3. ✅ Core navigation flows have integration tests
4. ✅ Tests pass in CI environment
5. ✅ Test suite runs in <10 seconds
6. ✅ Documentation includes "Running Tests" section

## Dependencies

- **Vitest** - Test runner
- **happy-dom** - DOM environment
- **@vitest/coverage-v8** - Code coverage
- No changes to production dependencies

## Timeline Estimate

- Infrastructure setup: 1-2 hours
- Unit tests: 3-4 hours
- Integration tests: 2-3 hours
- Documentation: 30 minutes
- **Total: 6-9 hours**

## Open Questions

None - proposal is ready for implementation.

## Related Specs

This change creates three new specs:

- `testing-infrastructure` - Test tooling and configuration
- `unit-tests` - Individual function tests
- `integration-tests` - End-to-end routing flows
