'use client'

import { PokemonCard } from './pokemon-card'
import { PokemonCardSkeleton } from './pokemon-card-skeleton'
import type { PokemonCardData } from '@/lib/types/pokemon'

interface PokemonGridProps {
  pokemon: PokemonCardData[]
  isLoading?: boolean
  skeletonCount?: number
}

export function PokemonGrid({
  pokemon,
  isLoading = false,
  skeletonCount = 20,
}: PokemonGridProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        role="status"
        aria-label="Loading Pokemon"
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Pokemon Found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      role="list"
      aria-label="Pokemon list"
    >
      {pokemon.map((p) => (
        <div key={p.id} role="listitem">
          <PokemonCard pokemon={p} />
        </div>
      ))}
    </div>
  )
}
