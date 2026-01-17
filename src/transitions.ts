import type {
	TransitionConfig,
	TransitionDirection,
	ViewTransition,
} from './types'

/**
 * Check if View Transition API is supported
 */
export const supportsViewTransitions = (): boolean => {
	return typeof document !== 'undefined' && 'startViewTransition' in document
}

/**
 * Wrapper for document.startViewTransition with fallback
 */
export const startViewTransition = async (
	callback: () => void | Promise<void>,
	config?: TransitionConfig,
): Promise<ViewTransition | null> => {
	// Force dual-tree mode
	if (config?.forceDualTree || !supportsViewTransitions()) {
		await callback()
		return null
	}

	// Apply transition classes if specified
	if (config?.classes?.length) {
		document.documentElement.classList.add(...config.classes)
	}

	// Apply transition direction
	if (config?.direction) {
		document.documentElement.dataset.transition = config.direction
	}

	// Apply transition name
	if (config?.name) {
		document.documentElement.dataset.transitionName = config.name
	}

	// Start the transition
	const transition = (document as any).startViewTransition(async () => {
		config?.onTransitionStart?.(transition)
		await callback()
	})

	// Cleanup after transition
	transition.finished.finally(() => {
		if (config?.classes?.length) {
			document.documentElement.classList.remove(...config.classes)
		}
		delete document.documentElement.dataset.transition
		delete document.documentElement.dataset.transitionName
		config?.onTransitionEnd?.(transition)
	})

	return transition
}

/**
 * Helper to detect navigation direction based on history
 */
export const detectNavigationDirection = (
	fromPath: string,
	toPath: string,
	isReplace: boolean,
): TransitionDirection => {
	if (isReplace) return 'replace'

	// Simple heuristic: if going to a "deeper" path, it's forward
	const fromDepth = fromPath.split('/').filter(Boolean).length
	const toDepth = toPath.split('/').filter(Boolean).length

	return toDepth > fromDepth ? 'forward' : 'back'
}

/**
 * Transition animation presets
 */
export const transitionPresets = {
	/**
	 * Simple fade transition
	 */
	fade: (): TransitionConfig => ({
		name: 'fade',
		classes: ['transition-fade'],
	}),

	/**
	 * Slide transition based on direction
	 */
	slide: (direction?: TransitionDirection): TransitionConfig => ({
		name: 'slide',
		direction,
		classes: ['transition-slide'],
	}),

	/**
	 * Scale and fade transition
	 */
	scale: (): TransitionConfig => ({
		name: 'scale',
		classes: ['transition-scale'],
	}),

	/**
	 * Material Design style transitions
	 */
	material: (direction?: TransitionDirection): TransitionConfig => ({
		name: 'material',
		direction,
		classes: ['transition-material'],
	}),

	/**
	 * No transition
	 */
	none: (): TransitionConfig => ({
		forceDualTree: false,
	}),

	/**
	 * Custom transition with full control
	 */
	custom: (config: TransitionConfig): TransitionConfig => config,
}

/**
 * CSS generator for View Transitions
 * Call this to generate CSS that you can include in your app
 */
export const generateTransitionCSS = (): string => {
	return `
/* View Transition Base Styles */
::view-transition-old(root),
::view-transition-new(root) {
	animation-duration: 0.3s;
	animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* Fade Transition */
.transition-fade::view-transition-old(root) {
	animation-name: fade-out;
}

.transition-fade::view-transition-new(root) {
	animation-name: fade-in;
}

@keyframes fade-out {
	to { opacity: 0; }
}

@keyframes fade-in {
	from { opacity: 0; }
}

/* Slide Transition */
.transition-slide[data-transition="forward"]::view-transition-old(root) {
	animation-name: slide-out-left;
}

.transition-slide[data-transition="forward"]::view-transition-new(root) {
	animation-name: slide-in-right;
}

.transition-slide[data-transition="back"]::view-transition-old(root) {
	animation-name: slide-out-right;
}

.transition-slide[data-transition="back"]::view-transition-new(root) {
	animation-name: slide-in-left;
}

@keyframes slide-out-left {
	to { transform: translateX(-100%); }
}

@keyframes slide-in-right {
	from { transform: translateX(100%); }
}

@keyframes slide-out-right {
	to { transform: translateX(100%); }
}

@keyframes slide-in-left {
	from { transform: translateX(-100%); }
}

/* Scale Transition */
.transition-scale::view-transition-old(root) {
	animation-name: scale-out;
}

.transition-scale::view-transition-new(root) {
	animation-name: scale-in;
}

@keyframes scale-out {
	to { 
		opacity: 0;
		transform: scale(0.95);
	}
}

@keyframes scale-in {
	from { 
		opacity: 0;
		transform: scale(1.05);
	}
}

/* Material Design Transition */
.transition-material::view-transition-old(root),
.transition-material::view-transition-new(root) {
	animation-duration: 0.4s;
	animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
}

.transition-material[data-transition="forward"]::view-transition-old(root) {
	animation-name: material-fade-out;
}

.transition-material[data-transition="forward"]::view-transition-new(root) {
	animation-name: material-slide-up;
}

.transition-material[data-transition="back"]::view-transition-old(root) {
	animation-name: material-slide-down;
}

.transition-material[data-transition="back"]::view-transition-new(root) {
	animation-name: material-fade-in;
}

@keyframes material-fade-out {
	to { 
		opacity: 0;
		transform: scale(0.92);
	}
}

@keyframes material-slide-up {
	from { 
		opacity: 0;
		transform: translateY(10%);
	}
}

@keyframes material-slide-down {
	to { 
		opacity: 0;
		transform: translateY(10%);
	}
}

@keyframes material-fade-in {
	from { 
		opacity: 0;
		transform: scale(0.92);
	}
}

/* Custom element transitions */
[data-view-transition-name] {
	view-transition-name: var(--view-transition-name);
}
`.trim()
}

/**
 * Svelte action to set view-transition-name
 */
export const viewTransitionName = (node: HTMLElement, name: string) => {
	node.style.viewTransitionName = name
	return {
		update(newName: string) {
			node.style.viewTransitionName = newName
		},
		destroy() {
			node.style.viewTransitionName = ''
		},
	}
}
