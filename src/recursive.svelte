<!--
@component
Recursive component renderer for nested routes with dual-tree rendering
-->
<script lang='ts'>
	import { cycle, mountedComponents } from './create.svelte'
	import Recursive from './recursive.svelte'
	import type { ComponentTree, ComponentTreeNode } from './types'

	type Props = {
		tree: ComponentTree['value']
		depth?: number
	}

	type FirstComponent = {
		ab: 'a' | 'b'
		C: ComponentTreeNode['C']
		key: ComponentTreeNode['key']
		params?: ComponentTreeNode['params']
	}

	const { tree, depth = 0 }: Props = $props()

	// Determine which components to render at this depth
	const firstComponents = $derived.by<FirstComponent[]>(() => {
		if (tree.a.length === 0 && tree.b.length === 0) {
			return []
		}

		// If we're within the equality range, only show one component
		if (depth <= tree.eq) {
			const currentCycle = cycle.value.slice(0, 1) as 'a' | 'b'
			return [{ ...tree[currentCycle][depth], ab: currentCycle }]
		}

		// During transition, show components from both trees
		const candidates = cycle.value
			.split('')
			.map((ab) => ({
				ab: ab as 'a' | 'b',
				obj: tree[ab as 'a' | 'b'][depth],
			}))

		const components = candidates
			.filter(
				(
					component,
					idx,
					arr,
				): component is { ab: 'a' | 'b'; obj: ComponentTreeNode } => {
					if (!component.obj) {
						return false
					}
					return arr.findIndex((item) => item.obj === component.obj) === idx
				},
			)
			.map((x) => ({
				ab: x.ab,
				C: x.obj.C,
				key: x.obj.key,
				params: x.obj.params,
			}))

		return components
	})

	// Create tree for next depth level
	const restTree = $derived<ComponentTree['value']>({
		a: tree.a.slice(1),
		b: tree.b.slice(1),
		eq: tree.eq - 1,
	})

	const getNextTree = (ab: 'a' | 'b'): ComponentTree['value'] => {
		if (depth <= tree.eq) {
			return restTree
		}

		return {
			a: ab === 'a' ? restTree.a : [],
			b: ab === 'b' ? restTree.b : [],
			eq: tree.eq - 1,
		}
	}
</script>

{#each firstComponents as
	{ C, ab, key, params }
	(`${depth} ${key} ${JSON.stringify(params)}`)
}
	<C bind:this={mountedComponents[`${depth} ${key}`]}>
		{#if restTree.a.length > 0 || restTree.b.length > 0}
			<Recursive tree={getNextTree(ab)} depth={depth + 1} />
		{/if}
	</C>
{/each}
