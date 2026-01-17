import { describe, expect, it } from 'vitest'

describe('Test Infrastructure', () => {
	it('should run tests successfully', () => {
		expect(true).toBe(true)
	})

	it('should have access to DOM APIs', () => {
		expect(typeof document).toBe('object')
		expect(typeof window).toBe('object')
	})

	it('should have View Transition API mocked', () => {
		expect(typeof document.startViewTransition).toBe('function')
	})

	it('should have location and history APIs', () => {
		expect(globalThis.location.pathname).toBe('/')
		expect(globalThis.history.state).toBe(null)
	})
})
