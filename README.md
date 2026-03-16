# Pokedex Explorer

A modern, responsive Pokemon exploration application built with React, Next.js 15, and Tailwind CSS following **strict Test-Driven Development (TDD)** practices.

![Pokedex Explorer](./screenshots/listing-page.png)

## Live Demo

**[View Live Application](https://your-deployment-url.vercel.app)**

---

## Table of Contents

- [Features](#features)
- [TDD Approach](#tdd-approach)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Architectural Decisions](#architectural-decisions)
- [Trade-offs Made](#trade-offs-made)
- [AI Usage Details](#ai-usage-details)
- [Future Improvements](#future-improvements)

---

## Features

- **Pokemon Listing Page**: Browse all 1025 Pokemon in a responsive card grid
- **Global Search**: Search Pokemon by name across the entire dataset
- **Type Filtering**: Filter Pokemon by type (Fire, Water, Grass, etc.)
- **Pokemon Detail Page**: View stats, abilities, moves, and physical attributes
- **Responsive Design**: Mobile-first design optimized for all screen sizes
- **Loading States**: Skeleton loaders for smooth UX
- **Error Handling**: Graceful error states with retry functionality
- **Pagination**: Navigate through results with first/prev/next/last controls

---

## TDD Approach

This project was built following a **strict Test-Driven Development workflow**:

### The Red-Green-Refactor Cycle

```
1. RED    → Write a failing test that defines expected behavior
2. GREEN  → Write minimal code to make the test pass
3. REFACTOR → Improve code quality while keeping tests green
```

### TDD Implementation Examples

#### Example 1: API Utility Functions

```typescript
// RED: First, wrote the failing test
describe('extractPokemonId', () => {
  it('should extract ID from Pokemon URL', () => {
    const url = 'https://pokeapi.co/api/v2/pokemon/25/';
    expect(extractPokemonId(url)).toBe(25);
  });
});

// GREEN: Then implemented the minimal code
export function extractPokemonId(url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
}

// REFACTOR: Code was already clean, no changes needed
```

#### Example 2: Pokemon Card Component

```typescript
// RED: Test written first
describe('PokemonCard', () => {
  it('should render pokemon name and image', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Pikachu');
  });

  it('should display type badges', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('should navigate to detail page on click', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/pokemon/25');
  });
});

// GREEN: Component implemented to pass all tests
// REFACTOR: Extracted type badge styling to utility function
```

#### Example 3: Custom Hooks

```typescript
// RED: Test the hook behavior
describe('usePokemonByType', () => {
  it('should not fetch when type is null', () => {
    const { result } = renderHook(() => usePokemonByType(null));
    expect(result.current.pokemonOfType).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should fetch pokemon of a specific type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTypeResponse),
    });

    const { result } = renderHook(() => usePokemonByType('fire'));
    
    await waitFor(() => {
      expect(result.current.pokemonOfType).toHaveLength(3);
    });
  });
});

// GREEN: Implemented the hook with SWR
// REFACTOR: Added caching configuration for performance
```

### Test Categories

| Category | Description | Files |
|----------|-------------|-------|
| **Unit Tests** | Test individual functions in isolation | `pokemon.test.ts` |
| **Hook Tests** | Test custom React hooks | `use-pokemon.test.ts` |
| **Component Tests** | Test UI components with user interactions | `*.test.tsx` |
| **Integration Tests** | Test component + hook combinations | Filter + Grid tests |

### Test Coverage Goals

- **API utilities**: 100% coverage on data transformation functions
- **Custom hooks**: All edge cases (loading, error, empty states)
- **Components**: User-visible behavior and accessibility
- **Business logic**: Filtering, pagination, search algorithms

---

## Screenshots

### Listing Page
![Listing Page](./screenshots/listing-page.png)
*Responsive grid layout with Pokemon cards showing name, ID, and type badges*

### Pokemon Detail Page
![Detail Page](./screenshots/detail-page.png)
*Comprehensive Pokemon information with stats visualization*

### Search Functionality
![Search](./screenshots/search.png)
*Global search across all 1025 Pokemon*

### Type Filter
![Type Filter](./screenshots/type-filter.png)
*Filter by any of the 18 Pokemon types*

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type safety and developer experience |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Accessible UI components |
| **SWR** | Data fetching with caching |
| **Vitest** | Fast unit testing |
| **React Testing Library** | Component testing |
| **PokeAPI** | Pokemon data source |

---

## Setup Instructions

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pokedex-explorer.git
cd pokedex-explorer

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using shadcn CLI (Recommended)

```bash
npx shadcn@latest init
# Follow prompts, then add components as needed
```

---

## Running Tests

```bash
# Run all tests in watch mode
pnpm test

# Run tests with UI interface
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run specific test file
pnpm test pokemon-card.test.tsx
```

### Test Output Example

```
 ✓ lib/api/pokemon.test.ts (12 tests)
 ✓ hooks/use-pokemon.test.ts (15 tests)
 ✓ components/pokemon/pokemon-card.test.tsx (6 tests)
 ✓ components/pokemon/pokemon-filters.test.tsx (8 tests)
 ✓ components/pokemon/pokemon-details.test.tsx (7 tests)

 Test Files  5 passed (5)
      Tests  48 passed (48)
   Start at  10:30:45
   Duration  2.34s
```

---

## Project Structure

```
pokedex-explorer/
├── app/
│   ├── page.tsx                    # Home page (Pokemon listing)
│   ├── pokemon/[id]/page.tsx       # Pokemon detail page
│   ├── layout.tsx                  # Root layout with metadata
│   └── globals.css                 # Global styles & design tokens
│
├── components/
│   ├── pokemon/
│   │   ├── pokemon-card.tsx        # Individual Pokemon card
│   │   ├── pokemon-card.test.tsx   # Card tests (TDD)
│   │   ├── pokemon-card-skeleton.tsx
│   │   ├── pokemon-grid.tsx        # Card grid layout
│   │   ├── pokemon-filters.tsx     # Search & type filter
│   │   ├── pokemon-filters.test.tsx
│   │   ├── pokemon-details.tsx     # Detail view component
│   │   ├── pokemon-details.test.tsx
│   │   ├── pokemon-details-skeleton.tsx
│   │   ├── pokemon-pagination.tsx  # Pagination controls
│   │   └── index.ts                # Barrel exports
│   └── ui/                         # shadcn/ui components
│
├── hooks/
│   ├── use-pokemon.ts              # Pokemon data hooks
│   └── use-pokemon.test.ts         # Hook tests (TDD)
│
├── lib/
│   ├── api/
│   │   ├── pokemon.ts              # API utilities & fetcher
│   │   └── pokemon.test.ts         # API tests (TDD)
│   └── types/
│       └── pokemon.ts              # TypeScript interfaces
│
├── vitest.config.ts                # Vitest configuration
├── vitest.setup.ts                 # Test setup & mocks
└── README.md                       # This file
```

---

## Architectural Decisions

### 1. Data Fetching Strategy

**Decision**: Two-tier data fetching with SWR

```
Tier 1: All Pokemon names/IDs (lightweight, ~50KB, cached 5 min)
Tier 2: Detailed data for current page only (20 Pokemon at a time)
```

**Rationale**: 
- Enables instant global search without loading all details
- Minimizes bandwidth while maintaining responsive UX
- SWR handles caching, deduplication, and revalidation automatically

### 2. Global Filtering Architecture

**Decision**: Fetch Pokemon by type from `/type/{name}` endpoint

**Rationale**:
- PokeAPI provides all Pokemon of a type in one request
- Enables true global filtering (not just current page)
- Combined with name search for powerful filtering

### 3. Component Architecture

**Decision**: Feature-based organization with co-located tests

```
components/pokemon/
  ├── pokemon-card.tsx
  └── pokemon-card.test.tsx  # Test next to component
```

**Rationale**: 
- Easy to find related files
- Tests serve as documentation
- Encourages TDD workflow

### 4. State Management

**Decision**: React useState + SWR (no external state library)

**Rationale**:
- UI state (filters, pagination) is local
- Server state is managed by SWR
- No need for Redux/Zustand complexity

### 5. Testing Philosophy

**Decision**: Test behavior, not implementation

```typescript
// Good: Tests what user sees
expect(screen.getByText('Pikachu')).toBeInTheDocument();

// Avoid: Tests implementation details
expect(component.state.pokemonName).toBe('Pikachu');
```

**Rationale**: Tests should give confidence that the app works for users, not that internal details match expectations.

---

## Trade-offs Made

### 1. Client-Side vs. Server-Side Filtering

| Approach | Chosen | Alternative |
|----------|--------|-------------|
| Client-side filtering | Yes | Server-side with custom API |

**Pros of chosen approach**:
- Instant search results (no network latency)
- Works offline once data is loaded
- PokeAPI doesn't support server-side search

**Cons**:
- Initial load of all Pokemon names (~50KB)
- Type filtering requires fetching type endpoint

### 2. Pagination vs. Infinite Scroll

| Approach | Chosen | Alternative |
|----------|--------|-------------|
| Traditional pagination | Yes | Infinite scroll |

**Pros of chosen approach**:
- Direct navigation to any page
- Bookmarkable results
- Simpler to test and implement

**Cons**:
- Less "modern" mobile experience
- Requires explicit user action

### 3. Fetch Details On-Demand

| Approach | Chosen | Alternative |
|----------|--------|-------------|
| On-demand details | Yes | Pre-fetch all details |

**Pros of chosen approach**:
- Fast initial load
- Reduced bandwidth

**Cons**:
- Brief loading when changing pages
- Type filtering limited to known types from type endpoint

### 4. Dark Theme Only

| Approach | Chosen | Alternative |
|----------|--------|-------------|
| Dark theme default | Yes | Theme toggle |

**Pros of chosen approach**:
- Cohesive design
- Reduced scope
- Pokemon-themed aesthetic

**Cons**:
- No user preference
- Accessibility considerations

---

## AI Usage Details

This project was built with AI assistance (v0 by Vercel). Full transparency on usage:

### Where AI Was Used

| Area | AI Contribution | Human Oversight |
|------|-----------------|-----------------|
| **Test Cases** | Generated test structure and edge cases | Reviewed for meaningful assertions |
| **Component Code** | Scaffolded components from tests | Refined styling and UX |
| **API Utilities** | Generated fetcher and transformers | Validated against PokeAPI docs |
| **TypeScript Types** | Generated from API responses | Ensured completeness |
| **Documentation** | Drafted README structure | Edited for accuracy |

### Prompts Used

1. **Initial Setup**:
   > "Create a Pokemon listing page with card grid layout using PokeAPI, following TDD with Vitest"

2. **Testing Infrastructure**:
   > "Set up Vitest testing infrastructure with React Testing Library"

3. **Global Filtering**:
   > "Fix filtering to work across all Pokemon data, not just current page. Filter should show first 20 filtered results on page 1, next 20 on page 2"

4. **Type Filtering**:
   > "Add type-based filtering that fetches all Pokemon of that type from PokeAPI's type endpoint"

5. **Documentation**:
   > "Create a README as per TDD requirements with architectural decisions and trade-offs"

### Human Decisions Made

- Chose SWR over React Query for simplicity
- Decided on pagination over infinite scroll
- Selected color scheme and visual design
- Determined test coverage priorities
- Made all architectural trade-off decisions
- Reviewed and refined all generated code

### AI Limitations Encountered

- Initial type filtering only worked on current page (fixed with human guidance)
- Required explicit prompts for global filtering behavior
- README needed human editing for accuracy

---

## Future Improvements

- [ ] **Theme Toggle**: Add light/dark mode preference
- [ ] **Pokemon Comparison**: Compare stats side-by-side
- [ ] **Favorites**: Save favorites with localStorage
- [ ] **Evolution Chains**: Visualize evolution paths
- [ ] **PWA Support**: Offline access capability
- [ ] **i18n**: Multi-language support
- [ ] **E2E Tests**: Add Playwright/Cypress tests
- [ ] **Accessibility Audit**: WCAG 2.1 compliance review

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [PokeAPI](https://pokeapi.co/) - Comprehensive Pokemon data API
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Vercel](https://vercel.com/) - Deployment platform
- [Incubyte](https://incubyte.co/) - Engineering kata challenge
