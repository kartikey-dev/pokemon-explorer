'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'
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
    <main className="min-h-screen pokemon-grid-bg pb-20">
      {/* ── Minimalist Detail Header ── */}
      <header className="fixed top-0 inset-x-0 z-[100] py-4 px-4 sm:px-8 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
             <Button variant="ghost" className="rounded-2xl group hover:bg-primary/10 transition-all font-black uppercase text-[10px] tracking-widest gap-2">
               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               <span className="hidden sm:inline">Back to Explorer</span>
               <span className="sm:hidden">Back</span>
             </Button>
          </Link>
          
          <div className="flex items-center gap-3">
             <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Detail Content ── */}
      <div className="pt-28 container mx-auto px-4 max-w-7xl">
        {/* Loading Perceived Performance Skeletons */}
        {isLoading && <PokemonDetailsSkeleton />}

        {/* Dynamic Error Boundary */}
        {isError && !isLoading && (
          <div className="max-w-2xl mx-auto p-12 glass rounded-3xl text-center animate-slide-up border-destructive/20">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Signal Lost</h2>
            <p className="text-muted-foreground font-medium mb-10 max-w-md mx-auto">
              We were unable to locate the specimen &quot;<span className="text-primary">{id}</span>&quot; in our global database.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleRetry} className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Scan
              </Button>
              <Link href="/">
                <Button variant="outline" className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest">
                  Return to Base
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Real-time Specimen Data Display */}
        {!isLoading && !isError && pokemon && (
          <PokemonDetails pokemon={pokemon} />
        )}
      </div>
    </main>
  )
}
