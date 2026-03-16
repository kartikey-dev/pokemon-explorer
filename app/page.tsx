'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { PokemonFilters } from '@/components/pokemon/pokemon-filters'
import { PokemonPagination } from '@/components/pokemon/pokemon-pagination'
import { ThemeToggle } from '@/components/theme-toggle'
import { PageSizeSelector } from '@/components/page-size-selector'
import { useAllPokemon, usePokemonByType, usePokemonDetails } from '@/hooks/use-pokemon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Search, Sparkles, Trophy } from 'lucide-react'
import type { PokemonFilters as Filters, PokemonCardData } from '@/lib/types/pokemon'
import { cn } from '@/lib/utils'
import { Pokeball } from '@/components/ui/pokeball'

const DEFAULT_PAGE_SIZE = 20

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [filters, setFilters] = useState<Filters>({ search: '', type: null })
  const [isScrolled, setIsScrolled] = useState(false)

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const {
    allPokemon,
    totalCount,
    isLoading: listLoading,
    isError: listError,
    mutate: refetchList,
  } = useAllPokemon()

  const {
    pokemonOfType,
    isLoading: typeLoading,
    isError: typeError,
    mutate: refetchType,
  } = usePokemonByType(filters.type)

  const basePokemonList = useMemo(() => {
    if (filters.type) return pokemonOfType
    return allPokemon
  }, [filters.type, pokemonOfType, allPokemon])

  const filteredPokemon = useMemo(() => {
    if (!filters.search) return basePokemonList
    const searchLower = filters.search.toLowerCase()
    return basePokemonList.filter((p) => p.name.toLowerCase().includes(searchLower))
  }, [basePokemonList, filters.search])

  const totalFilteredCount = filteredPokemon.length
  const totalPages = Math.ceil(totalFilteredCount / pageSize)

  const currentPagePokemon = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredPokemon.slice(startIndex, startIndex + pageSize)
  }, [filteredPokemon, currentPage, pageSize])

  const currentPagePokemonIds = useMemo(() => currentPagePokemon.map((p) => p.id), [currentPagePokemon])

  const { pokemonDetails, isLoading: detailsLoading, mutate: refetchDetails } = usePokemonDetails(currentPagePokemonIds)

  const displayPokemon = useMemo(() => {
    if (pokemonDetails.length > 0) return pokemonDetails
    return currentPagePokemon
  }, [pokemonDetails, currentPagePokemon])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }, [])

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handleRetry = useCallback(() => {
    refetchList()
    if (filters.type) refetchType()
    refetchDetails()
  }, [refetchList, refetchType, refetchDetails, filters.type])

  const isInitialLoading = listLoading || (filters.type && typeLoading)
  const isPageLoading = detailsLoading
  const isError = listError || typeError

  return (
    <div className="min-h-screen bg-background pokemon-grid-bg selection:bg-primary/30 antialiased font-sans">
      {/* ── Navigation Header ── */}
      <header 
        className={cn(
          "fixed top-0 inset-x-0 z-[100] transition-all duration-300 px-4",
          isScrolled ? "py-2 glass border-b border-border shadow-md" : "py-6 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-xl group-hover:scale-110 transition-all duration-300" />
              <Pokeball className="w-7 h-7 relative z-10" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-medium uppercase tracking-wide leading-none text-foreground font-logo">
                Poke<span className="text-primary italic">Dex</span>
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
                Explorer Pro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center bg-secondary/50 rounded-full px-4 py-1.5 border border-border/50">
              <Trophy className="w-4 h-4 text-accent mr-2" />
              <span className="text-xs font-bold text-foreground">
                {totalCount.toLocaleString()} <span className="text-muted-foreground">POKEMON</span>
              </span>
            </div>
            <PageSizeSelector value={pageSize} onChange={handlePageSizeChange} className="hidden sm:inline-flex" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Hero Content Wrapper (compensate for fixed header) ── */}
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 animate-fade-in">
              <Sparkles className="w-3 h-3 text-accent" />
              Real-time Database Explorer
            </div>
            
            <h2 className="text-5xl sm:text-7xl font-medium tracking-wide mb-8 text-foreground leading-[1.1] animate-fade-in font-logo">
              Catch &apos;em All in <span className="text-gradient hover:scale-105 inline-block transition-transform duration-300">Ultra High-Def</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium animate-fade-in">
              Search through generations of Pokémon with advanced type filtering and comprehensive stats. Built for trainers who demand excellence.
            </p>

            {/* Centralized Filter Hub */}
            <div className="max-w-3xl mx-auto relative group animate-fade-in">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-focus-within:opacity-100" />
              <div className="relative glass p-4 sm:p-6 rounded-[2rem] shadow-2xl border border-white/10">
                <PokemonFilters 
                  filters={filters} 
                  onFiltersChange={handleFiltersChange} 
                  className="max-w-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 pb-20 mt-10">
          {/* Results Metadata */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center h-9 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                {totalFilteredCount.toLocaleString()} RESULTS
              </div>
              {filters.type && (
                <div className={cn("flex items-center h-9 px-4 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-md", `bg-type-${filters.type}`)}>
                  TYPE: {filters.type}
                </div>
              )}
            </div>
            
            <div className="flex items-center h-9 px-6 rounded-full bg-secondary/50 border border-border/50 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] shadow-inner">
              DISCOVERY STATUS <span className="w-2 h-2 rounded-full bg-primary mx-3 animate-pulse" /> PAGE {currentPage} OF {totalPages || 1}
            </div>
          </div>

          {/* Error State */}
          {isError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center animate-slide-up">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">System Interruption</h3>
              <p className="text-muted-foreground mb-6">We encountered a psychic disturbance in the data stream.</p>
              <Button onClick={handleRetry} className="rounded-xl px-8 font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                Re-establish Connection
              </Button>
            </div>
          )}

          {/* Pokémon Grid */}
          <div className="relative min-h-[400px]">
            <PokemonGrid
              pokemon={displayPokemon as PokemonCardData[]}
              isLoading={!!isInitialLoading || isPageLoading}
              skeletonCount={pageSize}
            />
            
            {/* No Results Fallback */}
            {!isInitialLoading && !isError && filteredPokemon.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <div className="relative w-24 h-24 mb-6">
                  <Search className="w-full h-full text-muted-foreground/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">?</span>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">No Matches Found</h3>
                <p className="text-muted-foreground font-medium mb-8">Adjust your filters to discover different species.</p>
                <Button 
                  variant="outline" 
                  onClick={() => handleFiltersChange({ search: '', type: null })}
                  className="rounded-xl font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all border-2"
                >
                  Reset Exploration
                </Button>
              </div>
            )}
          </div>

          {/* Pagination Section */}
          {!isInitialLoading && !isError && totalFilteredCount > 0 && (
            <div className="mt-16 flex flex-col items-center gap-6">
              <PokemonPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isPageLoading}
              />
            </div>
          )}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card/30 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Pokeball className="w-10 h-10" />
            <div className="text-left">
              <span className="text-2xl font-medium uppercase tracking-wide font-logo block leading-none">
                Poke<span className="text-primary italic">Dex</span>
              </span>
              <span className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase">Explorer Pro</span>
            </div>
          </div>
          
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
            Built with <span className="text-primary">Next.js 15</span> & <span className="text-accent">PokeAPI</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
