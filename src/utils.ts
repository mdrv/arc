import type { Component } from 'svelte'
import type {
	ComponentTree,
	ComponentTreeNode,
	Hooks,
	LayoutComponent,
	LazyRouteComponent,
	Location,
	RouteComponent,
	Routes,
} from './types'

/**
 * Get current location information
 * SSR-safe: returns default values when running on server
 */
export function getLocation(): Location {
	if (typeof globalThis.location === 'undefined') {
		// SSR fallback - return safe defaults
		return {
			pathname: '/',
			search: '',
			state: null,
			hash: '',
		}
	}
	return {
		pathname: globalThis.location.pathname,
		search: globalThis.location.search,
		state: history.state,
		hash: globalThis.location.hash,
	}
}

/**
 * Check if a component is lazy-loaded
 */
export function isLazyImport(input: unknown): input is LazyRouteComponent {
	return (
		typeof input === 'function'
		&& !!/\(\)\s?=>\s?import\(.*\)/.test(String(input))
	)
}

/**
 * Resolve a single route component (lazy or eager)
 */
export async function resolveRouteComponent(
	input:
		| RouteComponent
		| [RouteComponent, { submodule?: string; params?: string[] }],
): Promise<Component | [Component, { submodule?: string; params?: string[] }]> {
	if (typeof input === 'function' && isLazyImport(input)) {
		const module = await input()
		return module.default
	}

	if (Array.isArray(input)) {
		if (isLazyImport(input[0])) {
			const module = await input[0]()
			return [module[input[1].submodule ?? 'default'], input[1]]
		}
		return [input[0] as Component, input[1]]
	}

	return input as Component
}

/**
 * Resolve multiple route components
 */
export async function resolveRouteComponents(
	input: (
		| RouteComponent
		| [RouteComponent, { submodule?: string; params?: string[] }]
	)[],
): Promise<
	(Component | [Component, { submodule?: string; params?: string[] }])[]
> {
	return Promise.all(input.map(c => resolveRouteComponent(c)))
}

/**
 * Join path segments ensuring no double slashes
 */
export function join(...parts: string[]): string {
	let result = ''
	for (let part of parts) {
		if (!part.startsWith('/')) {
			result += '/'
		}
		if (part.endsWith('/')) {
			part = part.slice(0, -1)
		}
		result += part
	}
	return result
}

/**
 * Construct a path by replacing params in the template
 */
export function constructPath(
	path: string,
	params: Record<string, string>,
): string {
	if (!params) return path

	let result = path
	for (const key in params) {
		result = result.replace(`:${key}`, params[key])
	}
	return result
}

/**
 * Check if a path is currently active
 */
export function isActive(
	pathname: string,
	params?: Record<string, string>,
): boolean {
	return compare((a, b) => a === b, pathname, params)
}

/**
 * Check if current path starts with the given path
 */
isActive.startsWith = (
	pathname: string,
	params?: Record<string, string>,
): boolean => {
	return compare((a, b) => a.startsWith(b), pathname, params)
}

/**
 * Compare current pathname with given pathname
 */
function compare(
	compareFn: (a: string, b: string) => boolean,
	pathname: string,
	params?: Record<string, string>,
): boolean {
	const currentPathname = globalThis.location.pathname

	if (!pathname.includes(':')) {
		return compareFn(currentPathname, pathname)
	}

	if (params) {
		return compareFn(currentPathname, constructPath(pathname, params))
	}

	const pathParts = pathname.split('/').slice(1)
	const routeParts = currentPathname.split('/').slice(1)

	for (const [index, pathPart] of pathParts.entries()) {
		const routePart = routeParts[index]
		if (pathPart.startsWith(':')) {
			continue
		}
		return compareFn(pathPart, routePart)
	}

	return false
}

/**
 * Get all route paths from routes definition
 */
export function getRoutePaths(routes: Routes): string[] {
	const paths: string[] = []

	for (const [key, value] of Object.entries(routes)) {
		if (key === 'layout' || key === 'hooks') continue

		if (
			typeof value === 'object'
			&& !Array.isArray(value)
			&& typeof value !== 'function'
		) {
			paths.push(
				...getRoutePaths(value).map(path => {
					if (path === '*') return key + '/*'
					if (path === '/') return key
					return key + path
				}),
			)
		} else {
			paths.push(key)
		}
	}

	return paths
}

