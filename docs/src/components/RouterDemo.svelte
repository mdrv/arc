<script lang='ts'>
	import { fade } from 'svelte/transition'
	import About from './demo-pages/About.svelte'
	import Contact from './demo-pages/Contact.svelte'
	import Home from './demo-pages/Home.svelte'

	let currentPage = $state<'home' | 'about' | 'contact'>('home')
	let key = $state(0)

	const pages = {
		home: { component: Home, path: '/' },
		about: { component: About, path: '/about' },
		contact: { component: Contact, path: '/contact' },
	}

	function navigateTo(page: 'home' | 'about' | 'contact') {
		currentPage = page
		key++
	}
</script>

<div class='demo-router'>
	<nav>
		<button
			onclick={() => navigateTo('home')}
			style="background: {currentPage === 'home' ? '#ff3e00' : '#333'}"
		>
			Home
		</button>
		<button
			onclick={() => navigateTo('about')}
			style="background: {currentPage === 'about' ? '#ff3e00' : '#333'}"
		>
			About
		</button>
		<button
			onclick={() => navigateTo('contact')}
			style="background: {currentPage === 'contact' ? '#ff3e00' : '#333'}"
		>
			Contact
		</button>
	</nav>

	<div class='demo-content'>
		<p>Current path: <code>{pages[currentPage].path}</code></p>
		<div class='page-container'>
			{#key key}
				<div in:fade={{ duration: 300 }}>
					{#if currentPage === 'home'}
						<Home />
					{:else if currentPage === 'about'}
						<About />
					{:else if currentPage === 'contact'}
						<Contact />
					{/if}
				</div>
			{/key}
		</div>
	</div>
</div>

<style>
	.demo-router {
		padding: 1rem;
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
