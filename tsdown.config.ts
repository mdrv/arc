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
