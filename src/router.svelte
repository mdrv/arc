<!--
@component
Main router component that sets up navigation listeners and renders the component tree
-->
<script lang='ts'>
	import { onMount } from 'svelte'
	import {
		base,
		componentTree,
		onGlobalClick,
		onNavigate,
	} from './create.svelte'
	import Recursive from './recursive.svelte'
	import { join } from './utils'

	type Props = {
		/**
		 * Base path for the router (optional)
		 * @example "/app" or "app"
		 */
		base?: string
	}

	const { base: basename }: Props = $props()

	// Setup base path
	if (basename) {
		base.name = (basename.startsWith('/') ? '' : '/') + basename
		const url = new URL(globalThis.location.href)

		if (!url.pathname.startsWith(base.name)) {
			url.pathname = join(base.name, url.pathname)
			history.replaceState(history.state || {}, '', url.href)
		}
	}

	// Setup event listeners
	$effect(() => {
		const handlePopState = () => onNavigate()
		const handleClick = (e: Event) => onGlobalClick(e)

		globalThis.addEventListener('popstate', handlePopState)
		globalThis.addEventListener('click', handleClick)

		return () => {
			globalThis.removeEventListener('popstate', handlePopState)
			globalThis.removeEventListener('click', handleClick)
		}
	})

	// Initial navigation
	onMount(() => {
		onNavigate()
	})
</script>

<Recursive tree={componentTree.value} />
