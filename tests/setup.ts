import { beforeEach } from 'vitest'

/**
 * Global test setup file
 * Mocks browser APIs needed for router functionality
 */

// Mock View Transition API
if (!document.startViewTransition) {
	document.startViewTransition = (callback: () => void) => {
		// Call the callback immediately to simulate instant transition
		const callbackResult = callback()

		return {
			finished: Promise.resolve(),
			ready: Promise.resolve(),
			updateCallbackDone: Promise.resolve(callbackResult),
			skipTransition: () => {},
		} as ViewTransition
	}
}

// Reset browser state before each test
beforeEach(() => {
	// Reset location to root
	if (typeof globalThis.location !== 'undefined') {
		Object.defineProperty(globalThis, 'location', {
			value: {
				pathname: '/',
				search: '',
				hash: '',
				href: 'http://localhost/',
				origin: 'http://localhost',
				host: 'localhost',
				hostname: 'localhost',
				port: '',
				protocol: 'http:',
			},
			writable: true,
			configurable: true,
		})
	}

	// Reset history state
	if (typeof globalThis.history !== 'undefined') {
		let currentState: any = null

		Object.defineProperty(globalThis, 'history', {
			value: {
				get state() {
					return currentState
				},
				length: 1,
				scrollRestoration: 'auto',
				pushState: (state: any, _title: string, url?: string) => {
					if (url) {
						const urlObj = new URL(url, globalThis.location.href)
						;(globalThis.location as any).pathname = urlObj.pathname
						;(globalThis.location as any).search = urlObj.search
						;(globalThis.location as any).hash = urlObj.hash
					}
					currentState = state
				},
				replaceState: (state: any, _title: string, url?: string) => {
					if (url) {
						const urlObj = new URL(url, globalThis.location.href)
						;(globalThis.location as any).pathname = urlObj.pathname
						;(globalThis.location as any).search = urlObj.search
						;(globalThis.location as any).hash = urlObj.hash
					}
					currentState = state
				},
				back: () => {},
				forward: () => {},
				go: () => {},
			},
			writable: true,
			configurable: true,
		})
	}
})
