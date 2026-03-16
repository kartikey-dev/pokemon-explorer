import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PokemonFilters } from './pokemon-filters'
import type { PokemonFilters as Filters } from '@/lib/types/pokemon'

// Mock the usePokemonTypes hook
vi.mock('@/hooks/use-pokemon', () => ({
  usePokemonTypes: () => ({
    types: [
      { name: 'fire', url: '' },
      { name: 'water', url: '' },
      { name: 'grass', url: '' },
    ],
    isLoading: false,
    isError: false,
  }),
}))

describe('PokemonFilters', () => {
  const defaultFilters: Filters = {
    search: '',
    type: null,
  }

  const mockOnFiltersChange = vi.fn()

  beforeEach(() => {
    mockOnFiltersChange.mockClear()
  })

  it('should render search input', () => {
    render(
      <PokemonFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(
      screen.getByLabelText('Search Pokemon by name')
    ).toBeInTheDocument()
  })

  it('should render type filter dropdown', () => {
    render(
      <PokemonFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(
      screen.getByLabelText('Filter by Pokemon type')
    ).toBeInTheDocument()
  })

  it('should call onFiltersChange with debounced search', async () => {
    vi.useFakeTimers()

    render(
      <PokemonFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const searchInput = screen.getByLabelText('Search Pokemon by name')
    fireEvent.change(searchInput, { target: { value: 'pikachu' } })

    // Should not call immediately
    expect(mockOnFiltersChange).not.toHaveBeenCalled()

    // Fast-forward debounce timer
    vi.advanceTimersByTime(300)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'pikachu',
        type: null,
      })
    })

    vi.useRealTimers()
  })

  it('should convert search to lowercase', async () => {
    vi.useFakeTimers()

    render(
      <PokemonFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const searchInput = screen.getByLabelText('Search Pokemon by name')
    fireEvent.change(searchInput, { target: { value: 'PIKACHU' } })

    vi.advanceTimersByTime(300)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'pikachu',
        type: null,
      })
    })

    vi.useRealTimers()
  })

  it('should show clear filters button when filters are active', () => {
    const activeFilters: Filters = {
      search: 'pikachu',
      type: null,
    }

    render(
      <PokemonFilters
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByText('Clear Filters')).toBeInTheDocument()
  })

  it('should not show clear filters button when no filters are active', () => {
    render(
      <PokemonFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument()
  })

  it('should clear all filters when clear button is clicked', () => {
    const activeFilters: Filters = {
      search: 'pikachu',
      type: 'electric',
    }

    render(
      <PokemonFilters
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    fireEvent.click(screen.getByText('Clear Filters'))

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      search: '',
      type: null,
    })
  })

  it('should display current search value', () => {
    const filtersWithSearch: Filters = {
      search: 'char',
      type: null,
    }

    render(
      <PokemonFilters
        filters={filtersWithSearch}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const searchInput = screen.getByLabelText('Search Pokemon by name')
    expect(searchInput).toHaveValue('char')
  })
})
