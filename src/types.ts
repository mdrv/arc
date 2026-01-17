import type { Component, Snippet } from 'svelte'

/**
 * Base props for route components
 */
export type BaseProps = {}

/**
 * Lazy-loaded route component
 */
export type LazyRouteComponent<Props extends BaseProps = BaseProps> = () => Promise<{
	[key: string]: Component<Props>
}>

/**
 * Route component can be either a regular component or a lazy-loaded one
 */
export type RouteComponent<Props extends BaseProps = any> =
	| Component<Props>
	| LazyRouteComponent<Props>

/**
 * Layout component includes children snippet
 */
export type LayoutComponent =
	| RouteComponent<{ children: Snippet }>
	| [RouteComponent, { submodule?: string }]

/**
 * Component tree structure for dual-tree rendering
 */
export type ComponentTree = {
	value: {
		a: ComponentTreeNode[]
		b: ComponentTreeNode[]
		eq: number
	}
}

export type ComponentTreeNode = {
	C: Component<any>
	key: number
	params?: Record<string, string>
}

/**
 * View Transition types
 */
export type ViewTransition = {
	finished: Promise<void>
	ready: Promise<void>
	updateCallbackDone: Promise<void>
	skipTransition(): void
}

/**
 * Transition direction for different animation styles
 */
export type TransitionDirection = 'forward' | 'back' | 'replace'

/**
 * Transition configuration
 */
export type TransitionConfig = {
	/**
	 * Transition name for CSS view-transition-name
	 */
	name?: string

	/**
	 * Direction of navigation
	 */
	direction?: TransitionDirection

	/**
	 * Custom classes to add during transition
	 */
	classes?: string[]

	/**
	 * Skip View Transition API and use dual-tree
	 */
	forceDualTree?: boolean

	/**
	 * Custom callback during transition
	 */
	onTransitionStart?: (transition: ViewTransition) => void | Promise<void>
	onTransitionEnd?: (transition: ViewTransition) => void | Promise<void>
}

/**
 * Lifecycle hooks for route navigation
 */
export type Hooks = {
	/**
	 * Called before loading the route components.
	 * Can throw to cancel navigation.
	 */
	beforeLoad?(args: {
		match?: RouteComponent
		params: Record<string, string>
	}): void | Promise<void>

	/**
	 * Called after components are resolved but before rendering.
	 * Useful for loading data or assets.
	 */
	duringLoad?(args: {
		cycle: 'a' | 'b' | 'ab' | 'ba'
		componentTree: ComponentTree['value']
		mountedComponents: Record<string, any>
		keys: { in: string[]; out: string[] }
		transition: ViewTransition | null
	}): void | Promise<void>

	/**
	 * Called during the rendering phase.
	 * Used for transitions and animations.
	 */
	duringRender?(args: {
		cycle: 'a' | 'b' | 'ab' | 'ba'
		componentTree: ComponentTree['value']
		mountedComponents: Record<string, any>
		keys: { in: string[]; out: string[] }
		transition: ViewTransition | null
	}): void | Promise<void>

	/**
	 * Called after rendering is complete.
	 */
	afterRender?(args: {
		cycle: 'a' | 'b'
		componentTree: ComponentTree['value']
		mountedComponents: Record<string, any>
		keys: { in: string[]; out: string[] }
		transition: ViewTransition | null
	}): void
}

/**
 * Route definition structure
 */
export type Routes = {
	[_: `/${string}`]:
		| RouteComponent
		| [RouteComponent, { submodule?: string; params?: string[] }]
		| Routes
	[_: `*${string}` | `(*${string})`]:
		| RouteComponent
		| [RouteComponent, { submodule?: string; params?: string[] }]
		| undefined
	layout?: LayoutComponent
	hooks?: Hooks
	/**
	 * Transition configuration for this route group
	 */
	transition?: TransitionConfig
}

/**
 * Navigation options
 */
export type NavigateOptions = {
	hash?: string
	replace?: boolean
	scrollToTop?: ScrollBehavior | false
	search?: string
	state?: string
	bypass?: boolean
	/**
	 * Transition configuration for this navigation
	 */
	transition?: TransitionConfig
}

/**
 * Location information
 */
export type Location = {
	pathname: string
	search: string
	state: any
	hash: string
}

/**
 * Router phase states
 */
export type Phase =
	| 'idle'
	| 'beforeLoad'
	| 'duringLoad'
	| 'duringRender'
	| 'afterRender'

/**
 * Type utilities for extracting route paths and params
 */
type StripNonRoutes<T extends Routes> = {
	[
		K in keyof T as K extends `*${string}` ? never
			: K extends `(*${string})` ? never
			: K extends 'layout' ? never
			: K extends 'hooks' ? never
			: K extends 'transition' ? never
			: K
	]: T[K] extends Routes ? StripNonRoutes<T[K]> : T[K]
}

type RecursiveKeys<T extends Routes, Prefix extends string = ''> = {
	[K in keyof T]: K extends string ? T[K] extends Routes ? RecursiveKeys<T[K], `${Prefix}${K}`>
		: `${Prefix}${K}`
		: never
}[keyof T]

type RemoveLastSlash<T extends string> = T extends '/' ? T
	: T extends `${infer R}/` ? R
	: T

type RemoveParenthesis<T extends string> = T extends `${infer A}(${infer B})${infer C}`
	? RemoveParenthesis<`${A}${B}${C}`>
	: T

export type Path<T extends Routes> = RemoveParenthesis<
	RemoveLastSlash<RecursiveKeys<StripNonRoutes<T>>>
>

type ExtractParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
	? Param | ExtractParams<`/${Rest}`>
	: T extends `${string}(:${infer Param})` ? Param
	: T extends `${string}:${infer Param}` ? Param
	: T extends `${string}(*${infer Param})` ? Param
	: T extends `${string}*${infer Param}` ? Param extends '' ? never
		: Param
	: never

export type PathParams<T extends string> = ExtractParams<T> extends never ? never : Record<ExtractParams<T>, string>

export type ConstructPathArgs<T extends string> = PathParams<T> extends never ? [T] : [T, PathParams<T>]

type NavigateArgs<T extends string> =
	| (PathParams<T> extends never ? [T] | [T, NavigateOptions]
		: [T, NavigateOptions & { params: PathParams<T> }])
	| [number]

export type IsActiveArgs<T extends string> = PathParams<T> extends never ? [T] : [T] | [T, PathParams<T>]

export type AllParams<T extends Routes> = Partial<
	Record<ExtractParams<RecursiveKeys<T>>, string>
>

/**
 * Main router API
 */
export type RouterApi<T extends Routes> = {
	/**
	 * Construct a path with type safety
	 */
	p<U extends Path<T>>(...args: ConstructPathArgs<U>): string

	/**
	 * Navigate to a route
	 */
	navigate<U extends Path<T>>(...args: NavigateArgs<U>): void

	/**
	 * Check if a path is active
	 */
	isActive: {
		<U extends Path<T>>(...args: IsActiveArgs<U>): boolean
		startsWith<U extends Path<T>>(...args: IsActiveArgs<U>): boolean
	}

	/**
	 * Current route information
	 */
	route: {
		params: AllParams<T>
		pathname: Path<T>
		search: string
		state: unknown
		hash: string
		phase: Phase
	}

	/**
	 * Current navigation phase
	 */
	phase: { value: Phase }

	/**
	 * Component tree (for advanced use cases)
	 */
	C: ComponentTree

	/**
	 * Mounted components (for advanced use cases)
	 */
	MC: Record<string, any>

	/**
	 * Check if View Transition API is supported
	 */
	supportsViewTransitions: boolean
}
