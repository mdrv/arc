import { tick } from 'svelte'
import type { Action } from 'svelte/action'
import { SvelteURLSearchParams } from 'svelte/reactivity'
import {
	detectNavigationDirection,
	startViewTransition,
	supportsViewTransitions,
} from './transitions'
import type {
	ComponentTree,
	Location,
	NavigateOptions,
	Phase,
	RouterApi,
	Routes,
	TransitionConfig,
	ViewTransition,
} from './types'
import {
	calculateTree,
	cleanMountedComponents,
	constructPath,
	getCompKeys,
	getLocation,
	isActive,
	join,
	matchRoute,
	preloadOnHover,
	resolveRouteComponents,
	validateRoutes,
} from './utils'

// ============================================================================
// Global State
// ============================================================================

let routes: Routes

export const componentTree: ComponentTree = $state({
	value: { a: [], b: [], eq: 0 },
})

export const cycle: { value: 'a' | 'ba' | 'b' | 'ab' } = $state({ value: 'a' })

export const params: { value: Record<string, string> } = $state({ value: {} })

export const phase: { value: Phase } = $state({ value: 'idle' })

export const location: Location = $state(getLocation())

export const base: { name?: string } = { name: undefined }

export const mountedComponents: Record<string, any> = $state({})

let isFirstNavigation = $state(true)
let navigationIndex = 0
let pendingNavigationIndex = 0
let currentTransition: ViewTransition | null = null
let previousPath = ''

// ============================================================================
// Search Params
// ============================================================================

let searchParams = new SvelteURLSearchParams(
	typeof globalThis.location !== 'undefined' ? globalThis.location.search : '',
)

export const searchParamsProxy = {
	append(name: string, value: string, options?: { replace?: boolean }) {
		searchParams.append(name, value)
		updateUrlSearchParams(options)
	},
	delete(name: string, value?: string, options?: { replace?: boolean }) {
		searchParams.delete(name, value)
		updateUrlSearchParams(options)
	},
	entries() {
		return searchParams.entries()
	},
	forEach(...args: Parameters<URLSearchParams['forEach']>) {
		return searchParams.forEach(...args)
	},
	get(...args: Parameters<URLSearchParams['get']>) {
		return searchParams.get(...args)
	},
	getAll(...args: Parameters<URLSearchParams['getAll']>) {
		return searchParams.getAll(...args)
	},
	has(...args: Parameters<URLSearchParams['has']>) {
		return searchParams.has(...args)
	},
	keys() {
		return searchParams.keys()
	},
	set(name: string, value: string, options?: { replace?: boolean }) {
		searchParams.set(name, value)
		updateUrlSearchParams(options)
	},
	sort(options?: { replace?: boolean }) {
		searchParams.sort()
		updateUrlSearchParams(options)
	},
	toString() {
		return searchParams.toString()
	},
	values() {
		return searchParams.values()
	},
	get size() {
		return searchParams.size
	},
	[Symbol.iterator]() {
		return searchParams[Symbol.iterator]()
	},
}

function syncSearchParams() {
	const newSearchParams = new URLSearchParams(globalThis.location.search)
	if (searchParams.toString() === newSearchParams.toString()) {
		return
	}

	searchParams = new SvelteURLSearchParams()
	for (const [key, value] of newSearchParams.entries()) {
		searchParams.append(key, value)
	}
}

function updateUrlSearchParams(options?: { replace?: boolean }) {
	let url = globalThis.location.origin + globalThis.location.pathname
	if (searchParams.size > 0) {
		url += '?' + searchParams.toString()
	}
	globalThis.history[options?.replace ? 'replaceState' : 'pushState'](
		{},
		'',
		url,
	)
}

// ============================================================================
// Router API
// ============================================================================

/**
 * Create a new router instance
 */
export function createRouter<T extends Routes>(config: {
	routes: T
}): RouterApi<T> {
	routes = config.routes

	if (
		import.meta.env.DEV
		&& !import.meta.env.SSR
		&& typeof window !== 'undefined'
	) {
		validateRoutes(routes)
	}

	preloadOnHover(routes)

	return {
		p: constructPath,
		C: componentTree,
		MC: mountedComponents,
		navigate,
		isActive,
		phase,
		supportsViewTransitions: supportsViewTransitions(),
		route: {
			get params() {
				return params.value
			},
			get pathname() {
				return location.pathname as any
			},
			get search() {
				return location.search
			},
			get state() {
				return location.state
			},
			get hash() {
				return location.hash
			},
			get phase() {
				return phase.value
			},
		},
	}
}

