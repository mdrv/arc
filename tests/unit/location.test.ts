import { beforeEach, describe, expect, it } from 'vitest'
import { getLocation } from '../../src/utils'

describe('Location Utilities', () => {
	beforeEach(() => {
		// Reset location before each test
		Object.defineProperty(globalThis, 'location', {
			value: {
				pathname: '/',
				search: '',
				hash: '',
				href: 'http://localhost/',
			},
			writable: true,
			configurable: true,
		})

		Object.defineProperty(globalThis, 'history', {
			value: {
				state: null,
			},
			writable: true,
			configurable: true,
		})
	})

	describe('getLocation', () => {
		it('should return current location', () => {
			const location = getLocation()
			expect(location.pathname).toBe('/')
			expect(location.search).toBe('')
			expect(location.hash).toBe('')
			expect(location.state).toBe(null)
		})

		it('should include search parameters', () => {
			;(globalThis.location as any).search = '?foo=bar'
			const location = getLocation()
			expect(location.search).toBe('?foo=bar')
		})

		it('should include hash', () => {
			;(globalThis.location as any).hash = '#section'
			const location = getLocation()
			expect(location.hash).toBe('#section')
		})

		it('should include pathname', () => {
			;(globalThis.location as any).pathname = '/about/team'
			const location = getLocation()
			expect(location.pathname).toBe('/about/team')
		})

		it('should include history state', () => {
			const stateObj = { userId: 123 }
			;(globalThis.history as any).state = stateObj
			const location = getLocation()
			expect(location.state).toBe(stateObj)
		})

		it('should handle SSR environment (no location)', () => {
			// Temporarily remove location
			const originalLocation = globalThis.location
			// @ts-expect-error Testing SSR behavior
			delete globalThis.location

			const location = getLocation()
			expect(location.pathname).toBe('/')
			expect(location.search).toBe('')
			expect(location.hash).toBe('')
			expect(location.state).toBe(null)

			// Restore location
			Object.defineProperty(globalThis, 'location', {
				value: originalLocation,
				writable: true,
				configurable: true,
			})
		})

		it('should return complete location object', () => {
			;(globalThis.location as any).pathname = '/user/123'
			;(globalThis.location as any).search = '?tab=posts'
			;(globalThis.location as any).hash = '#comments'
			;(globalThis.history as any).state = { from: '/home' }

			const location = getLocation()
			expect(location).toEqual({
				pathname: '/user/123',
				search: '?tab=posts',
				hash: '#comments',
				state: { from: '/home' },
			})
		})
	})
})
