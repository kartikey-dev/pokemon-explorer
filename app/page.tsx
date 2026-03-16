'use client'

import { useState, useMemo, useCallback } from 'react'
import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { PokemonFilters } from '@/components/pokemon/pokemon-filters'
import { PokemonPagination } from '@/components/pokemon/pokemon-pagination'
import { useAllPokemon, usePokemonDetails } from '@/hooks/use-pokemon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import type { PokemonFilters as Filters, PokemonCardData } from '@/lib/types/pokemon'

const ITEMS_PER_PAGE = 20

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({ search: '', type: null })

  // Fetch ALL Pokemon basic info (just names and IDs)
  const {
    allPokemon,
    totalCount,
    isLoading: listLoading,
    isError: listError,
    mutate: refetchList,
  } = useAllPokemon()

  // First, filter by name (can be done without fetching details)
  const nameFilteredPokemon = useMemo(() => {
    if (!filters.search) return allPokemon
    return allPokemon.filter((p) =>
      p.name.toLowerCase().includes(filters.search.toLowerCase())
    )
  }, [allPokemon, filters.search])

  // Calculate pagination for filtered results
  const totalFilteredCount = nameFilteredPokemon.length
  const totalPages = Math.ceil(totalFilteredCount / ITEMS_PER_PAGE)

  // Get current page's Pokemon IDs
  const currentPagePokemonIds = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return nameFilteredPokemon.slice(startIndex, endIndex).map((p) => p.id)
  }, [nameFilteredPokemon, currentPage])

  // Fetch details for current page's Pokemon only
  const {
    pokemonDetails,
    isLoading: detailsLoading,
    isError: detailsError,
  } = usePokemonDetails(currentPagePokemonIds)

  // Filter by type (requires fetched details)
  const filteredPokemon = useMemo(() => {
    if (!filters.type) return pokemonDetails
    return pokemonDetails.filter((p) =>
      p.types.includes(filters.type as string)
    )
  }, [pokemonDetails, filters.type])

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

  const isLoading = listLoading || detailsLoading
  const isError = listError || detailsError

  // Show filtered count info
  const showingText = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalFilteredCount)
    return `Showing ${start}-${end} of ${totalFilteredCount.toLocaleString()}`
  }, [currentPage, totalFilteredCount])

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
          pokemon={filteredPokemon as PokemonCardData[]}
          isLoading={isLoading}
          skeletonCount={ITEMS_PER_PAGE}
        />

        {/* No Results */}
        {!isLoading && !isError && filteredPokemon.length === 0 && totalFilteredCount === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No Pokemon found matching your search.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => handleFiltersChange({ search: '', type: null })}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalFilteredCount > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <PokemonPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Total Pokemon: {totalCount.toLocaleString()}
              {filters.search && ` (${totalFilteredCount.toLocaleString()} matching)`}
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
