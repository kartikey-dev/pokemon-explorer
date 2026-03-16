'use client'

import { useState, useMemo, useCallback } from 'react'
import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { PokemonFilters } from '@/components/pokemon/pokemon-filters'
import { PokemonPagination } from '@/components/pokemon/pokemon-pagination'
import { usePokemonList, usePokemonDetails } from '@/hooks/use-pokemon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import type { PokemonFilters as Filters, PokemonCardData } from '@/lib/types/pokemon'

const ITEMS_PER_PAGE = 20
const TOTAL_POKEMON = 1025 // Gen 1-9

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({ search: '', type: null })

  // Calculate offset for API
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  // Fetch pokemon list
  const {
    pokemonList,
    totalCount,
    isLoading: listLoading,
    isError: listError,
    mutate: refetchList,
  } = usePokemonList(ITEMS_PER_PAGE, offset)

  // Fetch pokemon details for cards
  const {
    pokemonDetails,
    isLoading: detailsLoading,
    isError: detailsError,
  } = usePokemonDetails(pokemonList)

  // Filter pokemon based on search and type
  const filteredPokemon = useMemo(() => {
    let result = pokemonDetails

    // Filter by search term
    if (filters.search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Filter by type
    if (filters.type) {
      result = result.filter((p) =>
        p.types.includes(filters.type as string)
      )
    }

    return result
  }, [pokemonDetails, filters])

  // Calculate total pages
  const totalPages = Math.ceil(Math.min(totalCount, TOTAL_POKEMON) / ITEMS_PER_PAGE)

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Handle filter change - reset to page 1 when filtering
  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
  }, [])

  // Handle retry
  const handleRetry = useCallback(() => {
    refetchList()
  }, [refetchList])

  const isLoading = listLoading || detailsLoading
  const isError = listError || detailsError

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
                  Showing {filteredPokemon.length} of {ITEMS_PER_PAGE} loaded
                </p>
                <p className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages}
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

        {/* Pagination */}
        {!isLoading && !isError && filteredPokemon.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <PokemonPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Total Pokemon: {Math.min(totalCount, TOTAL_POKEMON).toLocaleString()}
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
