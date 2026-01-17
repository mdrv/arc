<script lang='ts'>
	import { fade, fly, scale } from 'svelte/transition'
	import PageA from './transition-demo-pages/PageA.svelte'
	import PageB from './transition-demo-pages/PageB.svelte'

	let currentPage = $state<'a' | 'b'>('a')
	let selectedTransition = $state('fade')
	let key = $state(0)

	function navigateTo(page: 'a' | 'b') {
		currentPage = page
		key++ // Force re-render with transition
	}

	let transition = $derived.by(() => {
		switch (selectedTransition) {
			case 'fade':
				return { fn: fade, params: { duration: 300 } }
			case 'slide':
				return { fn: fly, params: { x: 50, duration: 300 } }
			case 'scale':
				return { fn: scale, params: { duration: 300, start: 0.95 } }
			case 'material':
				return { fn: fly, params: { y: 20, duration: 300 } }
			default:
				return { fn: fade, params: { duration: 300 } }
		}
	})
</script>

<div class='demo-transitions'>
	<div class='controls'>
		<label style='color: #aaa; margin-right: 1rem;'>
			Transition Type:
			<select
				bind:value={selectedTransition}
				style='margin-left: 0.5rem; padding: 0.25rem 0.5rem; background: #1a1a1a; color: white; border: 1px solid #444; border-radius: 0.25rem;'
			>
				<option value='fade'>Fade</option>
				<option value='slide'>Slide</option>
				<option value='scale'>Scale</option>
				<option value='material'>Material</option>
			</select>
		</label>
	</div>

	<nav>
		<button
			onclick={() => navigateTo('a')}
			style="background: {currentPage === 'a' ? '#ff3e00' : '#333'}"
		>
			Page A
		</button>
		<button
			onclick={() => navigateTo('b')}
			style="background: {currentPage === 'b' ? '#ff3e00' : '#333'}"
		>
			Page B
		</button>
	</nav>

	<div class='demo-content'>
		<p>Current path: <code>/{currentPage}</code></p>
		<p>Transition: <code>{selectedTransition}</code></p>
		<div class='page-container'>
			{#key key}
				<div in:transition.fn={transition.params}>
					{#if currentPage === 'a'}
						<PageA />
					{:else}
						<PageB />
					{/if}
				</div>
			{/key}
		</div>
	</div>
</div>

<style>
	.demo-transitions {
		padding: 1rem;
	}

	.controls {
		margin-bottom: 1rem;
	}

	nav {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		color: white;
		cursor: pointer;
		font-size: 0.875rem;
		transition: opacity 0.2s;
	}

	button:hover {
		opacity: 0.9;
	}

	.demo-content {
		background: #1a1a1a;
		padding: 1rem;
		border-radius: 0.25rem;
		min-height: 200px;
	}

	.page-container {
		margin-top: 1rem;
	}

	code {
		background: #0f0f0f;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-family: monospace;
	}
</style>
