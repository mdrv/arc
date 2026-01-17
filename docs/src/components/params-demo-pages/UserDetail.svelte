<script lang='ts'>
	import type { Snippet } from 'svelte'

	interface Props {
		params: { id: string }
	}

	let { params }: Props = $props()

	const users: Record<string, { name: string; email: string; role: string }> = {
		'123': { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		'456': { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
	}

	const user = users[params.id]
		|| { name: 'Unknown', email: 'N/A', role: 'N/A' }
</script>

<div class='page'>
	<h2>User Details</h2>
	<p>User ID from route: <code>{params.id}</code></p>
	<div style='margin-top: 1rem; padding: 1rem; background: #0f0f0f; border-radius: 0.25rem;'>
		<p style='margin: 0 0 0.5rem 0;'><strong>Name:</strong> {user.name}</p>
		<p style='margin: 0 0 0.5rem 0;'><strong>Email:</strong> {user.email}</p>
		<p style='margin: 0;'><strong>Role:</strong> {user.role}</p>
	</div>
	<p style='margin-top: 1rem; color: #aaa; font-size: 0.875rem;'>
		The <code>:id</code> parameter in the route <code>/user/:id</code> is
		accessible via <code>params.id</code>
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
