# Development Setup

## Prerequisites

- **Bun** - Runtime and package manager (latest version)
- **TypeScript** - Via devDependencies
- **Svelte 5** - Peer dependency for development

## Installation

```bash
# Clone repository
git clone <repository-url>
cd arc

# Install dependencies with Bun
bun install
```

## Project Structure

```
arc/
├── src/                    # Source code
│   ├── index.ts           # Main entry point (exports all public APIs)
│   ├── types.ts           # TypeScript type definitions
│   ├── create.svelte.ts   # Router creation logic
│   ├── router.svelte      # Router component
│   ├── recursive.svelte   # Recursive route renderer
│   ├── load.svelte.ts     # Route loading logic
│   ├── transitions.ts     # View Transition API integration
│   └── utils.ts           # Utility functions
├── docs/                  # Documentation (Markdown files)
│   ├── CHANGELOG.md       # Version history
│   ├── COMPARISON.md      # Comparison with other routers
│   └── QUICK-START.md     # Quick start guide
├── _docs/                 # Internal docs (gitignored, for AI/devs)
├── openspec/              # OpenSpec specifications
│   ├── project.md         # Project context and conventions
│   ├── build-system.md    # Build configuration docs
│   ├── setup.md           # This file
│   └── AGENTS.md          # AI assistant instructions
├── dist/                  # Build output (gitignored)
├── package.json           # Package metadata
├── tsconfig.json          # TypeScript configuration
├── tsdown.config.ts       # Build configuration
├── dprint.json            # Code formatter configuration
├── svelte.config.ts       # Svelte compiler configuration
├── .gitignore             # Git ignore rules
├── AGENTS.md              # Root-level AI instructions
└── README.md              # User-facing documentation
```

## Configuration Files

### package.json

- **Purpose**: Package metadata, dependencies, scripts
- **Key fields**:
  - `type: "module"` - ESM package
  - `peerDependencies`: Svelte 5
  - `exports`: Package entry points

### tsconfig.json

- **Purpose**: TypeScript compiler configuration
- **Key settings**:
  - `strict: true` - Maximum type safety
  - `target: "ES2022"` - Modern JavaScript
  - `moduleResolution: "bundler"` - For bundler environments
  - `types: ["svelte"]` - Svelte type support

### tsdown.config.ts

- **Purpose**: Build tool configuration
- **See**: `openspec/build-system.md` for details
- **Format**: TypeScript (per project conventions)

### dprint.json

- **Purpose**: Code formatting rules
- **Key settings**:
  - Tabs for indentation (code files)
  - 2 spaces for JSON
  - Single quotes, ASI (no semicolons)
  - Line width: 100 characters

### svelte.config.ts

- **Purpose**: Svelte compiler options
- **Key settings**:
  - `runes: true` - Enable Svelte 5 runes
- **Format**: TypeScript (per project conventions)

### .gitignore

- **Purpose**: Files excluded from version control
- **Key entries**:
  - `_docs/` - Internal documentation
  - `node_modules/` - Dependencies
  - `dist/` - Build output
  - `.env*` - Environment files

## Development Commands

### Type Checking

```bash
bun run typecheck
```

Runs `tsc --noEmit` to check types without building.

### Code Formatting

```bash
# Format all files
bun run format

# Check formatting without changes
bun run format:check
```

### Building

```bash
# Production build
bun run build

# Development build with watch mode
bun run dev
```

### Publishing

```bash
# Prepare and publish to npm
npm publish
```

The `prepublishOnly` hook automatically:

1. Formats code with dprint
2. Type checks with TypeScript
3. Builds with tsdown

## Coding Conventions

### TypeScript Everywhere

- **All code must be TypeScript** - No plain JavaScript files
- **Configuration files too** - Use `.ts` for configs when possible

### Code Style

- **Tabs for indentation** - Not spaces (in code files)
- **Single quotes** - For strings
- **ASI (no semicolons)** - Automatic semicolon insertion
- **Line width: 100** - Maximum characters per line

