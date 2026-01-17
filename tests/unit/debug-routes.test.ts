import type { Component } from 'svelte'
import { describe, expect, it } from 'vitest'
import type { Routes } from '../../src/types'
import { getRoutePaths, matchRoute, sortRoutes } from '../../src/utils'

// Mock component as a function (closer to real Svelte components)
const TestComponent = function() {} as unknown as Component
const HomePage = function() {} as unknown as Component
const UserPage = function() {} as unknown as Component

describe('Route Matching Debug', () => {
	it('should debug simple route matching', () => {
		const routes: Routes = {
			'/about': TestComponent,
		}

		console.log('Routes:', routes)
		console.log('Object.keys:', Object.keys(routes))

		// Manually trace through matchRoute
		const pathname = '/about'
		const pathParts = pathname.split('/').slice(1)
		console.log('pathParts:', pathParts)

		const allRoutes = Object.keys(routes).filter(k => k !== 'layout' && k !== 'hooks')
		console.log('allRoutes:', allRoutes)

		const route = allRoutes[0]
		const routeParts = route.split('/')
		console.log('routeParts before shift:', routeParts)
		if (routeParts[0] === '') routeParts.shift()
		console.log('routeParts after shift:', routeParts)

		const resolvedPath = '/' + routeParts.join('/')
		console.log('resolvedPath:', resolvedPath)
		console.log('routes[resolvedPath]:', routes[resolvedPath as keyof Routes])

		const result = matchRoute('/about', routes)
		console.log('Match result:', result)
		console.log('Match:', result.match)
		console.log('Params:', result.params)
		console.log('Layouts:', result.layouts)
	})

	it('should debug route sorting', () => {
		const routes = ['/*', '/about', '/user/:id']
		console.log('Original:', routes)

		const sorted = sortRoutes(routes)
		console.log('Sorted:', sorted)

		// Check what getRoutePriority returns for each
		routes.forEach(route => {
			const priority = route === '' || route === '/'
				? 1
				: route.startsWith('*')
				? 4
				: route.includes(':')
				? 3
				: 2
			console.log(`Route "${route}" priority: ${priority}`)
		})
	})

	it('should debug parentheses route', () => {
		const LayoutComponent = function() {} as unknown as Component
		const AboutPage = function() {} as unknown as Component

		const routes: Routes = {
			'/': {
				layout: LayoutComponent,
				'/home': HomePage,
			},
			'/(auth)': {
				'/login': AboutPage,
			},
		}

		console.log('Matching /login')
		const result = matchRoute('/login', routes)
		console.log('Result:', result)
		console.log('Match:', result.match)
		console.log('Break from layouts:', result.breakFromLayouts)
	})
})
