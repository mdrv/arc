import type { Action } from 'svelte/action'

/**
 * Image loading status
 */
export enum Status {
	INIT,
	SUCCESS,
	LOADING,
	FAILED,
}

/**
 * Progress information
 */
export type Progress = {
	cur: number
	max: number
}

/**
 * Loader action args
 */
export type LoaderArgs = {
	beforeLoad?: (node: HTMLImageElement) => void
	afterLoad?: (node: HTMLImageElement) => void
}

/**
 * Image loader utility class for managing image loading with progress tracking
 *
 * @example
 * ```svelte
 * <script>
 *   const loader = new Loader()
 *
 *   $effect(() => {
 *     if (loader.status === Status.SUCCESS) {
 *       // All images loaded
 *     }
 *   })
 * </script>
 *
 * <img data-src="/image.jpg" use:loader.load />
 * ```
 */
export class Loader {
	/** Image nodes being tracked */
	nodes: Record<string, [HTMLImageElement, Status, LoaderArgs]> = $state({})

	/** Loading progress */
	#progress = $derived({
		cur: Object.values(this.nodes).filter((x) => x[1] === Status.SUCCESS)
			.length,
		max: Object.keys(this.nodes).length,
	})

	get progress(): Progress {
		return this.#progress
	}

	/** Overall loading status */
	#status = $derived.by(() => {
		if (Object.values(this.nodes).some((x) => x[1] === Status.FAILED)) {
			return Status.FAILED
		}
		if (Object.keys(this.nodes).length === 0) {
			return Status.INIT
		}
		if (Object.values(this.nodes).every((x) => x[1] === Status.SUCCESS)) {
			return Status.SUCCESS
		}
		return Status.LOADING
	})

	get status(): Status {
		return this.#status
	}

	constructor() {
		$effect.root(() => {
			$effect(() => {
				if (this.#status === Status.FAILED) {
					for (const [node] of Object.values(this.nodes)) {
						node.removeAttribute('src')
					}
				}
			})
		})
	}

	/**
	 * Internal method to load a single image
	 */
	#loadImage = (src: string) => {
		const [node, _, args] = this.nodes[src]

		args.beforeLoad?.(node)
		node.src = src

		node.onerror = () => {
			if (!this.nodes[src]) return
			this.nodes[src][1] = Status.FAILED
		}

		node.onload = () => {
			if (!this.nodes[src]) return

			if (node.naturalWidth > 0 && node.naturalHeight > 0) {
				this.nodes[src][1] = Status.SUCCESS
				args?.afterLoad?.(node)
			} else {
				this.nodes[src][1] = Status.FAILED
			}
		}
	}

	/**
	 * Svelte action to load an image
	 *
	 * @example
	 * ```svelte
	 * <img data-src="/path/to/image.jpg" use:loader.load />
	 * ```
	 */
	load: Action<HTMLImageElement, LoaderArgs | undefined> = (
		node,
		args = {},
	) => {
		if (!(node instanceof HTMLImageElement)) {
			throw new Error('Loader action can only be used on <img> elements')
		}

		const src = node.dataset.src
		if (!src) {
			throw new Error('data-src attribute must be set on <img> element')
		}

		if (this.#status === Status.FAILED) {
			return
		}

		this.nodes[src] = [node, Status.LOADING, args]
		this.#loadImage(src)

		return {
			destroy: () => {
				delete this.nodes[src]
			},
		}
	}

	/**
	 * Wait until all images are loaded
	 *
	 * @example
	 * ```ts
	 * await loader.finish()
	 * ```
	 */
	finish = (): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (this.#status === Status.INIT) {
				resolve()
				return
			}

			const checkStatus = () => {
				setTimeout(() => {
					if (this.#status === Status.SUCCESS) {
						resolve()
					} else if (this.#status === Status.FAILED) {
						reject(new Error('Image loading failed'))
					} else {
						checkStatus()
					}
				}, 100)
			}

			checkStatus()
		})
	}

	/**
	 * Reload all images
	 *
	 * @example
	 * ```ts
	 * await loader.reload()
	 * ```
	 */
	reload = async (): Promise<void> => {
		for (const [src, [node]] of Object.entries(this.nodes)) {
			this.nodes[src][1] = Status.INIT
			node.removeAttribute('src')
		}

		for (const src of Object.keys(this.nodes)) {
			this.#loadImage(src)
		}

		return this.finish()
	}
}

/**
 * Calculate total progress from multiple progress objects
 */
export function countProgress(
	progress: Record<string, Progress | undefined>,
): Progress | undefined {
	if (!progress) return undefined

	return Object.values(progress)
		.filter((x): x is Progress => !!x)
		.reduce(
			(acc, curr) => ({
				cur: acc.cur + curr.cur,
				max: acc.max + curr.max,
			}),
			{ cur: 0, max: 0 },
		)
}
