import type { Component } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Routes } from '../../src/types'
import { getRoutePaths, sortRoutes, validateRoutes } from '../../src/utils'

// Mock components (as functions, like real Svelte components)
const HomePage = function() {} as unknown as Component
const UserPage = function() {} as unknown as Component
const NotFoundPage = function() {} as unknown as Component

describe('Route Validation', () => {
	describe('getRoutePaths', () => {
		it('should extract all route paths', () => {
			const routes: Routes = {
				'/': HomePage,
				'/user/:id': UserPage,
				'/*': NotFoundPage,
			}

			const paths = getRoutePaths(routes)
			expect(paths).toContain('/')
			expect(paths).toContain('/user/:id')
			expect(paths).toContain('/*')
		})

		it('should exclude layout and hooks keys', () => {
			const routes: Routes = {
				'/': {
					layout: HomePage,
					hooks: { beforeLoad: () => {} },
					'/': HomePage,
					'/about': UserPage,
				},
			}

			const paths = getRoutePaths(routes)
			expect(paths).not.toContain('layout')
			expect(paths).not.toContain('hooks')
		})

		it('should handle nested routes', () => {
			const routes: Routes = {
				'/user/:id': {
					'/': UserPage,
					'/profile': HomePage,
				},
			}

			const paths = getRoutePaths(routes)
			expect(paths).toContain('/user/:id')
			expect(paths).toContain('/user/:id/profile')
		})

		it('should handle wildcard in nested routes', () => {
			const routes: Routes = {
				'/api': {
					'/*': NotFoundPage,
				},
			}

			const paths = getRoutePaths(routes)
			expect(paths).toContain('/api/*')
		})

		it('should return empty array for empty routes', () => {
			const routes: Routes = {}
			const paths = getRoutePaths(routes)
			expect(paths).toEqual([])
		})
	})

	describe('sortRoutes', () => {
		it('should prioritize root path', () => {
			const routes = ['/about', '/', '/user/:id']
			const sorted = sortRoutes(routes)
			expect(sorted[0]).toBe('/')
		})

		it('should prioritize static routes over dynamic', () => {
			const routes = ['/user/:id', '/about', '/contact']
			const sorted = sortRoutes(routes)
			expect(sorted[0]).toBe('/about')
			expect(sorted[1]).toBe('/contact')
			expect(sorted[2]).toBe('/user/:id')
		})

		it('should prioritize dynamic routes over wildcards', () => {
			const routes = ['/*', '/user/:id', '/about']
			const sorted = sortRoutes(routes)
			expect(sorted[0]).toBe('/about')
			expect(sorted[1]).toBe('/user/:id')
			expect(sorted[2]).toBe('/*')
		})

		it('should handle empty array', () => {
			const sorted = sortRoutes([])
			expect(sorted).toEqual([])
		})

		it('should handle single route', () => {
			const sorted = sortRoutes(['/about'])
			expect(sorted).toEqual(['/about'])
		})

		it('should sort complex route list correctly', () => {
			const routes = [
				'*catch',
				'/user/:id/post/:postId',
				'/about',
				'/',
				'/user/profile',
				'/user/:id',
			]
			const sorted = sortRoutes(routes)

			// Root first
			expect(sorted[0]).toBe('/')
			// Static routes next
			expect(sorted.slice(1, 3)).toContain('/about')
			expect(sorted.slice(1, 3)).toContain('/user/profile')
			// Dynamic routes
			expect(sorted.slice(3, 5)).toContain('/user/:id')
			expect(sorted.slice(3, 5)).toContain('/user/:id/post/:postId')
			// Wildcard last
			expect(sorted[5]).toBe('*catch')
		})
	})

	describe('validateRoutes', () => {
		let consoleWarnSpy: ReturnType<typeof vi.spyOn>

		beforeEach(() => {
			consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		})

		afterEach(() => {
			consoleWarnSpy.mockRestore()
		})

		it('should warn when wildcard and dynamic routes are at same level', () => {
			const routes: Routes = {
				'/user/:id': UserPage,
				'/*': NotFoundPage,
			}

			validateRoutes(routes)
			expect(consoleWarnSpy).toHaveBeenCalled()
			expect(consoleWarnSpy.mock.calls[0][0]).toContain('Wildcard route')
		})

		it('should not warn for valid route structure', () => {
			const routes: Routes = {
				'/': HomePage,
				'/user/:id': UserPage,
				'/about': HomePage,
			}

			validateRoutes(routes)
			expect(consoleWarnSpy).not.toHaveBeenCalled()
		})

		it('should not warn when wildcard is in different path', () => {
			const routes: Routes = {
				'/api/*': NotFoundPage,
				'/user/:id': UserPage,
			}

			validateRoutes(routes)
			expect(consoleWarnSpy).not.toHaveBeenCalled()
		})

		it('should handle routes without wildcards', () => {
			const routes: Routes = {
				'/': HomePage,
				'/about': HomePage,
			}

			validateRoutes(routes)
			expect(consoleWarnSpy).not.toHaveBeenCalled()
		})

		it('should handle empty routes', () => {
			const routes: Routes = {}
			validateRoutes(routes)
			expect(consoleWarnSpy).not.toHaveBeenCalled()
		})
	})
})
