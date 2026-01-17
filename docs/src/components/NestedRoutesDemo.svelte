<script lang='ts'>
	import { fade } from 'svelte/transition'
	import Dashboard from './nested-demo-pages/Dashboard.svelte'
	import Profile from './nested-demo-pages/Profile.svelte'
	import Settings from './nested-demo-pages/Settings.svelte'

	let currentPage = $state<'root' | 'dashboard' | 'profile' | 'settings'>(
		'root',
	)
	let key = $state(0)

	function navigateTo(page: 'root' | 'dashboard' | 'profile' | 'settings') {
		currentPage = page
		key++
	}
</script>

<div class='demo-nested'>
	<nav>
		<button
			onclick={() => navigateTo('root')}
			style="background: {currentPage === 'root' ? '#ff3e00' : '#333'}"
		>
			Root
		</button>
		<button
			onclick={() => navigateTo('dashboard')}
			style="background: {currentPage === 'dashboard' ? '#ff3e00' : '#333'}"
		>
			Dashboard
		</button>
		<button
			onclick={() => navigateTo('profile')}
			style="background: {currentPage === 'profile' ? '#ff3e00' : '#333'}"
		>
			Profile
		</button>
		<button
			onclick={() => navigateTo('settings')}
			style="background: {currentPage === 'settings' ? '#ff3e00' : '#333'}"
		>
			Settings
		</button>
	</nav>

	<div class='demo-content'>
		<p>
			Current path: <code>/{currentPage === 'root' ? '' : currentPage}</code>
		</p>

		{#if currentPage !== 'root'}
			<div class='layout'>
				<div class='sidebar'>
					<h3>Layout Sidebar</h3>
					<p>This sidebar persists across nested routes!</p>
				</div>
				{#key key}
					<div class='content' in:fade={{ duration: 300 }}>
						{#if currentPage === 'dashboard'}
							<Dashboard />
						{:else if currentPage === 'profile'}
							<Profile />
						{:else if currentPage === 'settings'}
							<Settings />
						{/if}
					</div>
				{/key}
			</div>
		{:else}
			<p style='margin-top: 1rem; color: #aaa;'>
				Select a page to see the layout with sidebar.
			</p>
		{/if}
	</div>
</div>

<style>
	.demo-nested {
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

	.layout {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 1rem;
		margin-top: 1rem;
	}

	.sidebar {
		background: #0f0f0f;
		padding: 1rem;
		border-radius: 0.25rem;
	}

	.sidebar h3 {
		margin-top: 0;
		color: #ff3e00;
		font-size: 0.875rem;
	}

	.sidebar p {
		font-size: 0.75rem;
		color: #aaa;
	}

	.content {
		background: #0f0f0f;
		padding: 1rem;
		border-radius: 0.25rem;
	}

	code {
		background: #0f0f0f;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-family: monospace;
	}
</style>
