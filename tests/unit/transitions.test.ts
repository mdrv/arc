import { describe, expect, it, vi } from 'vitest'
import {
	detectNavigationDirection,
	generateTransitionCSS,
	startViewTransition,
	supportsViewTransitions,
	transitionPresets,
} from '../../src/transitions'

describe('Transitions', () => {
	describe('supportsViewTransitions', () => {
		it('should return true when View Transition API is available', () => {
			// In our test environment, we mock this in setup.ts
			expect(supportsViewTransitions()).toBe(true)
		})
	})

	describe('detectNavigationDirection', () => {
		it('should detect forward navigation', () => {
			const direction = detectNavigationDirection(5, 10)
			expect(direction).toBe('forward')
		})

		it('should detect backward navigation', () => {
			const direction = detectNavigationDirection(10, 5)
			expect(direction).toBe('backward')
		})

		it('should handle same index as forward', () => {
			const direction = detectNavigationDirection(5, 5)
			expect(direction).toBe('forward')
		})
	})

	describe('startViewTransition', () => {
		it('should start a view transition with callback', async () => {
			const callback = vi.fn()
			const transition = await startViewTransition(callback)

			expect(callback).toHaveBeenCalled()
			expect(transition).toHaveProperty('finished')
			expect(transition).toHaveProperty('ready')
		})

		it('should handle transition with options', async () => {
			const callback = vi.fn()
			const config = { duration: 300 }

			const transition = await startViewTransition(callback, config)

			expect(callback).toHaveBeenCalled()
			expect(transition).toBeDefined()
		})
	})

	describe('transitionPresets', () => {
		it('should provide fade preset', () => {
			const preset = transitionPresets.fade()
			expect(preset).toHaveProperty('duration')
		})

		it('should provide slide preset', () => {
			const preset = transitionPresets.slide()
			expect(preset).toHaveProperty('duration')
		})

		it('should provide scale preset', () => {
			const preset = transitionPresets.scale()
			expect(preset).toHaveProperty('duration')
		})

		it('should provide material preset', () => {
			const preset = transitionPresets.material()
			expect(preset).toHaveProperty('duration')
		})

		it('should allow customizing preset duration', () => {
			const preset = transitionPresets.fade({ duration: 500 })
			expect(preset.duration).toBe(500)
		})
	})

	describe('generateTransitionCSS', () => {
		it('should generate valid CSS string', () => {
			const css = generateTransitionCSS()
			expect(typeof css).toBe('string')
			expect(css.length).toBeGreaterThan(0)
		})

		it('should include ::view-transition selectors', () => {
			const css = generateTransitionCSS()
			expect(css).toContain('::view-transition')
		})

		it('should include animation rules', () => {
			const css = generateTransitionCSS()
			expect(css).toMatch(/animation/)
		})

		it('should be minified (no unnecessary whitespace)', () => {
			const css = generateTransitionCSS()
			// Check that it doesn't have excessive newlines or spaces
			expect(css).not.toMatch(/\n\n/)
		})
	})
})
