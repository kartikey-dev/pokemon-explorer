'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight, Ruler, Weight, Zap, Shield, Swords, Activity, Heart, Info, ArrowLeft, Sparkles, Trophy } from 'lucide-react'
import {
  capitalizeName,
  formatPokemonId,
  formatStatName,
  typeColors,
} from '@/lib/api/pokemon'
import type { Pokemon } from '@/lib/types/pokemon'
import { cn } from '@/lib/utils'
import { RelatedPokemon } from './related-pokemon'
import { motion, AnimatePresence } from 'framer-motion'

interface PokemonDetailsProps {
  pokemon: Pokemon
}

const MAX_POKEMON_ID = 1025

const statIcons: Record<string, any> = {
  hp: Heart,
  attack: Swords,
  defense: Shield,
  'special-attack': Zap,
  'special-defense': Shield,
  speed: Activity,
}

export function PokemonDetails({ pokemon }: PokemonDetailsProps) {

  const primaryType = pokemon.types[0]?.type.name || 'normal'
  const typeColor = typeColors[primaryType] || typeColors.normal

  const currentImage =
    pokemon.sprites.other?.['official-artwork'].front_default ||
    pokemon.sprites.front_default

  const hasPrevious = pokemon.id > 1
  const hasNext = pokemon.id < MAX_POKEMON_ID

  const [activeTab, setActiveTab] = useState('specs')
  const [animateStats, setAnimateStats] = useState(false)

  useEffect(() => {
    if (activeTab === 'stats') {
      setAnimateStats(false)
      const timer = setTimeout(() => setAnimateStats(true), 100)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  const statsTotal = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)

  const tabIndex: Record<string, number> = { specs: 0, stats: 1, moves: 2 }

  return (
    <div className="relative rounded-[2.5rem] overflow-hidden glass border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-slide-up">
      {/* ── Mobile Navigation ── */}
      <div className="lg:hidden flex items-center justify-between p-6 bg-background/20 backdrop-blur-md border-b border-white/10">
        <Link href="/">
           <Button variant="ghost" size="sm" className="rounded-xl font-black uppercase text-[10px] tracking-widest gap-2">
             <ArrowLeft className="w-4 h-4" /> Back to Explorer
           </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ── Left Side: Visual Hero ── */}
        <div className="relative p-8 lg:p-20 flex flex-col items-center justify-center min-h-[500px] lg:min-h-[700px] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
          
          {/* Dynamic Background Glow */}
          <div className={cn(
            "absolute inset-0 opacity-10 dark:opacity-20",
            `bg-type-${primaryType}`
          )} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

          {/* Desktop Name/ID Overlay */}
          <div className="hidden lg:block absolute top-12 left-12 z-20">
            <h1 className="text-6xl font-medium text-foreground uppercase tracking-wide leading-none mb-4 font-logo">
              {pokemon.name.replace(/-/g, ' ')}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-muted-foreground/50 tracking-widest">
                {formatPokemonId(pokemon.id)}
              </span>
              <div className="flex gap-2">
                {pokemon.types.map((t) => (
                  <span 
                    key={t.type.name} 
                    className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg", `bg-type-${t.type.name}`)}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {hasPrevious && (
            <Link href={`/pokemon/${pokemon.id - 1}`} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 group">
              <div className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-primary/20 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all group-hover:-translate-x-2">
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </div>
            </Link>
          )}
          {hasNext && (
            <Link href={`/pokemon/${pokemon.id + 1}`} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 group">
              <div className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-primary/20 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all group-hover:translate-x-2">
                <ChevronRight className="w-6 h-6 text-foreground" />
              </div>
            </Link>
          )}

          {/* Massive Animated Sprite */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 z-20 floating">
            {/* Soft inner glow behind image */}
            <div className={cn(
              "absolute inset-10 rounded-full blur-[80px] opacity-40",
              `bg-type-${primaryType}`
            )} />
            
            {currentImage ? (
              <Image
                src={currentImage}
                alt={pokemon.name}
                fill
                sizes="(max-width: 640px) 288px, 384px"
                className="object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-3xl bg-secondary/50">
                <span className="text-8xl font-black text-muted-foreground/20">?</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-10 z-30 opacity-0 pointer-events-none" />
        </div>

        <div className="p-8 lg:p-16 flex flex-col h-full bg-card/40 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="relative mb-10 w-full md:w-fit">
              <TabsList className="h-auto p-1 bg-secondary/30 rounded-2xl w-full grid grid-cols-3 relative z-10 isolate border border-white/5">
                <motion.div
                  className="absolute inset-y-1 left-1 bg-primary rounded-xl z-[-1]"
                  initial={false}
                  animate={{
                    x: `calc(${tabIndex[activeTab] * 100}% + ${tabIndex[activeTab] * 0}px)`,
                    width: 'calc(33.33% - 2.66px)'
                  }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
                <TabsTrigger 
                  value="specs" 
                  className="rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground text-muted-foreground transition-all duration-300"
                >
                  Specs
                </TabsTrigger>
                <TabsTrigger 
                  value="stats" 
                  className="rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground text-muted-foreground transition-all duration-300"
                >
                  Stats
                </TabsTrigger>
                <TabsTrigger 
                  value="moves" 
                  className="rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground text-muted-foreground transition-all duration-300"
                >
                  Moves
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              <TabsContent value="specs" className="m-0 focus-visible:outline-none">
                <div className="space-y-10 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative glass p-8 rounded-3xl border-border/50 shadow-2xl flex flex-col items-center text-center">
                        <div className="p-3 rounded-2xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                          <Ruler className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Height Index</span>
                        <p className="text-4xl font-black text-foreground">{(pokemon.height / 10).toFixed(1)}<small className="text-sm font-bold opacity-50 ml-1">M</small></p>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative glass p-8 rounded-3xl border-border/50 shadow-2xl flex flex-col items-center text-center">
                        <div className="p-3 rounded-2xl bg-accent/10 mb-4 group-hover:scale-110 transition-transform">
                          <Weight className="w-6 h-6 text-accent" />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Weight Gravity</span>
                        <p className="text-4xl font-black text-foreground">{(pokemon.weight / 10).toFixed(1)}<small className="text-sm font-bold opacity-50 ml-1">KG</small></p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
                      <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground whitespace-nowrap">
                        <Zap className="w-4 h-4 text-primary" /> Strategic Abilities
                      </h4>
                      <div className="h-px flex-1 bg-linear-to-r from-border via-border to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pokemon.abilities.map(a => (
                        <div key={a.ability.name} className="group relative">
                          <div className="absolute inset-0 bg-primary/5 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          <div className="relative p-6 glass rounded-[1.5rem] border-white/5 flex items-center justify-between group-hover:border-primary/30 transition-all">
                            <div>
                              <span className="font-black text-sm tracking-tight uppercase block group-hover:text-primary transition-colors">
                                {a.ability.name.replace(/-/g, ' ')}
                              </span>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">Active Buff</span>
                            </div>
                            {a.is_hidden && (
                              <Badge variant="outline" className="text-[9px] font-black border-accent/30 text-accent uppercase tracking-widest bg-accent/5">Rare</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 glass rounded-[2rem] border-white/10 bg-white/5">
                     <div className="flex items-center gap-8">
                       <div className="flex-1 space-y-4">
                         <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                           <span>Survival Experience</span>
                           <span>{pokemon.base_experience || 0} XP</span>
                         </div>
                         <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                           <div className="h-full bg-primary rounded-full w-[65%] shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                         </div>
                       </div>
                       <div className="px-6 py-4 rounded-2xl bg-secondary/50 border border-white/5 text-center">
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Held Items</span>
                         <span className="text-xl font-black">{pokemon.held_items.length > 0 ? 'ACTIVE' : 'NONE'}</span>
                       </div>
                     </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="m-0 focus-visible:outline-none">
                <div className="space-y-6 animate-fade-in">
                  {pokemon.stats.map(s => {
                    const Icon = statIcons[s.stat.name] || Activity
                    const percentage = Math.round((s.base_stat / 255) * 100)
                    return (
                      <div key={s.stat.name} className="space-y-2">
                        <div className="flex items-center justify-between font-black uppercase tracking-tighter text-[11px]">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            {formatStatName(s.stat.name)}
                          </div>
                          <span className="text-primary text-sm font-black">{s.base_stat}</span>
                        </div>
                        <div className="relative h-4 bg-secondary/30 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out animate-shimmer", `bg-type-${primaryType}`)}
                            style={{ width: animateStats ? `${percentage}%` : '0%' }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  
                  <div className="mt-12 p-8 glass rounded-[2.5rem] border-primary/20 bg-primary/5 flex items-center justify-between shadow-2xl overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col justify-center">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-1">Battle Potential Index</h5>
                      <p className="text-5xl font-black text-foreground tracking-tighter leading-none">{statsTotal}</p>
                    </div>
                    <div className="relative z-10 h-20 w-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <Trophy className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="moves" className="m-0 focus-visible:outline-none">
                <div className="animate-fade-in flex flex-col">
                  <div className="mb-6 flex items-center gap-3">
                     <Swords className="w-5 h-5 text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Combat Techniques Arsenal</span>
                     <Badge variant="secondary" className="font-black text-[9px] px-3">{pokemon.moves.length} MOVES</Badge>
                  </div>
                  <div className="h-[450px] overflow-y-auto pr-4 custom-scrollbar lg:grid lg:grid-cols-2 lg:gap-3 flex flex-col gap-2">
                    {pokemon.moves.map(m => (
                      <div 
                        key={m.move.name} 
                        className="group relative"
                      >
                        <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-5 glass rounded-2xl text-[12px] font-black uppercase tracking-wide flex items-center gap-4 hover:bg-white/5 border-white/5 transition-all cursor-default">
                           <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-150 transition-all" />
                           {m.move.name.replace(/-/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* ── Related Species Section ── */}
      <div className="p-8 lg:p-12 border-t border-white/10 bg-black/5">
        <RelatedPokemon currentId={pokemon.id} primaryType={primaryType} />
      </div>
    </div>
  )
}