### File Naming

- **Lowercase** - Use lowercase for file names
- **Dots for special purposes** - e.g., `create.svelte.ts`, `load.svelte.ts`
- **Extensions**: `.ts` for TypeScript, `.svelte` for Svelte components

### Svelte Conventions

- **Inline styles preferred** - Style directly on HTML tags
- **Runes required** - Use `$state`, `$derived`, `$effect` (Svelte 5)
- **No script context="module"** - Use regular `<script>` with runes

### Documentation

- **Location**: All markdown docs (except README) in `/docs` directory
- **Internal docs**: Personal/AI notes in `/_docs` (gitignored)
- **Code comments**: Minimal, focus on "why" not "what"

## Git Workflow

### Committing

- **No auto-commit** - AI assistants must not commit without consent
- **No auto-build** - Must not build without permission
- **Conventional commits** - Use clear, descriptive commit messages

### Branching

- **main/master** - Primary branch for stable releases
- **Feature branches** - For development work
- **No force push** - To main/master unless absolutely necessary

## Package Management

### Bun Preferred

- **Primary tool**: Use Bun for all package operations
- **Lock file**: `bun.lockb` (binary format)
- **Installation**: `bun install` (not npm or yarn)

### Version Checking

- **Always check npm registry** - For latest package versions before adding
- **Semantic versioning** - Follow semver for releases
- **Peer dependencies** - Svelte 5 is peer dependency (not bundled)

## Type Safety

### Strict TypeScript

All type checking flags enabled:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

### Type Exports

All public types exported from `src/types.ts`:

- `RouteComponent`
- `Routes`
- `NavigateOptions`
- `TransitionConfig`
- `Hooks`
- etc.

## Browser Compatibility

### Minimum Versions

- **View Transition API**: Chrome 111+, Edge 111+, Safari 18+, Opera 97+
- **Fallback**: All modern browsers (dual-tree system)

### Target Environment

- **Browser only** - No Node.js, no SSR
- **Client-side routing** - SPA applications
- **Modern JavaScript** - ES2022 features assumed

## Testing (Future)

Currently no testing setup. Recommended:

- **Unit tests**: Vitest or Bun test
- **Type tests**: tsd or expect-type
- **Browser tests**: Playwright for View Transition API
- **Integration tests**: Test routing flows end-to-end

## Troubleshooting

### TypeScript errors

1. Run `bun run typecheck` to see all errors
2. Check `tsconfig.json` settings
3. Ensure Svelte types are installed: `bun add -d svelte`

### Build fails

1. Check `tsdown.config.ts` is correct
2. Verify `src/index.ts` exists and exports APIs
3. Run `bun install` to ensure dependencies are installed

### Formatting issues

1. Run `bun run format` to auto-fix
2. Check `dprint.json` configuration
3. Ensure dprint is installed: `bun add -d dprint`

### Svelte component errors

1. Check `svelte.config.ts` has `runes: true`
2. Verify using Svelte 5 syntax (`$state`, `$derived`, etc.)
3. Ensure component files end in `.svelte`

## IDE Setup

### Recommended: VS Code

**Extensions**:

- Svelte for VS Code
- TypeScript and JavaScript Language Features (built-in)
- dprint (optional, for auto-format on save)

**Settings** (`.vscode/settings.json`):

```json
{
	"editor.defaultFormatter": "dprint.dprint",
	"editor.formatOnSave": true,
	"editor.tabSize": 2,
	"editor.insertSpaces": false
}
```

### Type Checking in Editor

TypeScript errors appear inline in supported editors. Run `bun run typecheck` for full validation.

## OpenSpec Integration

This project uses OpenSpec for specification-driven development:

1. **Before coding**: Check `openspec/project.md` for conventions
2. **For new features**: Create proposal in `openspec/changes/`
3. **For specifications**: See `openspec/AGENTS.md` for workflow
4. **Validate changes**: `openspec validate --strict --no-interactive`

See `openspec/AGENTS.md` for complete OpenSpec workflow.
