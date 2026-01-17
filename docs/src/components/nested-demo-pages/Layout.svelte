<script lang='ts'>
	import { Router } from '@mdrv/arc'
</script>

<div class='layout'>
	<div class='sidebar'>
		<h3>Layout Sidebar</h3>
		<p>This sidebar persists across nested routes!</p>
	</div>
	<div class='content'>
		<Router />
	</div>
</div>

<style>
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
</style>
