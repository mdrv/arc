<script lang='ts'>
	import { fly } from 'svelte/transition'
	import Step1 from './direction-demo-pages/Step1.svelte'
	import Step2 from './direction-demo-pages/Step2.svelte'
	import Step3 from './direction-demo-pages/Step3.svelte'

	let currentStep = $state<1 | 2 | 3>(1)
	let direction = $state<'forward' | 'backward'>('forward')
	let key = $state(0)

	function navigateTo(step: 1 | 2 | 3) {
		direction = step > currentStep ? 'forward' : 'backward'
		currentStep = step
		key++
	}
</script>

<div class='demo-direction'>
	<div class='status'>
		<p>
			Navigation direction:
			<code
				style="background: {direction === 'forward' ? '#ff3e00' : '#0066ff'}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem;"
			>{direction}</code>
		</p>
	</div>

	<nav>
		<button
			onclick={() => navigateTo(1)}
			style="background: {currentStep === 1 ? '#ff3e00' : '#333'}"
		>
			Step 1
		</button>
		<button
			onclick={() => navigateTo(2)}
			style="background: {currentStep === 2 ? '#ff3e00' : '#333'}"
		>
			Step 2
		</button>
		<button
			onclick={() => navigateTo(3)}
			style="background: {currentStep === 3 ? '#ff3e00' : '#333'}"
		>
			Step 3
		</button>
	</nav>

	<div class='demo-content'>
		<p>Current path: <code>/step{currentStep}</code></p>
		<p style='margin-top: 0.5rem; color: #aaa; font-size: 0.875rem;'>
			The slide direction changes based on whether you're moving forward or
			backward through the steps!
		</p>
		<div class='page-container'>
			{#key key}
				<div
					in:fly={{
						x: direction === 'forward' ? 100 : -100,
						duration: 300,
					}}
				>
					{#if currentStep === 1}
						<Step1 />
					{:else if currentStep === 2}
						<Step2 />
					{:else}
						<Step3 />
					{/if}
				</div>
			{/key}
		</div>
	</div>
</div>

<style>
	.demo-direction {
		padding: 1rem;
	}

	.status {
		margin-bottom: 1rem;
		padding: 0.75rem;
		background: #0f0f0f;
		border-radius: 0.25rem;
	}

	.status p {
		margin: 0;
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
