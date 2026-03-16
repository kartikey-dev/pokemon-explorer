'use client'

import { usePokemonByType } from '@/hooks/use-pokemon'
import { PokemonCard } from './pokemon-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RelatedPokemonProps {
  currentId: number
  primaryType: string
}

export function RelatedPokemon({ currentId, primaryType }: RelatedPokemonProps) {
  const { pokemonOfType, isLoading, isError } = usePokemonByType(primaryType)

  // Filter out current pokemon and limit to 5
  const related = pokemonOfType
    .filter(p => p.id !== currentId)
    .slice(0, 5)

  if (isError || (!isLoading && related.length === 0)) {
    return null
  }

  return (
    <div className="mt-12 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-3 text-xl font-medium uppercase tracking-[0.2em] text-foreground font-logo">
          <div className="p-2 rounded-xl bg-primary/10">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          Related Species
          <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full font-sans tracking-widest ml-2">
            Same Type: {primaryType}
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[300px] glass rounded-3xl animate-pulse" />
          ))
        ) : (
          related.map((p) => (
            <div key={p.id} className="transform hover:scale-[1.02] transition-transform duration-300">
              <PokemonCard pokemon={p} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
