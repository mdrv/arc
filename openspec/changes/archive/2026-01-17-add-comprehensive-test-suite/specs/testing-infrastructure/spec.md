# Spec: Testing Infrastructure

## ADDED Requirements

### Requirement: The project MUST have Vitest Test Runner Configuration

The project SHALL have Vitest configured as the test runner with modern ESM support and TypeScript integration.

#### Scenario: Installing and configuring Vitest

**Given** the project needs a test suite
**When** Vitest is installed and configured
**Then** the following must be true:

- `vitest`, `happy-dom`, and `@vitest/coverage-v8` are in devDependencies
- A `vitest.config.ts` file exists in the project root
- The config specifies `happy-dom` as the test environment
- The config enables coverage reporting with v8 provider
- Test file patterns include `tests/**/*.test.ts`
- TypeScript support is enabled in the config

**Example configuration:**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'happy-dom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['dist/**', 'tests/**', '**/*.config.ts'],
		},
		include: ['tests/**/*.test.ts'],
	},
})
```

---

### Requirement: The project MUST have Test Directory Structure

The project SHALL have an organized test directory structure that separates unit and integration tests.

#### Scenario: Creating test directories

**Given** tests need to be organized
**When** the test directory structure is created
**Then** the following directories must exist:

- `tests/` - Root test directory
- `tests/unit/` - Unit tests for individual functions
- `tests/integration/` - Integration tests for complete flows
- A `tests/setup.ts` file for global test configuration
- A `tests/tsconfig.json` extending the root TypeScript config

---

### Requirement: The project MUST have NPM Test Scripts

The project SHALL provide convenient npm scripts for running tests in different modes.

#### Scenario: Running tests via npm scripts

**Given** developers need to run tests
**When** npm test scripts are configured
**Then** the following scripts must be available:

- `test` - Run tests in watch mode for development
- `test:run` - Run tests once (for CI)
- `test:coverage` - Run tests with coverage report
- `test:ui` - Open Vitest UI for interactive testing

**Example package.json scripts:**

```json
{
	"scripts": {
		"test": "vitest",
		"test:run": "vitest run",
		"test:coverage": "vitest run --coverage",
		"test:ui": "vitest --ui"
	}
}
```

---

### Requirement: The project MUST have Global Test Setup

The project SHALL have a global test setup file that configures the test environment and mocks browser APIs.

#### Scenario: Mocking browser APIs for tests

**Given** tests need browser APIs that aren't available in happy-dom
**When** the global setup file is executed
**Then** the following must be mocked:

- `document.startViewTransition` - View Transition API
- `globalThis.location` - Browser location object
- `globalThis.history` - Browser history API
- Default values must be provided for all mocked APIs

**Example setup:**

```typescript
// tests/setup.ts
import { beforeEach, vi } from 'vitest'

// Mock View Transition API
if (!document.startViewTransition) {
	document.startViewTransition = (callback) => {
		callback()
		return {
			finished: Promise.resolve(),
			ready: Promise.resolve(),
			updateCallbackDone: Promise.resolve(),
			skipTransition: () => {},
		}
	}
}

// Reset location before each test
beforeEach(() => {
	Object.defineProperty(globalThis, 'location', {
		value: {
			pathname: '/',
			search: '',
			hash: '',
			state: null,
		},
		writable: true,
	})
})
```

---

### Requirement: The project MUST have Code Coverage Configuration

The project SHALL configure code coverage reporting to track test coverage metrics.

#### Scenario: Generating coverage reports

**Given** developers need to track test coverage
**When** coverage is configured and tests run with `--coverage` flag
**Then** the following must occur:

- Coverage reports are generated in multiple formats (text, JSON, HTML)
- Build artifacts (`dist/`) are excluded from coverage
- Test files themselves are excluded from coverage
- Configuration files are excluded from coverage
- Coverage reports are not tracked in git (added to .gitignore)

**Coverage exclusions:**

- `dist/**`
- `tests/**`
- `**/*.config.ts`
- `docs/**`