/**
 * Validate routes for common issues
 */
export function validateRoutes(routes: Routes): void {
	const paths = getRoutePaths(routes)
	const wildcardPaths = paths.filter(path => path.endsWith('*'))

	for (const wildcardPath of wildcardPaths) {
		const parentPath = wildcardPath.slice(0, -1)
		const dynamicPath = paths.find(
			p =>
				p !== '/'
				&& !p.endsWith('*')
				&& p.startsWith(parentPath === '' ? '/:' : parentPath)
				&& p.match(/:[^/]*$/g),
		)

		if (dynamicPath) {
			console.warn(
				`[Router] Wildcard route "${wildcardPath}" should not be at the same level as dynamic route "${dynamicPath}"`,
			)
		}
	}
}

/**
 * Sort routes by priority (static > dynamic > wildcard)
 */
export function sortRoutes(routes: string[]): string[] {
	return routes.toSorted(
		(a: string, b: string) => getRoutePriority(a) - getRoutePriority(b),
	)
}

/**
 * Get route priority for sorting
 */
function getRoutePriority(route: string): number {
	if (route === '' || route === '/') return 1
	if (route.includes('*')) return 4
	if (route.includes(':')) return 3
	return 2
}

/**
 * Match a pathname against routes and extract params
 */
export function matchRoute(
	pathname: string,
	routes: Routes,
): {
	match: RouteComponent | undefined
	layouts: LayoutComponent[]
	hooks: Hooks[]
	params: Record<string, string>
	breakFromLayouts: boolean
} {
	// Remove trailing slash
	if (pathname.length > 1 && pathname.endsWith('/')) {
		pathname = pathname.slice(0, -1)
	}

	const pathParts = pathname.split('/').slice(1)
	const allRoutes = sortRoutes(
		Object.keys(routes).filter(k => k !== 'layout' && k !== 'hooks'),
	)

	let match: RouteComponent | undefined
	let layouts: LayoutComponent[] = []
	const hooks: Hooks[] = []
	let params: Record<string, string> = {}
	let breakFromLayouts = false

	outer: for (const route of allRoutes) {
		const routeParts = route.split('/')
		if (routeParts[0] === '') routeParts.shift()

		for (let [index, routePart] of routeParts.entries()) {
			breakFromLayouts = routePart.startsWith('(') && routePart.endsWith(')')
			if (breakFromLayouts) {
				routePart = routePart.slice(1, -1)
			}

			const pathPart = pathParts[index]

			// Handle dynamic params
			if (routePart.startsWith(':')) {
				params[routePart.slice(1)] = pathPart
			} // Handle wildcards
			else if (routePart.startsWith('*')) {
				const param = routePart.slice(1)
				if (param) {
					params[param] = pathParts.slice(index).join('/')
				}

				if (breakFromLayouts) {
					routePart = `(${routePart})`
				} else if ('layout' in routes && routes.layout) {
					layouts.push(routes.layout)
				}

				const resolvedPath = ('/' + routeParts.join('/')) as keyof Routes
				match = routes[resolvedPath] as RouteComponent
				break outer
			} // Must match exactly
			else if (routePart !== pathPart) {
				break
			}

			// Not at the end yet, continue
			if (index !== routeParts.length - 1) {
				continue
			}

			const routeMatch = routes[
				('/' + routeParts.join('/')) as keyof Routes
			] as RouteComponent

			if (!breakFromLayouts && 'layout' in routes && routes.layout) {
				layouts.push(routes.layout)
			}

			if ('hooks' in routes && routes.hooks) {
				hooks.push(routes.hooks)
			}

			// Direct match
			if (typeof routeMatch === 'function' || Array.isArray(routeMatch)) {
				if (routeParts.length === pathParts.length) {
					match = routeMatch
					break outer
				}
				continue
			}

			// Nested routes
			const nestedPathname = '/' + pathParts.slice(index + 1).join('/')
			const result = matchRoute(nestedPathname, routeMatch)

			if (result) {
				match = result.match
				params = { ...params, ...result.params }
				hooks.push(...result.hooks)

				if (result.breakFromLayouts) {
					layouts = []
				} else {
					layouts.push(...result.layouts)
				}
			}
			break outer
		}
	}

	return { match, layouts, hooks, params, breakFromLayouts }
}

