# documentation-api-reference Specification

## Purpose
TBD - created by archiving change add-docs-examples-and-api-page. Update Purpose after archive.
## Requirements
### Requirement: Comprehensive API Documentation Page

The documentation site SHALL provide a complete API reference page at `/arc/api` documenting all public exports from the library.

#### Scenario: User navigates to API page

- **WHEN** user clicks the "API" link in navigation
- **THEN** they are taken to `/arc/api` page
- **AND** the page loads successfully (no 404)

#### Scenario: User finds API documentation

- **WHEN** user views the API reference page
- **THEN** they see all public exports organized by category
- **AND** each API has a description and usage example

### Requirement: Core Router API Documentation

The API page SHALL document the Core Router API including `createRouter`, `Router`, `navigate`, and `route`.

#### Scenario: User looks up createRouter

- **WHEN** user views the Core Router API section
- **THEN** they see `createRouter` function signature
- **AND** they see parameter descriptions and return value
- **AND** they see a usage example

#### Scenario: User wants to use navigate function

- **WHEN** user views the navigation documentation
- **THEN** they see all navigate options (path, transition, replace, etc.)
- **AND** they see examples of programmatic navigation

### Requirement: View Transitions API Documentation

The API page SHALL document View Transition utilities including `transitionPresets`, `generateTransitionCSS`, `supportsViewTransitions`, and `viewTransitionName`.

#### Scenario: User explores transition presets

- **WHEN** user views the View Transitions section
- **THEN** they see all available presets (fade, slide, scale, material, none)
- **AND** they see how to use each preset

#### Scenario: User needs transition CSS

- **WHEN** user looks up `generateTransitionCSS`
- **THEN** they see when and how to use it
- **AND** they see an example with `svelte:head`

### Requirement: TypeScript Types Documentation

The API page SHALL document all exported TypeScript types for developers using the library.

#### Scenario: User needs type information

- **WHEN** user views the Types section
- **THEN** they see all exported types (Routes, NavigateOptions, TransitionConfig, etc.)
- **AND** each type shows its structure

### Requirement: Utilities Documentation

The API page SHALL document utility exports including `Loader`, `searchParams`, and helper functions.

#### Scenario: User wants to use image loader

- **WHEN** user views the Utilities section
- **THEN** they see `Loader` class documentation
- **AND** they see how to track image loading progress

