<script lang="ts">
	import { createRouter, transitionPresets } from '@mdsv/arc'

	const Home = () => import('./demo-pages/Home.svelte')
	const About = () => import('./demo-pages/About.svelte')
	const Contact = () => import('./demo-pages/Contact.svelte')

	const { navigate, route } = createRouter({
		routes: {
			'/': Home,
			'/about': About,
			'/contact': Contact,
		},
	})

	function handleNavigate(path: string) {
		navigate(path as any, {
			transition: transitionPresets.fade(),
		})
	}
</script>

<div class="demo-router">
	<nav>
		<button on:click={() => handleNavigate('/')} style="background: {route.pathname === '/' ? '#ff3e00' : '#333'}">
			Home
		</button>
		<button on:click={() => handleNavigate('/about')} style="background: {route.pathname === '/about' ? '#ff3e00' : '#333'}">
			About
		</button>
		<button on:click={() => handleNavigate('/contact')} style="background: {route.pathname === '/contact' ? '#ff3e00' : '#333'}">
			Contact
		</button>
	</nav>

	<div class="demo-content">
		<p>Current path: <code>{route.pathname}</code></p>
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

	code {
		background: #0f0f0f;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-family: monospace;
	}
</style>
