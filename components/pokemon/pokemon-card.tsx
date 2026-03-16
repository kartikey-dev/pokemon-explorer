'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  capitalizeName,
  formatPokemonId,
  typeColors,
} from '@/lib/api/pokemon'
import type { PokemonCardData } from '@/lib/types/pokemon'

interface PokemonCardProps {
  pokemon: PokemonCardData
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const { id, name, image, types } = pokemon
  const primaryType = types[0] || 'normal'
  const typeColor = typeColors[primaryType] || typeColors.normal

  return (
    <Link href={`/pokemon/${id}`} aria-label={`View details for ${capitalizeName(name)}`}>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-0 bg-card shadow-lg rounded-2xl">
        {/* Type-based gradient background */}
        <div
          className={`absolute inset-0 opacity-[0.08] ${typeColor.bg}`}
          aria-hidden="true"
        />
        {/* Decorative pokeball pattern */}
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-[12px] border-current opacity-[0.03]"
          aria-hidden="true"
        />
        <CardContent className="relative p-5">
          <div className="flex flex-col items-center gap-3">
            {/* Pokemon ID */}
            <span className="absolute top-3 right-3 text-xs font-mono text-muted-foreground/70 font-medium">
              {formatPokemonId(id)}
            </span>

            {/* Pokemon Image Container */}
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              {/* Glow effect on hover */}
              <div
                className={`absolute inset-0 rounded-full opacity-0 blur-2xl ${typeColor.bg} transition-opacity duration-300 group-hover:opacity-30`}
                aria-hidden="true"
              />
              {image ? (
                <Image
                  src={image}
                  alt={capitalizeName(name)}
                  fill
                  sizes="128px"
                  className="object-contain drop-shadow-md"
                  priority={id <= 20}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                  <span className="text-4xl text-muted-foreground">?</span>
                </div>
              )}
            </div>

            {/* Pokemon Name */}
            <h3 className="text-base sm:text-lg font-semibold text-foreground text-center leading-tight">
              {capitalizeName(name)}
            </h3>

            {/* Pokemon Types */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {types.map((type) => {
                const color = typeColors[type] || typeColors.normal
                return (
                  <Badge
                    key={type}
                    className={`${color.bg} ${color.text} text-[10px] sm:text-xs capitalize px-2.5 py-0.5 rounded-full font-medium`}
                    variant="secondary"
                  >
                    {type}
                  </Badge>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
