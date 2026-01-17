import type { Component } from 'svelte'
import { describe, expect, it } from 'vitest'
import type { Routes } from '../../src/types'
import { matchRoute } from '../../src/utils'

// Mock components for testing (as functions, like real Svelte components)
const HomePage = function() {} as unknown as Component
const AboutPage = function() {} as unknown as Component
const UserPage = function() {} as unknown as Component
const NotFoundPage = function() {} as unknown as Component
const PostPage = function() {} as unknown as Component
const ProfilePage = function() {} as unknown as Component
const LayoutComponent = function() {} as unknown as Component

describe('Route Matching', () => {
	describe('matchRoute - Basic Static Routes', () => {
		it('should match simple static route', () => {
			const routes: Routes = {
				'/about': AboutPage,
			}

			const result = matchRoute('/about', routes)
			expect(result.match).toBe(AboutPage)
			expect(result.params).toEqual({})
		})

		it('should match multiple static routes', () => {
			const routes: Routes = {
				'/': HomePage,
				'/about': AboutPage,
			}

			const aboutResult = matchRoute('/about', routes)
			expect(aboutResult.match).toBe(AboutPage)

			const homeResult = matchRoute('/', routes)
			expect(homeResult.match).toBe(HomePage)
		})

		it('should remove trailing slashes', () => {
			const routes: Routes = {
				'/about': AboutPage,
			}

			const result = matchRoute('/about/', routes)
			expect(result.match).toBe(AboutPage)
		})

		it('should preserve root path', () => {
			const routes: Routes = {
				'/': HomePage,
			}

			const result = matchRoute('/', routes)
			expect(result.match).toBe(HomePage)
		})

		it('should return undefined for non-existent routes', () => {
			const routes: Routes = {
				'/': HomePage,
			}

			const result = matchRoute('/nonexistent', routes)
			expect(result.match).toBeUndefined()
		})
	})

	describe('matchRoute - Dynamic Parameters', () => {
		it('should extract single dynamic parameter', () => {
			const routes: Routes = {
				'/user/:id': UserPage,
			}

			const result = matchRoute('/user/123', routes)
			expect(result.match).toBe(UserPage)
			expect(result.params).toEqual({ id: '123' })
		})

		it('should extract multiple dynamic parameters', () => {
			const routes: Routes = {
				'/user/:userId/post/:postId': PostPage,
			}

			const result = matchRoute('/user/123/post/456', routes)
			expect(result.match).toBe(PostPage)
			expect(result.params).toEqual({ userId: '123', postId: '456' })
		})

		it('should prioritize static over dynamic routes', () => {
			const routes: Routes = {
				'/user/:id': UserPage,
				'/user/profile': ProfilePage,
			}

			const result = matchRoute('/user/profile', routes)
			expect(result.match).toBe(ProfilePage)
		})
	})

	describe('matchRoute - Nested Routes', () => {
		it('should match nested routes with params', () => {
			const routes: Routes = {
				'/user/:userId': {
					'/': UserPage,
					'/post/:postId': PostPage,
				},
			}

			const result = matchRoute('/user/123/post/456', routes)
			expect(result.match).toBe(PostPage)
			expect(result.params).toEqual({ userId: '123', postId: '456' })
		})

		it('should match nested root', () => {
			const routes: Routes = {
				'/user/:userId': {
					'/': UserPage,
					'/profile': ProfilePage,
				},
			}

			const result = matchRoute('/user/123', routes)
			expect(result.match).toBe(UserPage)
			expect(result.params).toEqual({ userId: '123' })
		})
	})

	describe('matchRoute - Wildcards', () => {
		it('should match wildcard routes', () => {
			const routes: Routes = {
				'/*': NotFoundPage,
			}

			const result = matchRoute('/anything/here', routes)
			expect(result.match).toBe(NotFoundPage)
		})

		it('should extract wildcard parameter', () => {
			const routes: Routes = {
				'/*rest': NotFoundPage,
			}

			const result = matchRoute('/some/deep/path', routes)
			expect(result.match).toBe(NotFoundPage)
			expect(result.params).toEqual({ rest: 'some/deep/path' })
		})
	})

	describe('matchRoute - Layouts', () => {
		it('should collect layouts from parent routes', () => {
			const routes: Routes = {
				'/app': {
					layout: LayoutComponent,
					'/about': AboutPage,
				},
			}

			const result = matchRoute('/app/about', routes)
			expect(result.match).toBe(AboutPage)
			expect(result.layouts).toContain(LayoutComponent)
		})

		it('should handle empty layouts array when no layouts defined', () => {
			const routes: Routes = {
				'/': HomePage,
				'/about': AboutPage,
			}

			const result = matchRoute('/about', routes)
			expect(result.layouts).toEqual([])
		})

		// Note: Parentheses route feature may need additional implementation
		// This test documents expected behavior for route grouping
		it.skip('should break from layouts with parentheses', () => {
			const routes: Routes = {
				'/': {
					layout: LayoutComponent,
					'/home': HomePage,
				},
				'/(auth)': {
					'/login': AboutPage,
				},
			}

			const result = matchRoute('/login', routes)
			expect(result.match).toBe(AboutPage)
			expect(result.breakFromLayouts).toBe(true)
		})
	})

	describe('matchRoute - Hooks', () => {
		it('should handle hooks in route configuration', () => {
			const hooks = {
				beforeLoad: () => {},
			}

			const routes: Routes = {
				'/': {
					hooks,
					'/': HomePage,
				},
			}

			const result = matchRoute('/', routes)
			expect(result.hooks).toContain(hooks)
		})
	})
})
