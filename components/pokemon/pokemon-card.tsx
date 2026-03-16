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
      <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-border/50 bg-card">
        <div
          className={`absolute inset-0 opacity-10 ${typeColor.bg}`}
          aria-hidden="true"
        />
        <CardContent className="relative p-4">
          <div className="flex flex-col items-center gap-3">
            {/* Pokemon ID */}
            <span className="absolute top-2 right-2 text-xs font-mono text-muted-foreground">
              {formatPokemonId(id)}
            </span>

            {/* Pokemon Image */}
            <div className="relative h-32 w-32 transition-transform duration-300 group-hover:scale-110">
              {image ? (
                <Image
                  src={image}
                  alt={capitalizeName(name)}
                  fill
                  sizes="128px"
                  className="object-contain drop-shadow-lg"
                  priority={id <= 20}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                  <span className="text-4xl text-muted-foreground">?</span>
                </div>
              )}
            </div>

            {/* Pokemon Name */}
            <h3 className="text-lg font-semibold text-foreground text-center">
              {capitalizeName(name)}
            </h3>

            {/* Pokemon Types */}
            <div className="flex flex-wrap justify-center gap-2">
              {types.map((type) => {
                const color = typeColors[type] || typeColors.normal
                return (
                  <Badge
                    key={type}
                    className={`${color.bg} ${color.text} text-xs capitalize`}
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