/**
 * Navigate to a route
 */
function navigate(path: string | number, options: NavigateOptions = {}) {
	if (typeof path === 'number') {
		globalThis.history.go(path)
		return
	}

	onNavigate(path, options)
}

/**
 * Main navigation handler with View Transition support
 */
export async function onNavigate(path?: string, options: NavigateOptions = {}) {
	// Prevent HMR from triggering navigation
	if (!path && location.pathname === globalThis.location.pathname) {
		if (isFirstNavigation) {
			isFirstNavigation = false
		} else {
			return
		}
	}

	if (!routes || Object.keys(routes).length === 0) {
		throw new Error('Router is empty. You need to populate it.')
	}

	if (cycle.value === 'ba' || cycle.value === 'ab') {
		return
	}

	const prevCycle = cycle.value
	const nextCycle = prevCycle === 'a' ? 'ba' : 'ab'

	navigationIndex++
	const currentNavigationIndex = navigationIndex

	// Match the route
	let matchPath = path || globalThis.location.pathname
	if (base.name && matchPath.startsWith(base.name)) {
		matchPath = matchPath.slice(base.name.length) || '/'
	}

	const {
		match,
		layouts,
		hooks,
		params: newParams,
	} = matchRoute(matchPath, routes)

	// Detect navigation direction
	const direction = detectNavigationDirection(
		previousPath || location.pathname,
		matchPath,
		options.replace ?? false,
	)

	// Merge transition configs: options > route config
	const transitionConfig: TransitionConfig = {
		direction,
		...options.transition,
	}

	// Skip hooks if bypass is enabled
	if (options.bypass) {
		await performNavigation(
			path,
			newParams,
			options,
			null,
			prevCycle,
			nextCycle,
		)
		previousPath = matchPath
		return
	}

	// ========================================================================
	// beforeLoad Hook
	// ========================================================================
	phase.value = 'beforeLoad'
	await tick()

	for (const { beforeLoad } of hooks) {
		try {
			pendingNavigationIndex = currentNavigationIndex
			await beforeLoad?.({ match, params: newParams })
		} catch (err) {
			phase.value = 'idle'
			return
		}
	}

	// Check if navigation was cancelled
	const fromBeforeLoadHook = new Error().stack?.includes('beforeLoad')
	if (
		navigationIndex !== currentNavigationIndex
		|| (fromBeforeLoadHook
			&& pendingNavigationIndex + 1 !== currentNavigationIndex)
	) {
		phase.value = 'idle'
		return
	}

	// ========================================================================
	// Resolve Components
	// ========================================================================
	const routeComponents = await resolveRouteComponents(
		match ? [...layouts, match] : layouts,
	)

	const prevComponentTree = componentTree.value

	// ========================================================================
	// Start View Transition
	// ========================================================================
	currentTransition = await startViewTransition(async () => {
		componentTree.value = calculateTree({
			prev: componentTree.value,
			next: routeComponents,
			cycle: nextCycle,
			params: newParams,
			mountedComponents,
		})
		cycle.value = nextCycle

		const revertLoading = () => {
			cycle.value = prevCycle
			componentTree.value = prevComponentTree
		}

		// ========================================================================
		// duringLoad Hook
		// ========================================================================
		phase.value = 'duringLoad'
		await tick()

		for (const { duringLoad } of hooks) {
			try {
				pendingNavigationIndex = currentNavigationIndex
				await duringLoad?.({
					cycle: cycle.value,
					componentTree: componentTree.value,
					mountedComponents,
					keys: getCompKeys(componentTree.value, cycle.value),
					transition: currentTransition,
				})
			} catch (err) {
				revertLoading()
				phase.value = 'idle'
				return
			}
		}

		// Check if navigation was cancelled
		const fromDuringLoadHook = new Error().stack?.includes('duringLoad')
		if (
			navigationIndex !== currentNavigationIndex
			|| (fromDuringLoadHook
				&& pendingNavigationIndex + 1 !== currentNavigationIndex)
		) {
			revertLoading()
			phase.value = 'idle'
			return
		}

		// Update browser state
		updateNavigation(path, newParams, options)

		// ========================================================================
		// duringRender Hook
		// ========================================================================
		phase.value = 'duringRender'
		await tick()

		for (const { duringRender } of hooks) {
			try {
				await duringRender?.({
					cycle: cycle.value,
					componentTree: componentTree.value,
					mountedComponents,
					keys: getCompKeys(componentTree.value, cycle.value),
					transition: currentTransition,
				})
			} catch (err) {
				// Continue even if duringRender fails
			}
		}

		cycle.value = cycle.value === 'ba' ? 'b' : 'a'
	}, transitionConfig)

	// ========================================================================
	// afterRender Hook (after View Transition completes)
	// ========================================================================
	if (currentTransition) {
		await currentTransition.finished
	}

	phase.value = 'afterRender'
	await tick()

	for (const { afterRender } of hooks) {
		try {
			afterRender?.({
				cycle: cycle.value,
				componentTree: componentTree.value,
				mountedComponents,
				keys: getCompKeys(componentTree.value, cycle.value),
				transition: currentTransition,
			})
		} catch (err) {
			// Continue even if afterRender fails
		}
	}

	phase.value = 'idle'
	cleanMountedComponents(mountedComponents, componentTree)
	currentTransition = null
	previousPath = matchPath
}

