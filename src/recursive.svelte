<!--
@component
Recursive component renderer for nested routes with dual-tree rendering
-->
<script lang="ts">
import { cycle, mountedComponents } from './create.svelte'
import type { ComponentTree } from './types'

type Props = {
	tree: ComponentTree['value']
	depth?: number
}

const { tree, depth = 0 }: Props = $props()

// Determine which components to render at this depth
const firstComponents = $derived.by(() => {
	if (tree.a.length === 0 && tree.b.length === 0) {
		return []
	}

	// If we're within the equality range, only show one component
	if (depth <= tree.eq) {
		const currentCycle = cycle.value.slice(0, 1) as 'a' | 'b'
		return [{ ...tree[currentCycle][depth], ab: 'a' }]
	}

	// During transition, show components from both trees
	const components = cycle.value
		.split('')
		.map((ab) => ({ ab, obj: tree[ab as 'a' | 'b'][depth] }))
		.filter((x, idx, arr) => {
			// Filter out undefined and duplicates
			return x.obj && arr.findIndex((item) => item.obj === x.obj) === idx
		})
		.map((x) => ({
			ab: x.ab,
			C: x.obj.C,
			key: x.obj.key,
			params: x.obj.params,
		}))

	return components as {
		ab: 'a' | 'b'
		C: any
		key: number
		params?: Record<string, string>
	}[]
})

// Create tree for next depth level
const restTree = $derived({
	a: tree.a?.slice(1),
	b: tree.b?.slice(1),
	eq: tree.eq - 1,
})
</script>

{#each firstComponents as { C, ab, key, params } (`${depth} ${key} ${JSON.stringify(params)}`)}
	<C bind:this={mountedComponents[`${depth} ${key}`]}>
		{#if restTree.a?.length > 0 || restTree.b?.length > 0}
			<svelte:self
				tree={depth <= tree.eq
					? restTree
					: { [ab]: restTree[ab], [ab === 'a' ? 'b' : 'a']: [], eq: tree.eq - 1 }}
				depth={depth + 1}
			/>
		{/if}
	</C>
{/each}
