/**
 * @module @mdrv/arc
 *
 * A lightweight, client-side router for Svelte 5 with View Transition API support.
 *
 * Features:
 * - Nested routes and layouts
 * - Dynamic parameters and wildcards
 * - Lazy loading
 * - Navigation hooks
 * - View Transition API integration
 * - Dual-tree fallback for complex animations
 * - Image loading utilities
 */

// Core router
export { createRouter, isActiveLink, searchParamsProxy as searchParams } from './create.svelte'
// Loader utilities
export { countProgress, Loader, Status } from './load.svelte'
export { default as Router } from './router.svelte'

// View Transition utilities
export {
	detectNavigationDirection,
	generateTransitionCSS,
	startViewTransition,
	supportsViewTransitions,
	transitionPresets,
	viewTransitionName,
} from './transitions'

// Types
export type {
	AllParams,
	ComponentTree,
	ComponentTreeNode,
	Hooks,
	LayoutComponent,
	LazyRouteComponent,
	Location,
	NavigateOptions,
	Path,
	PathParams,
	Phase,
	RouteComponent,
	RouterApi,
	Routes,
	TransitionConfig,
	TransitionDirection,
	ViewTransition,
} from './types'
