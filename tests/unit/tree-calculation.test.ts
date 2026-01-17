import type { Component } from 'svelte'
import { describe, expect, it } from 'vitest'
import type { ComponentTree } from '../../src/types'
import { calculateTree, cleanMountedComponents, getCompKeys } from '../../src/utils'

// Mock components
const Component1 = function() {} as unknown as Component
const Component2 = function() {} as unknown as Component
const Component3 = function() {} as unknown as Component

describe('Tree Calculation', () => {
	describe('calculateTree', () => {
		it('should create initial tree with cycle ab', () => {
			const prev: ComponentTree['value'] = { a: [], b: [], eq: -1 }
			const next = [Component1, Component2]
			const params = {}
			const mountedComponents = {}

			const tree = calculateTree({
				prev,
				next,
				cycle: 'ab',
				params,
				mountedComponents,
			})

			expect(tree.a).toEqual([])
			expect(tree.b).toHaveLength(2)
			expect(tree.b[0]?.C).toBe(Component1)
			expect(tree.b[1]?.C).toBe(Component2)
			expect(tree.eq).toBe(-1)
		})

		it('should create tree with cycle ba', () => {
			const prev: ComponentTree['value'] = { a: [], b: [], eq: -1 }
			const next = [Component1]
			const params = {}
			const mountedComponents = {}

			const tree = calculateTree({
				prev,
				next,
				cycle: 'ba',
				params,
				mountedComponents,
			})

			expect(tree.b).toEqual([])
			expect(tree.a).toHaveLength(1)
			expect(tree.a[0]?.C).toBe(Component1)
		})

		it('should increment keys when components change', () => {
			const prev: ComponentTree['value'] = {
				a: [{ C: Component1, key: 0 }, { C: Component2, key: 0 }],
				b: [],
				eq: -1,
			}
			const next = [Component1, Component3]
			const params = {}
			const mountedComponents = {}

			const tree = calculateTree({
				prev,
				next,
				cycle: 'ba',
				params,
				mountedComponents,
			})

			// First component same, second changed
			expect(tree.a[0]?.C).toBe(Component1)
			expect(tree.a[0]?.key).toBe(0) // Same component, same key
			expect(tree.a[1]?.C).toBe(Component3)
			expect(tree.a[1]?.key).toBe(1) // Different component, incremented key
		})

		it('should calculate equality point', () => {
			const prev: ComponentTree['value'] = {
				a: [],
				b: [{ C: Component1, key: 0 }, { C: Component2, key: 0 }],
				eq: -1,
			}
			const next = [Component1, Component2]
			const params = {}
			const mountedComponents = {}

			const tree = calculateTree({
				prev,
				next,
				cycle: 'ab',
				params,
				mountedComponents,
			})

			// Both components are the same
			expect(tree.eq).toBe(1) // Both match
		})

		it('should handle params extraction for components', () => {
			const prev: ComponentTree['value'] = { a: [], b: [], eq: -1 }
			const next: any = [[Component1, { params: ['id', 'name'] }]]
			const params = { id: '123', name: 'test', extra: 'ignored' }
			const mountedComponents = {}

			const tree = calculateTree({
				prev,
				next,
				cycle: 'ab',
				params,
				mountedComponents,
			})

			expect(tree.b[0]?.C).toBe(Component1)
			expect(tree.b[0]?.params).toEqual({ id: '123', name: 'test' })
		})

		it('should initialize mounted components', () => {
			const prev: ComponentTree['value'] = { a: [], b: [], eq: -1 }
			const next = [Component1, Component2]
			const params = {}
			const mountedComponents: Record<string, any> = {}

			calculateTree({
				prev,
				next,
				cycle: 'ab',
				params,
				mountedComponents,
			})

			expect(Object.keys(mountedComponents)).toHaveLength(2)
			expect(mountedComponents['0 0']).toBeDefined()
			expect(mountedComponents['1 0']).toBeDefined()
		})
	})

	describe('getCompKeys', () => {
		it('should get in/out keys for transition', () => {
			const tree: ComponentTree['value'] = {
				a: [{ C: Component1, key: 0 }, { C: Component2, key: 0 }],
				b: [{ C: Component1, key: 0 }, { C: Component3, key: 1 }],
				eq: 0, // First component matches
			}

			const keys = getCompKeys(tree, 'ab')

			expect(keys.in).toContain('1 1') // Component3 is new
			expect(keys.out).toContain('1 0') // Component2 is removed
		})

		it('should handle empty trees', () => {
			const tree: ComponentTree['value'] = {
				a: [],
				b: [],
				eq: -1,
			}

			const keys = getCompKeys(tree, 'ab')

			expect(keys.in).toEqual([])
			expect(keys.out).toEqual([])
		})

		it('should handle all new components', () => {
			const tree: ComponentTree['value'] = {
				a: [],
				b: [{ C: Component1, key: 0 }, { C: Component2, key: 0 }],
				eq: -1,
			}

			const keys = getCompKeys(tree, 'ab')

			expect(keys.in).toHaveLength(2)
			expect(keys.in).toContain('0 0')
			expect(keys.in).toContain('1 0')
			expect(keys.out).toEqual([])
		})

		it('should handle all removed components', () => {
			const tree: ComponentTree['value'] = {
				a: [{ C: Component1, key: 0 }, { C: Component2, key: 0 }],
				b: [],
				eq: -1,
			}

			const keys = getCompKeys(tree, 'ab')

			expect(keys.in).toEqual([])
			expect(keys.out).toHaveLength(2)
			expect(keys.out).toContain('0 0')
			expect(keys.out).toContain('1 0')
		})
	})

	describe('cleanMountedComponents', () => {
		it('should remove old component instances', () => {
			const mountedComponents = {
				'0 0': {},
				'0 1': {},
				'0 2': {},
				'1 0': {},
			}

			const componentTree: ComponentTree = {
				value: {
					a: [{ C: Component1, key: 2 }],
					b: [{ C: Component1, key: 2 }],
					eq: 0,
				},
			}

			cleanMountedComponents(mountedComponents, componentTree)

			// Keys 0 and 1 for depth 0 should be removed (< 2)
			expect(mountedComponents['0 0']).toBeUndefined()
			expect(mountedComponents['0 1']).toBeUndefined()
			expect(mountedComponents['0 2']).toBeDefined()
			expect(mountedComponents['1 0']).toBeDefined()
		})

		it('should keep current components', () => {
			const mountedComponents = {
				'0 5': {},
				'1 3': {},
			}

			const componentTree: ComponentTree = {
				value: {
					a: [{ C: Component1, key: 5 }],
					b: [{ C: Component1, key: 5 }, { C: Component2, key: 3 }],
					eq: 0,
				},
			}

			cleanMountedComponents(mountedComponents, componentTree)

			expect(mountedComponents['0 5']).toBeDefined()
			expect(mountedComponents['1 3']).toBeDefined()
		})

		it('should handle empty mounted components', () => {
			const mountedComponents = {}

			const componentTree: ComponentTree = {
				value: {
					a: [{ C: Component1, key: 0 }],
					b: [{ C: Component1, key: 0 }],
					eq: 0,
				},
			}

			expect(() => {
				cleanMountedComponents(mountedComponents, componentTree)
			}).not.toThrow()
		})
	})
})
