# Pokedex Explorer

A modern, responsive Pokemon exploration application built with React, Next.js 15, and Tailwind CSS. Explore and discover Pokemon from all generations with powerful search and filtering capabilities.

![Pokedex Explorer Screenshot](./screenshots/listing-page.png)

## Live Demo

**[View Live Application](https://your-deployment-url.vercel.app)**

## Features

- **Pokemon Listing Page**: Browse all 1025 Pokemon in a responsive card grid layout
- **Global Search**: Search Pokemon by name across the entire dataset
- **Type Filtering**: Filter Pokemon by their type (Fire, Water, Grass, etc.)
- **Pokemon Detail Page**: View comprehensive information including stats, abilities, and moves
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Loading States**: Skeleton loaders for smooth user experience
- **Error Handling**: Graceful error states with retry functionality

## Screenshots

### Listing Page
![Listing Page](./screenshots/listing-page.png)

### Pokemon Detail Page
![Detail Page](./screenshots/detail-page.png)

### Search Functionality
![Search](./screenshots/search.png)

### Type Filter
![Type Filter](./screenshots/type-filter.png)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Data Fetching**: SWR (stale-while-revalidate)
- **Testing**: Vitest + React Testing Library
- **API**: [PokeAPI](https://pokeapi.co/)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pokedex-explorer.git
cd pokedex-explorer
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page (Pokemon listing)
│   ├── pokemon/[id]/page.tsx # Pokemon detail page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles and design tokens
├── components/
│   ├── pokemon/              # Pokemon-specific components
│   │   ├── pokemon-card.tsx
│   │   ├── pokemon-card.test.tsx
│   │   ├── pokemon-grid.tsx
│   │   ├── pokemon-filters.tsx
│   │   ├── pokemon-filters.test.tsx
│   │   ├── pokemon-details.tsx
│   │   ├── pokemon-details.test.tsx
│   │   ├── pokemon-pagination.tsx
│   │   └── ...
│   └── ui/                   # shadcn/ui components
├── hooks/
│   ├── use-pokemon.ts        # Pokemon data fetching hooks
│   └── use-pokemon.test.ts   # Hook tests
├── lib/
│   ├── api/
│   │   ├── pokemon.ts        # API utilities
│   │   └── pokemon.test.ts   # API tests
│   └── types/
│       └── pokemon.ts        # TypeScript types
└── vitest.config.ts          # Vitest configuration
```

## Architectural Decisions

### 1. Data Fetching Strategy

**Decision**: Use SWR for client-side data fetching with a two-tier approach:
- Fetch all Pokemon names/IDs upfront (lightweight, ~50KB)
- Fetch detailed Pokemon data only for the current page (20 at a time)

**Rationale**: This enables global search across all 1025 Pokemon while keeping network requests minimal. The Pokemon list is cached aggressively, and detailed data is fetched on-demand.

### 2. Component Architecture

**Decision**: Split components by feature (Pokemon) rather than by type.

**Rationale**: Co-locating related components, hooks, and tests improves maintainability and makes it easier to understand the feature as a whole.

### 3. State Management

**Decision**: Use React's built-in useState for UI state and SWR for server state.

**Rationale**: The application's state requirements are simple enough that external state management libraries (Redux, Zustand) would add unnecessary complexity. SWR handles caching, revalidation, and loading states automatically.

### 4. Styling Approach

**Decision**: Use Tailwind CSS with shadcn/ui components and CSS custom properties for theming.

**Rationale**: This combination provides:
- Rapid development with utility classes
- Accessible, well-tested base components
- Easy theming through CSS variables
- No runtime CSS-in-JS overhead

### 5. Testing Strategy

**Decision**: Focus on integration tests that test components as users interact with them.

**Rationale**: Following Testing Library's guiding principle: "The more your tests resemble the way your software is used, the more confidence they can give you."

## Trade-offs Made

### 1. Client-Side Filtering vs. Server-Side

**Trade-off**: Implemented client-side filtering with upfront data loading.

**Pros**:
- Instant search results (no network latency)
- Works offline once loaded
- Simpler implementation

**Cons**:
- Initial load fetches all Pokemon names (~50KB)
- Type filtering requires fetching details for current page first

**Why this choice**: The PokeAPI doesn't support server-side search/filtering, so client-side filtering is the only option for a good UX.

### 2. Pagination vs. Infinite Scroll

**Trade-off**: Chose traditional pagination over infinite scroll.

**Pros**:
- Users can navigate to any page directly
- Better for bookmarking specific results
- Simpler implementation and testing

**Cons**:
- Less "mobile-app-like" experience
- Requires explicit user action to load more

### 3. Pre-fetching vs. On-Demand Detail Loading

**Trade-off**: Fetch Pokemon details only when viewing the current page.

**Pros**:
- Reduced initial bandwidth usage
- Faster time to first meaningful paint

**Cons**:
- Type filtering only works within loaded Pokemon on current page
- Brief loading state when changing pages

### 4. Dark Theme Default

**Trade-off**: Defaulted to dark theme without theme toggle.

**Pros**:
- Cohesive, polished visual design
- Reduced scope for initial implementation

**Cons**:
- No light mode option for users who prefer it

## AI Usage Details

This project was built with assistance from AI (v0 by Vercel). Here's how AI was utilized:

### Code Generation
- **Scaffolding**: Initial project structure, component boilerplates, and TypeScript types
- **Test Cases**: Generated test cases for components, hooks, and utility functions
- **API Integration**: Pokemon API fetching logic and data transformation utilities

### Documentation
- **README Structure**: AI helped draft this README following best practices
- **Code Comments**: Generated JSDoc comments for functions and components

### Design
- **Color Scheme**: AI suggested a Pokemon-themed dark color palette
- **Component Styling**: Tailwind class combinations for responsive layouts

### Prompts Used
1. "Create a Pokemon listing page with card grid layout using PokeAPI"
2. "Add comprehensive filtering with search by name and filter by type"
3. "Create Pokemon detail page with stats visualization"
4. "Set up Vitest testing infrastructure with React Testing Library"
5. "Fix filtering to work across all Pokemon, not just current page"

### Human Decisions
- Architectural decisions (SWR over React Query, pagination over infinite scroll)
- Trade-off evaluations
- Code review and refinement
- Final testing and bug fixes

## Performance Considerations

- **SWR Caching**: Pokemon data is cached to minimize redundant API calls
- **Debounced Search**: Search input is debounced (300ms) to prevent excessive filtering
- **Image Optimization**: Uses official artwork from PokeAPI CDN
- **Code Splitting**: Next.js automatically code-splits by route

## Future Improvements

- [ ] Add light/dark theme toggle
- [ ] Implement Pokemon comparison feature
- [ ] Add favorites/bookmarks (with localStorage or database)
- [ ] Server-side search using a custom API layer
- [ ] Add Pokemon evolution chain visualization
- [ ] Implement PWA support for offline access
- [ ] Add internationalization (i18n)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [PokeAPI](https://pokeapi.co/) for the comprehensive Pokemon data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Vercel](https://vercel.com/) for hosting and deployment
