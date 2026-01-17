import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	site: 'https://mdrv.github.io',
	base: '/arc',
	integrations: [
		svelte({
			compilerOptions: {
				runes: true,
			},
		}),
	],
	vite: {
		resolve: {
			alias: {
				'@mdrv/arc': path.resolve(__dirname, '../src/index.ts'),
			},
		},
	},
	build: {
		assets: '_astro',
	},
})
