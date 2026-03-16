'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PokemonDetails } from '@/components/pokemon/pokemon-details'
import { PokemonDetailsSkeleton } from '@/components/pokemon/pokemon-details-skeleton'
import { ThemeToggle } from '@/components/theme-toggle'
import { usePokemon } from '@/hooks/use-pokemon'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>
}

export default function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = use(params)
  const pokemonId = parseInt(id, 10)

  const { pokemon, isLoading, isError, mutate } = usePokemon(
    isNaN(pokemonId) ? id : pokemonId
  )

  const handleRetry = () => {
    mutate()
  }

  return (
    <main className="min-h-screen pokemon-bg-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2 hover:bg-secondary/80">
                <ArrowLeft className="h-4 w-4" />
                <span>Pokedex</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Loading State */}
        {isLoading && <PokemonDetailsSkeleton />}

        {/* Error State */}
        {isError && !isLoading && (
          <Alert variant="destructive" className="max-w-lg mx-auto">
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
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm mt-auto">
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
