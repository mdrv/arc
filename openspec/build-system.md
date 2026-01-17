# Build System

## Build Tool: tsdown

### Why tsdown

We use `tsdown` for building @mdsv/arc because:

- **TypeScript-first**: Built specifically for TypeScript libraries
- **Type declarations**: Automatically generates `.d.ts` files with proper resolution
- **Modern output**: Targets modern JavaScript (ES2022) for smaller bundles
- **Simple configuration**: Minimal config compared to complex bundler setups
- **Fast builds**: Optimized for TypeScript compilation speed
- **ESM-focused**: First-class ESM support (our target format)

### Configuration

Configuration is in `tsdown.config.ts`:

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	outDir: 'dist',
	clean: true,
	dts: {
		resolve: true,
	},
	target: 'es2022',
	platform: 'browser',
	minify: false,
	sourcemap: true,
	external: ['svelte'],
})
```

### Key Settings Explained

#### Entry Point

- `entry: ['src/index.ts']` - Single entry point for the library
- All exports must go through `src/index.ts`

#### Output Format

- `format: ['esm']` - ECMAScript modules only
- **Why ESM only**: Modern bundlers handle ESM natively, smaller output, tree-shakeable

#### Output Directory

- `outDir: 'dist'` - Build output goes to `dist/`
- `clean: true` - Removes `dist/` before each build (prevents stale files)

#### Type Declarations

- `dts: { resolve: true }` - Generate TypeScript declarations
- **resolve: true** - Resolves type imports so consumers don't need our dependencies

#### Target Environment

- `target: 'es2022'` - Modern JavaScript features (async/await, optional chaining, etc.)
- `platform: 'browser'` - Browser-specific optimizations, no Node.js APIs

#### Build Options

- `minify: false` - Keep code readable (users can minify in their builds)
- `sourcemap: true` - Generate source maps for debugging

#### External Dependencies

- `external: ['svelte']` - Don't bundle Svelte (it's a peer dependency)
- **Why external**: Prevents duplicate Svelte runtime, allows version flexibility

### Build Scripts

In `package.json`:

```json
{
	"scripts": {
		"build": "tsdown",
		"dev": "tsdown --watch"
	}
}
```

- `bun run build` - One-time build for production
- `bun run dev` - Watch mode for development (rebuilds on file changes)

### Build Output

After running `bun run build`, the `dist/` directory contains:

```
dist/
├── index.js           # Compiled JavaScript (ESM)
├── index.js.map       # Source map
├── index.d.ts         # TypeScript declarations
└── index.d.ts.map     # Declaration source map
```

### Package Exports

In `package.json`, we configure how consumers import our package:

```json
{
	"type": "module",
	"main": "./dist/index.js",
	"module": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.js"
		}
	}
}
```

- `type: "module"` - Package is ESM
- `exports` - Modern way to define package entry points
- Both `main` and `exports` for backwards compatibility

### Development Workflow

1. **Make changes** - Edit files in `src/`
2. **Type check** - `bun run typecheck` (runs `tsc --noEmit`)
3. **Format** - `bun run format` (runs `dprint fmt`)
4. **Build** - `bun run build` (runs `tsdown`)
5. **Publish** - `npm publish` (runs `prepublishOnly` hook automatically)

### Pre-publish Hook

The `prepublishOnly` script runs automatically before `npm publish`:

```json
"prepublishOnly": "bun run format && bun run typecheck && bun run build"
```

This ensures:

1. All code is formatted consistently
2. No type errors exist
3. Fresh build is created
4. Package is ready for distribution

### Troubleshooting

#### Build fails with "Cannot find module"

- Check `src/index.ts` exports all public APIs
- Verify imports use correct file extensions or path resolution

#### Type declarations missing exports

- Ensure types are exported in source files
- Check `tsconfig.json` has `declaration: true`

#### Consumers can't import from package

- Verify `package.json` exports field is correct
- Check `main`, `module`, and `types` fields point to correct files

#### Build is slow

- Use `bun run dev` for watch mode during development
- Consider excluding test files from compilation

### Integration with TypeScript

tsdown uses the `tsconfig.json` for type checking and declaration generation:

```json
{
	"compilerOptions": {
		"declaration": true,
		"declarationMap": true,
		"outDir": "./dist"
	}
}
```

- `declaration: true` - Generate `.d.ts` files
- `declarationMap: true` - Generate `.d.ts.map` for "Go to Definition" in IDEs
- `outDir: "./dist"` - Output directory (matches tsdown config)

### Why Not Other Build Tools?

**Why not Vite?**

- Vite is designed for applications, not libraries
- Library mode adds complexity we don't need
- tsdown is simpler for pure library builds

**Why not Rollup?**

- More configuration required
- Need separate TypeScript plugins
- tsdown has better TypeScript integration out of the box

**Why not esbuild directly?**

- esbuild doesn't generate type declarations
- Would need separate `tsc` run
- tsdown abstracts this complexity

**Why not tsc only?**

- tsc doesn't bundle or optimize
- Slower than tsdown
- No minification support

### Future Considerations

If we need to:

- **Support CJS**: Add `format: ['esm', 'cjs']` to tsdown config
- **Multiple entry points**: Add more entries to `entry` array
- **Minified build**: Set `minify: true` in tsdown config
- **Different targets**: Adjust `target` for older browser support
