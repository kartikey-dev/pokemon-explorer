'use client'

import { PokemonCard } from './pokemon-card'
import { PokemonCardSkeleton } from './pokemon-card-skeleton'
import type { PokemonCardData } from '@/lib/types/pokemon'
import { cn } from '@/lib/utils'

interface PokemonGridProps {
  pokemon: PokemonCardData[]
  isLoading?: boolean
  skeletonCount?: number
  className?: string
}

export function PokemonGrid({
  pokemon,
  isLoading = false,
  skeletonCount = 20,
  className,
}: PokemonGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
          className
        )}
        role="status"
        aria-label="Loading Pokemon"
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <PokemonCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
      role="list"
      aria-label="Pokemon list"
    >
      {pokemon.map((p, index) => (
        <div 
          key={p.id} 
          role="listitem"
          className="animate-slide-up"
          style={{ 
            animationDelay: `${Math.min(index * 30, 600)}ms`,
            animationFillMode: 'both'
          }}
        >
          <PokemonCard pokemon={p} />
        </div>
      ))}
    </div>
  )
}
