'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  capitalizeName,
  formatPokemonId,
  formatStatName,
  getStatColor,
  typeColors,
} from '@/lib/api/pokemon'
import type { Pokemon } from '@/lib/types/pokemon'

interface PokemonDetailsProps {
  pokemon: Pokemon
}

export function PokemonDetails({ pokemon }: PokemonDetailsProps) {
  const image =
    pokemon.sprites.other?.['official-artwork'].front_default ||
    pokemon.sprites.front_default

  const primaryType = pokemon.types[0]?.type.name || 'normal'
  const typeColor = typeColors[primaryType] || typeColors.normal

  // Calculate total stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  const maxPossibleStats = 600 // Rough benchmark for legendary stats

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
        {/* Pokemon Image */}
        <div className="relative">
          <div
            className={`absolute inset-0 rounded-full opacity-20 blur-3xl ${typeColor.bg}`}
            aria-hidden="true"
          />
          <div className="relative h-64 w-64 sm:h-80 sm:w-80">
            {image ? (
              <Image
                src={image}
                alt={capitalizeName(pokemon.name)}
                fill
                sizes="(max-width: 640px) 256px, 320px"
                className="object-contain drop-shadow-2xl"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <span className="text-6xl text-muted-foreground">?</span>
              </div>
            )}
          </div>
        </div>

        {/* Pokemon Info */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <div>
            <span className="text-sm font-mono text-muted-foreground">
              {formatPokemonId(pokemon.id)}
            </span>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              {capitalizeName(pokemon.name)}
            </h1>
          </div>

          {/* Types */}
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {pokemon.types.map((typeSlot) => {
              const color = typeColors[typeSlot.type.name] || typeColors.normal
              return (
                <Badge
                  key={typeSlot.type.name}
                  className={`${color.bg} ${color.text} text-sm px-3 py-1 capitalize`}
                  variant="secondary"
                >
                  {typeSlot.type.name}
                </Badge>
              )
            })}
          </div>

          {/* Physical Info */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto lg:mx-0">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {(pokemon.height / 10).toFixed(1)}m
                </p>
                <p className="text-sm text-muted-foreground">Height</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {(pokemon.weight / 10).toFixed(1)}kg
                </p>
                <p className="text-sm text-muted-foreground">Weight</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Separator />

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Base Stats</span>
            <span className="text-sm font-normal text-muted-foreground">
              Total: {totalStats}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pokemon.stats.map((stat) => {
            const percentage = Math.min((stat.base_stat / 255) * 100, 100)
            const statColor = getStatColor(stat.base_stat)

            return (
              <div key={stat.stat.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {formatStatName(stat.stat.name)}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {stat.base_stat}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  indicatorClassName={statColor}
                />
              </div>
            )
          })}

          {/* Total Stats Bar */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Total</span>
              <span className="font-mono text-muted-foreground">
                {totalStats} / {maxPossibleStats}
              </span>
            </div>
            <Progress
              value={Math.min((totalStats / maxPossibleStats) * 100, 100)}
              className="h-3 mt-1"
              indicatorClassName={getStatColor(totalStats / 6)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Abilities Section */}
      <Card>
        <CardHeader>
          <CardTitle>Abilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((abilitySlot) => (
              <Badge
                key={abilitySlot.ability.name}
                variant={abilitySlot.is_hidden ? 'outline' : 'secondary'}
                className="capitalize"
              >
                {capitalizeName(abilitySlot.ability.name)}
                {abilitySlot.is_hidden && (
                  <span className="ml-1 text-xs opacity-70">(Hidden)</span>
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Moves Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Moves</span>
            <span className="text-sm font-normal text-muted-foreground">
              {pokemon.moves.length} total
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {pokemon.moves.slice(0, 20).map((moveSlot) => (
              <Badge
                key={moveSlot.move.name}
                variant="outline"
                className="capitalize"
              >
                {capitalizeName(moveSlot.move.name)}
              </Badge>
            ))}
            {pokemon.moves.length > 20 && (
              <Badge variant="outline" className="bg-muted">
                +{pokemon.moves.length - 20} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
