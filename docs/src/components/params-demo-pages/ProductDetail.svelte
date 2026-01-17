<script lang='ts'>
	import type { Snippet } from 'svelte'

	interface Props {
		params: { category: string; id: string }
	}

	let { params }: Props = $props()
</script>

<div class='page'>
	<h2>Product Details</h2>
	<p>Multiple route parameters:</p>
	<ul style='margin-top: 0.5rem;'>
		<li>Category: <code>{params.category}</code></li>
		<li>Product ID: <code>{params.id}</code></li>
	</ul>
	<div style='margin-top: 1rem; padding: 1rem; background: #0f0f0f; border-radius: 0.25rem;'>
		<p style='margin: 0 0 0.5rem 0;'>
			<strong>Category:</strong> {params.category}
		</p>
		<p style='margin: 0;'><strong>Product ID:</strong> {params.id}</p>
	</div>
	<p style='margin-top: 1rem; color: #aaa; font-size: 0.875rem;'>
		The route <code>/product/:category/:id</code> provides both <code
		>params.category</code> and <code>params.id</code>
	</p>
</div>

<style>
	.page {
		padding: 1rem;
		margin-top: 1rem;
	}

	h2 {
		margin-top: 0;
		color: #ff3e00;
	}

	code {
		background: #1a1a1a;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-family: monospace;
	}
</style>
