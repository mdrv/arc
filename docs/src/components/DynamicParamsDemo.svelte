<script lang='ts'>
	import { fade } from 'svelte/transition'
	import ProductDetail from './params-demo-pages/ProductDetail.svelte'
	import UserDetail from './params-demo-pages/UserDetail.svelte'
	import UserList from './params-demo-pages/UserList.svelte'

	type PageState =
		| { type: 'list' }
		| { type: 'user'; id: string }
		| { type: 'product'; category: string; id: string }

	let currentPage = $state<PageState>({ type: 'list' })
	let key = $state(0)

	function navigateTo(page: PageState) {
		currentPage = page
		key++
	}

	function getPath(): string {
		if (currentPage.type === 'list') return '/'
		if (currentPage.type === 'user') return `/user/${currentPage.id}`
		return `/product/${currentPage.category}/${currentPage.id}`
	}

	function getParams(): Record<string, string> | null {
		if (currentPage.type === 'list') return null
		if (currentPage.type === 'user') return { id: currentPage.id }
		return { category: currentPage.category, id: currentPage.id }
	}
</script>

<div class='demo-params'>
	<nav>
		<button
			onclick={() => navigateTo({ type: 'list' })}
			style="background: {currentPage.type === 'list' ? '#ff3e00' : '#333'}"
		>
			Users
		</button>
		<button
			onclick={() => navigateTo({ type: 'user', id: '123' })}
			style="background: {currentPage.type === 'user' && currentPage.id === '123' ? '#ff3e00' : '#333'}"
		>
			User 123
		</button>
		<button
			onclick={() => navigateTo({ type: 'user', id: '456' })}
			style="background: {currentPage.type === 'user' && currentPage.id === '456' ? '#ff3e00' : '#333'}"
		>
			User 456
		</button>
		<button
			onclick={() =>
			navigateTo({ type: 'product', category: 'electronics', id: '789' })}
			style="background: {currentPage.type === 'product' ? '#ff3e00' : '#333'}"
		>
			Product
		</button>
	</nav>

	<div class='demo-content'>
		<p>Current path: <code>{getPath()}</code></p>
		{#if getParams()}
			<p>Params: <code>{JSON.stringify(getParams())}</code></p>
		{/if}
		<div class='page-container'>
			{#key key}
				<div in:fade={{ duration: 300 }}>
					{#if currentPage.type === 'list'}
						<UserList />
					{:else if currentPage.type === 'user'}
						<UserDetail params={{ id: currentPage.id }} />
					{:else if currentPage.type === 'product'}
						<ProductDetail
							params={{ category: currentPage.category, id: currentPage.id }}
						/>
					{/if}
				</div>
			{/key}
		</div>
	</div>
</div>

<style>
	.demo-params {
		padding: 1rem;
	}

	nav {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
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