/**
 * Calculate the component tree for dual-tree rendering
 */
export function calculateTree(args: {
	prev: ComponentTree['value']
	next: (Component | [Component, { submodule?: string; params?: string[] }])[]
	cycle: 'ab' | 'ba'
	params: Record<string, string>
	mountedComponents: Record<string, any>
}): ComponentTree['value'] {
	const { prev, next, cycle, params, mountedComponents } = args
	const [afterCycle, beforeCycle] = cycle.split('') as ['a' | 'b', 'a' | 'b']

	const keys = prev[beforeCycle]?.map(item => item.key) ?? []

	const tree = {
		[beforeCycle]: prev[beforeCycle],
		[afterCycle]: next.map((item, idx) => {
			if (Array.isArray(item)) {
				return {
					C: item[0],
					key: keys[idx] ?? 0,
					params: 'params' in item[1]
						? Object.fromEntries(item[1].params!.map(p => [p, params[p]]))
						: undefined,
				}
			}
			return {
				C: item,
				key: keys[idx] ?? 0,
			}
		}),
		eq: -1,
	} as ComponentTree['value']

	// Find equality point
	const max = Math.min(tree.a.length, tree.b.length)
	let i = -1

	while (++i < max) {
		if (
			tree[beforeCycle][i].C !== tree[afterCycle][i].C
			|| tree[beforeCycle][i].params !== tree[afterCycle][i].params
		) {
			tree[afterCycle][i].key++
			i++
			break
		}
		tree.eq = i
	}

	// Increment keys for remaining components
	i--
	while (++i < tree[afterCycle].length) {
		tree[afterCycle][i].key++
	}

	// Initialize mounted components
	for (let idx = 0; idx < tree[afterCycle].length; idx++) {
		const { key } = tree[afterCycle][idx]
		mountedComponents[`${idx} ${key}`] = {}
	}

	return tree
}

/**
 * Get component keys for in/out transitions
 */
export function getCompKeys(
	tree: ComponentTree['value'],
	cycle: string,
): { in: string[]; out: string[] } {
	const [afterCycle, beforeCycle] = cycle.split('') as
		| ['a' | 'b', 'a' | 'b']
		| ['a']
		| ['b']
	const keys: { in: string[]; out: string[] } = { in: [], out: [] }

	if (afterCycle) {
		for (let i = tree.eq + 1; i < tree[afterCycle].length; i++) {
			keys.in.push(`${i} ${tree[afterCycle][i]!.key}`)
		}
	}

	if (beforeCycle) {
		for (let i = tree.eq + 1; i < tree[beforeCycle].length; i++) {
			keys.out.push(`${i} ${tree[beforeCycle][i]!.key}`)
		}
	}

	return keys
}

/**
 * Clean up mounted components that are no longer in use
 */
export function cleanMountedComponents(
	mountedComponents: Record<string, any>,
	componentTree: ComponentTree,
): void {
	const toClean = Object.entries(mountedComponents)
		.filter(([k]) => {
			const [depth, key] = k.split(' ')
			const depthNum = parseInt(depth)
			const keyNum = parseInt(key)

			if (
				keyNum
					< Math.min(
						componentTree.value.a[depthNum]?.key ?? Infinity,
						componentTree.value.b[depthNum]?.key ?? Infinity,
					)
			) {
				return true
			}
			return false
		})
		.map(([k]) => k)

	for (const key of toClean) {
		delete mountedComponents[key]
	}
}

/**
 * Setup preloading on hover for links
 * Only runs in browser environment
 */
export function preloadOnHover(routes: Routes): void {
	if (typeof document === 'undefined') return

	const linkSet = new Set<Element>()

	const observer = new MutationObserver(() => {
		const links = document.querySelectorAll('a[data-preload]')

		for (const link of links) {
			if (linkSet.has(link)) continue
			linkSet.add(link)

			link.addEventListener('mouseenter', function callback() {
				link.removeEventListener('mouseenter', callback)
				const href = link.getAttribute('href')
				if (!href) return

				const { match, layouts } = matchRoute(href, routes)
				resolveRouteComponents(match ? [...layouts, match] : layouts)
			})
		}
	})

	observer.observe(document.body, {
		subtree: true,
		childList: true,
	})
}