/**
 * Perform navigation without View Transition (for bypass mode)
 */
async function performNavigation(
	path: string | undefined,
	newParams: Record<string, string>,
	options: NavigateOptions,
	transition: ViewTransition | null,
	prevCycle: 'a' | 'b',
	nextCycle: 'ab' | 'ba',
) {
	updateNavigation(path, newParams, options)
}

/**
 * Update browser history and location state
 */
function updateNavigation(
	path: string | undefined,
	newParams: Record<string, string>,
	options: NavigateOptions,
) {
	if (path) {
		if (options.search) path += options.search
		if (options.hash) path += options.hash

		const historyMethod = options.replace ? 'replaceState' : 'pushState'
		const to = base.name ? join(base.name, path) : path
		globalThis.history[historyMethod](options.state || {}, '', to)
	}

	params.value = newParams || {}
	syncSearchParams()
	Object.assign(location, getLocation())

	if (options.scrollToTop !== false) {
		window.scrollTo({ top: 0, left: 0, behavior: options.scrollToTop })
	}
}

/**
 * Global click handler to intercept anchor clicks
 */
export function onGlobalClick(event: Event) {
	if (!(event.target instanceof HTMLElement)) return

	const anchor = event.target.closest('a')
	if (!anchor) return

	if (anchor.hasAttribute('target') || anchor.hasAttribute('download')) return

	const url = new URL(anchor.href)
	const currentOrigin = globalThis.location.origin
	if (url.origin !== currentOrigin) return

	event.preventDefault()

	const {
		replace,
		state,
		scrollToTop,
		transition: transitionName,
	} = anchor.dataset

	// Parse transition config from data attribute
	let transition: TransitionConfig | undefined
	if (transitionName) {
		transition = { name: transitionName }
	}

	onNavigate(url.pathname, {
		replace: replace === '' || replace === 'true',
		search: url.search,
		state,
		hash: url.hash,
		scrollToTop: scrollToTop === 'false' ? false : (scrollToTop as ScrollBehavior),
		transition,
	})
}

/**
 * Svelte action to add active class to links
 */
export const isActiveLink: Action<
	HTMLAnchorElement,
	{ className?: string; startsWith?: boolean } | undefined
> = (node, { className = 'is-active', startsWith = false } = {}) => {
	if (node.tagName !== 'A') {
		throw new Error('isActiveLink can only be used on <a> elements')
	}

	$effect(() => {
		const pathname = new URL(node.href).pathname
		if (
			startsWith
				? location.pathname.startsWith(pathname)
				: location.pathname === pathname
		) {
			node.classList.add(className)
		} else {
			node.classList.remove(className)
		}
	})
}
