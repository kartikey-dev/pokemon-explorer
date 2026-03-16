'use client'

import { useState, useMemo, useCallback } from 'react'
import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { PokemonFilters } from '@/components/pokemon/pokemon-filters'
import { PokemonPagination } from '@/components/pokemon/pokemon-pagination'
import { useAllPokemon, usePokemonByType, usePokemonDetails } from '@/hooks/use-pokemon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import type { PokemonFilters as Filters, PokemonCardData } from '@/lib/types/pokemon'

const ITEMS_PER_PAGE = 20

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({ search: '', type: null })

  // Fetch ALL Pokemon basic info (names and IDs)
  const {
    allPokemon,
    totalCount,
    isLoading: listLoading,
    isError: listError,
    mutate: refetchList,
  } = useAllPokemon()

  // Fetch Pokemon of selected type (if type filter is active)
  const {
    pokemonOfType,
    isLoading: typeLoading,
    isError: typeError,
  } = usePokemonByType(filters.type)

  // Determine base list: if type filter is active, use Pokemon of that type; otherwise use all
  const basePokemonList = useMemo(() => {
    if (filters.type) {
      return pokemonOfType
    }
    return allPokemon
  }, [filters.type, pokemonOfType, allPokemon])

  // Apply name search filter to the base list
  const filteredPokemon = useMemo(() => {
    if (!filters.search) return basePokemonList
    const searchLower = filters.search.toLowerCase()
    return basePokemonList.filter((p) =>
      p.name.toLowerCase().includes(searchLower)
    )
  }, [basePokemonList, filters.search])

  // Calculate pagination based on fully filtered results
  const totalFilteredCount = filteredPokemon.length
  const totalPages = Math.ceil(totalFilteredCount / ITEMS_PER_PAGE)

  // Get current page's Pokemon IDs from filtered results
  const currentPagePokemon = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredPokemon.slice(startIndex, endIndex)
  }, [filteredPokemon, currentPage])

  const currentPagePokemonIds = useMemo(() => {
    return currentPagePokemon.map((p) => p.id)
  }, [currentPagePokemon])

  // Fetch full details (including all types) for current page's Pokemon only
  const {
    pokemonDetails,
    isLoading: detailsLoading,
  } = usePokemonDetails(currentPagePokemonIds)

  // Use fetched details if available, otherwise use basic data from filtered list
  const displayPokemon = useMemo(() => {
    if (pokemonDetails.length > 0) {
      return pokemonDetails
    }
    return currentPagePokemon
  }, [pokemonDetails, currentPagePokemon])

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Handle filter change - reset to page 1 when filtering
  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Handle retry
  const handleRetry = useCallback(() => {
    refetchList()
  }, [refetchList])

  // Loading state: show skeleton when loading initial data or when changing type filter
  const isInitialLoading = listLoading || (filters.type && typeLoading)
  const isPageLoading = detailsLoading
  const isError = listError || typeError

  // Show filtered count info
  const showingText = useMemo(() => {
    if (totalFilteredCount === 0) return 'No results'
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalFilteredCount)
    return `Showing ${start}-${end} of ${totalFilteredCount.toLocaleString()}`
  }, [currentPage, totalFilteredCount])

  const filterDescription = useMemo(() => {
    const parts: string[] = []
    if (filters.type) parts.push(`Type: ${filters.type}`)
    if (filters.search) parts.push(`Search: "${filters.search}"`)
    return parts.length > 0 ? parts.join(', ') : null
  }, [filters])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  Pokedex Explorer
                </h1>
                <p className="text-muted-foreground mt-1">
                  Discover and explore Pokemon from all generations
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm text-muted-foreground">
                  {showingText}
                </p>
                {filterDescription && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {filterDescription}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages || 1}
                </p>
              </div>
            </div>

            {/* Filters */}
            <PokemonFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Pokemon</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                Something went wrong while fetching Pokemon data. Please try again.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="ml-4"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Pokemon Grid */}
        <PokemonGrid
          pokemon={displayPokemon as PokemonCardData[]}
          isLoading={!!isInitialLoading || isPageLoading}
          skeletonCount={ITEMS_PER_PAGE}
        />

        {/* No Results */}
        {!isInitialLoading && !isError && filteredPokemon.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No Pokemon found matching your filters.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or type filter.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => handleFiltersChange({ search: '', type: null })}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isInitialLoading && !isError && totalFilteredCount > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <PokemonPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isPageLoading}
            />
            <p className="text-sm text-muted-foreground">
              Total Pokemon: {totalCount.toLocaleString()}
              {(filters.search || filters.type) && (
                <span className="ml-1">
                  ({totalFilteredCount.toLocaleString()} matching filters)
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Data provided by{' '}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              PokeAPI
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}
