'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PokemonDetails } from '@/components/pokemon/pokemon-details'
import { PokemonDetailsSkeleton } from '@/components/pokemon/pokemon-details-skeleton'
import { usePokemon } from '@/hooks/use-pokemon'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>
}

const MAX_POKEMON_ID = 1025 // Gen 1-9

export default function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const pokemonId = parseInt(id, 10)

  const { pokemon, isLoading, isError } = usePokemon(
    isNaN(pokemonId) ? id : pokemonId
  )

  const hasPrevious = pokemonId > 1
  const hasNext = pokemonId < MAX_POKEMON_ID

  const handleRetry = () => {
    router.refresh()
  }

  const navigateToPokemon = (newId: number) => {
    router.push(`/pokemon/${newId}`)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Pokedex</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>

            {/* Pokemon Navigation */}
            {!isLoading && pokemon && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateToPokemon(pokemonId - 1)}
                  disabled={!hasPrevious}
                  aria-label="Previous Pokemon"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                  {pokemonId} / {MAX_POKEMON_ID}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateToPokemon(pokemonId + 1)}
                  disabled={!hasNext}
                  aria-label="Next Pokemon"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Loading State */}
        {isLoading && <PokemonDetailsSkeleton />}

        {/* Error State */}
        {isError && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Pokemon Not Found</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <span>
                We could not find a Pokemon with ID or name &quot;{id}&quot;.
                Please check the URL and try again.
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Pokedex
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Pokemon Details */}
        {!isLoading && !isError && pokemon && (
          <PokemonDetails pokemon={pokemon} />
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
