'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  capitalizeName,
  formatPokemonId,
  formatStatName,
  typeColors,
} from '@/lib/api/pokemon'
import type { Pokemon } from '@/lib/types/pokemon'

interface PokemonDetailsProps {
  pokemon: Pokemon
}

const MAX_POKEMON_ID = 1025

// Type weaknesses mapping (simplified)
const typeWeaknesses: Record<string, string[]> = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['electric', 'grass'],
  electric: ['ground'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel'],
}

// Get stat bar color
const getStatBarColor = (statName: string): string => {
  const colors: Record<string, string> = {
    hp: 'bg-red-500',
    attack: 'bg-orange-500',
    defense: 'bg-yellow-500',
    'special-attack': 'bg-emerald-500',
    'special-defense': 'bg-teal-500',
    speed: 'bg-rose-500',
  }
  return colors[statName] || 'bg-primary'
}

export function PokemonDetails({ pokemon }: PokemonDetailsProps) {
  const [showShiny, setShowShiny] = useState(false)

  const primaryType = pokemon.types[0]?.type.name || 'normal'
  const typeColor = typeColors[primaryType] || typeColors.normal

  // Get image based on shiny toggle
  const normalImage =
    pokemon.sprites.other?.['official-artwork'].front_default ||
    pokemon.sprites.front_default
  const shinyImage =
    pokemon.sprites.other?.['official-artwork'].front_shiny ||
    pokemon.sprites.front_shiny
  const currentImage = showShiny && shinyImage ? shinyImage : normalImage

  // Calculate weaknesses from types
  const weaknesses = Array.from(
    new Set(
      pokemon.types.flatMap(
        (t) => typeWeaknesses[t.type.name] || []
      )
    )
  ).slice(0, 4)

  const hasPrevious = pokemon.id > 1
  const hasNext = pokemon.id < MAX_POKEMON_ID

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-card shadow-xl type-gradient-${primaryType}`}
    >
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Side - Pokemon Image Section */}
        <div className="relative p-6 lg:p-10 flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px]">
          {/* Pokemon Name & ID Header */}
          <div className="absolute top-6 left-6 lg:top-10 lg:left-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              {capitalizeName(pokemon.name)}
            </h1>
            <span className="text-lg text-muted-foreground font-mono">
              {formatPokemonId(pokemon.id)}
            </span>
            {/* Type Badges */}
            <div className="flex gap-2 mt-3">
              {pokemon.types.map((typeSlot) => {
                const color = typeColors[typeSlot.type.name] || typeColors.normal
                return (
                  <Badge
                    key={typeSlot.type.name}
                    className={`${color.bg} ${color.text} text-xs px-3 py-1 capitalize rounded-full`}
                  >
                    {typeSlot.type.name}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Previous Pokemon Navigation */}
          {hasPrevious && (
            <Link
              href={`/pokemon/${pokemon.id - 1}`}
              className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 group"
            >
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-6 w-6" />
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-mono">
                    {formatPokemonId(pokemon.id - 1)}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Next Pokemon Navigation */}
          {hasNext && (
            <Link
              href={`/pokemon/${pokemon.id + 1}`}
              className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 group"
            >
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-mono">
                    {formatPokemonId(pokemon.id + 1)}
                  </p>
                </div>
                <ChevronRight className="h-6 w-6" />
              </div>
            </Link>
          )}

          {/* Pokemon Image */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mt-16 lg:mt-12">
            {/* Glow Effect */}
            <div
              className={`absolute inset-0 rounded-full opacity-30 blur-3xl ${typeColor.bg}`}
              aria-hidden="true"
            />
            {currentImage ? (
              <Image
                src={currentImage}
                alt={capitalizeName(pokemon.name)}
                fill
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                className="object-contain drop-shadow-2xl z-10"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <span className="text-6xl text-muted-foreground">?</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Info Panel */}
        <div className="bg-card/80 backdrop-blur-sm p-6 lg:p-10 lg:rounded-l-[3rem] border-l border-border/50">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="moves">Moves</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6 mt-0">
              {/* Weaknesses */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Weaknesses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.map((weakness) => {
                    const color = typeColors[weakness] || typeColors.normal
                    return (
                      <Badge
                        key={weakness}
                        className={`${color.bg} ${color.text} capitalize rounded-full px-3 py-1`}
                      >
                        {weakness}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Version Toggle */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Versions
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={!showShiny ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowShiny(false)}
                    className="rounded-full"
                  >
                    Normal
                  </Button>
                  <Button
                    variant={showShiny ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowShiny(true)}
                    disabled={!shinyImage}
                    className="rounded-full"
                  >
                    Shiny
                  </Button>
                </div>
              </div>

              {/* Physical Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="text-xl font-bold text-foreground">
                    {(pokemon.height / 10).toFixed(1)}m
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-xl font-bold text-foreground">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                  <p className="text-sm text-muted-foreground">Base XP</p>
                  <p className="text-xl font-bold text-foreground">
                    {pokemon.base_experience || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Abilities */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Abilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((abilitySlot) => (
                    <Badge
                      key={abilitySlot.ability.name}
                      variant={abilitySlot.is_hidden ? 'outline' : 'secondary'}
                      className="capitalize rounded-full px-3"
                    >
                      {capitalizeName(abilitySlot.ability.name)}
                      {abilitySlot.is_hidden && (
                        <span className="ml-1 text-xs opacity-70">(Hidden)</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-4 mt-0">
              <div className="space-y-3">
                {pokemon.stats.map((stat) => {
                  const percentage = Math.min((stat.base_stat / 255) * 100, 100)
                  const barColor = getStatBarColor(stat.stat.name)

                  return (
                    <div key={stat.stat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground w-24">
                          {formatStatName(stat.stat.name)}
                        </span>
                        <span className="font-mono font-semibold text-foreground w-10 text-right">
                          {stat.base_stat}
                        </span>
                        <div className="flex-1 ml-4">
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full ${barColor} rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-mono font-bold text-xl text-foreground">
                    {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* Moves Tab */}
            <TabsContent value="moves" className="mt-0">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {pokemon.moves.length} moves available
                </p>
                <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto pr-2">
                  {pokemon.moves.map((moveSlot) => (
                    <Badge
                      key={moveSlot.move.name}
                      variant="outline"
                      className="capitalize rounded-full"
                    >
                      {capitalizeName(moveSlot.move.name)}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
