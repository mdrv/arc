import { describe, expect, it } from 'vitest'
import { constructPath, join } from '../../src/utils'

describe('Path Utilities', () => {
	describe('join', () => {
		it('should join simple paths', () => {
			expect(join('/', 'foo')).toBe('/foo')
			expect(join('/foo', 'bar')).toBe('/foo/bar')
			expect(join('/foo', '/bar')).toBe('/foo/bar')
		})

		it('should handle trailing slashes', () => {
			expect(join('/foo/', 'bar')).toBe('/foo/bar')
			expect(join('/foo/', '/bar')).toBe('/foo/bar')
			expect(join('/', 'foo/')).toBe('/foo')
		})

		it('should handle multiple segments', () => {
			expect(join('/', 'foo', 'bar', 'baz')).toBe('/foo/bar/baz')
			expect(join('/foo', '/bar', '/baz')).toBe('/foo/bar/baz')
		})

		it('should handle empty segments', () => {
			expect(join('/', '')).toBe('/')
			// Note: empty first segment creates leading slash
			expect(join('', 'foo')).toBe('//foo')
		})

		it('should prevent double slashes', () => {
			expect(join('/foo', '/bar')).toBe('/foo/bar')
			expect(join('/foo/', '/bar')).toBe('/foo/bar')
		})

		it('should handle root path', () => {
			// Note: single slash alone gets trailing slash removed
			expect(join('/')).toBe('')
			// Two slashes: first loses trailing slash, second adds leading slash
			expect(join('/', '/')).toBe('')
		})
	})

	describe('constructPath', () => {
		it('should replace single param', () => {
			expect(constructPath('/user/:id', { id: '123' })).toBe('/user/123')
		})

		it('should replace multiple params', () => {
			expect(constructPath('/user/:userId/post/:postId', {
				userId: '123',
				postId: '456',
			})).toBe('/user/123/post/456')
		})

		it('should handle path without params', () => {
			expect(constructPath('/about', {})).toBe('/about')
		})

		it('should return original path if no params object provided', () => {
			// @ts-expect-error Testing runtime behavior with null params
			expect(constructPath('/user/:id', null)).toBe('/user/:id')
			// @ts-expect-error Testing runtime behavior with undefined params
			expect(constructPath('/user/:id', undefined)).toBe('/user/:id')
		})

		it('should handle params at different positions', () => {
			expect(constructPath('/:lang/user/:id', {
				lang: 'en',
				id: '123',
			})).toBe('/en/user/123')
		})

		it('should handle special characters in param values', () => {
			expect(constructPath('/search/:query', {
				query: 'hello-world',
			})).toBe('/search/hello-world')
		})

		it('should only replace first occurrence of param name', () => {
			expect(constructPath('/:id/:id', { id: '123' })).toBe('/123/:id')
		})
	})
})
