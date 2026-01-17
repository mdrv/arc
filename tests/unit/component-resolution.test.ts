import type { Component } from 'svelte'
import { describe, expect, it } from 'vitest'
import { isLazyImport, resolveRouteComponent, resolveRouteComponents } from '../../src/utils'

// Mock components (as functions, like real Svelte components)
const EagerComponent = function() {} as unknown as Component
const AnotherComponent = function() {} as unknown as Component

describe('Component Resolution', () => {
	describe('isLazyImport', () => {
		it('should detect lazy import functions', () => {
			// Using string template to avoid actual import error
			const lazy = new Function('return () => import("./component")')() as () => Promise<any>
			expect(isLazyImport(lazy)).toBe(true)
		})

		it('should return false for eager components', () => {
			expect(isLazyImport(EagerComponent)).toBe(false)
		})

		it('should return false for regular functions', () => {
			const regularFn = () => ({ foo: 'bar' })
			expect(isLazyImport(regularFn)).toBe(false)
		})

		it('should return false for non-functions', () => {
			expect(isLazyImport('string')).toBe(false)
			expect(isLazyImport(123)).toBe(false)
			expect(isLazyImport(null)).toBe(false)
			expect(isLazyImport(undefined)).toBe(false)
		})
	})

	describe('resolveRouteComponent', () => {
		it('should return eager component as-is', async () => {
			const result = await resolveRouteComponent(EagerComponent)
			expect(result).toBe(EagerComponent)
		})

		it('should handle array with eager component and metadata', async () => {
			const input: [Component, { submodule?: string; params?: string[] }] = [
				EagerComponent,
				{ params: ['id'] },
			]
			const result = await resolveRouteComponent(input)
			expect(result).toEqual([EagerComponent, { params: ['id'] }])
		})

		it('should handle array with eager component and submodule metadata', async () => {
			const input: [Component, { submodule?: string; params?: string[] }] = [
				EagerComponent,
				{ submodule: 'custom', params: ['id'] },
			]
			const result = await resolveRouteComponent(input)
			expect(result).toEqual([EagerComponent, { submodule: 'custom', params: ['id'] }])
		})
	})

	describe('resolveRouteComponents', () => {
		it('should resolve array of eager components', async () => {
			const components = [EagerComponent, AnotherComponent]
			const result = await resolveRouteComponents(components)
			expect(result).toEqual([EagerComponent, AnotherComponent])
		})

		it('should resolve empty array', async () => {
			const result = await resolveRouteComponents([])
			expect(result).toEqual([])
		})

		it('should resolve components with metadata (eager only)', async () => {
			const components: any = [
				[EagerComponent, { params: ['id'] }],
				[AnotherComponent, { submodule: 'custom', params: ['postId'] }],
			]
			const result = await resolveRouteComponents(components)
			expect(result).toEqual([
				[EagerComponent, { params: ['id'] }],
				[AnotherComponent, { submodule: 'custom', params: ['postId'] }],
			])
		})

		it('should handle single component', async () => {
			const result = await resolveRouteComponents([EagerComponent])
			expect(result).toEqual([EagerComponent])
		})

		it('should handle components with partial metadata', async () => {
			const components: any = [
				[EagerComponent, { params: ['id'] }],
				AnotherComponent,
			]
			const result = await resolveRouteComponents(components)
			expect(result).toEqual([
				[EagerComponent, { params: ['id'] }],
				AnotherComponent,
			])
		})
	})
})
