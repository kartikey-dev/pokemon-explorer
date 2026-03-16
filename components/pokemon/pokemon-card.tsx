'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  capitalizeName,
  formatPokemonId,
  typeColors,
} from '@/lib/api/pokemon'
import type { PokemonCardData } from '@/lib/types/pokemon'
import { cn } from '@/lib/utils'

interface PokemonCardProps {
  pokemon: PokemonCardData
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const { id, name, image, types } = pokemon
  const primaryType = types[0] || 'normal'
  const typeColor = typeColors[primaryType] || typeColors.normal

  return (
    <Link 
      href={`/pokemon/${id}`} 
      aria-label={`View details for ${capitalizeName(name)}`}
      className="block group perspective-1000"
    >
      <div className={cn(
        "relative flex flex-col items-center p-6 rounded-3xl transition-all duration-500",
        "bg-card hover:bg-white dark:hover:bg-neutral-800",
        "border border-border/50 hover:border-primary/20",
        "shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2",
        "cursor-pointer overflow-hidden card-shine"
      )}>
        
        {/* ── Background Decos ── */}
        <div 
          className={cn("absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 bg-current", typeColor.bg)} 
          aria-hidden="true" 
        />
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-[10px] border-border/10 opacity-20 group-hover:scale-110 transition-transform duration-700" />

        {/* ── Pokemon ID ── */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] font-black text-muted-foreground/40 group-hover:text-primary transition-colors duration-300">
            {formatPokemonId(id)}
          </span>
        </div>

        {/* ── Image Sprite ── */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
          {/* Sprite Glow */}
          <div className={cn(
            "absolute inset-0 rounded-full blur-[40px] opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-500",
            typeColor.bg
          )} />
          
          {image ? (
            <div className="relative w-full h-full transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 ease-out z-20">
               <Image
                src={image}
                alt={capitalizeName(name)}
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]"
                priority={id <= 12}
              />
            </div>
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted/30 border-2 border-dashed border-border group-hover:scale-90 transition-transform duration-500">
              <span className="text-4xl text-muted-foreground font-black">?</span>
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="text-center w-full z-10">
          <h3 className="text-lg font-black text-foreground mb-3 uppercase tracking-tighter group-hover:text-primary transition-colors">
            {capitalizeName(name).replace(/-/g, ' ')}
          </h3>
          
          <div className="flex flex-wrap justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            {types.map((type) => {
              const color = typeColors[type] || typeColors.normal
              return (
                 <span 
                  key={type} 
                  className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-md transform group-hover:scale-105 transition-all",
                    `bg-type-${type}`
                  )}
                >
                  {type}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </Link>
  )
}
