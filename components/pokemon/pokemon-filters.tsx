'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, X, Filter, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePokemonTypes } from '@/hooks/use-pokemon'
import { capitalizeName, typeColors } from '@/lib/api/pokemon'
import type { PokemonFilters as Filters } from '@/lib/types/pokemon'
import { cn } from '@/lib/utils'

interface PokemonFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  className?: string
}

export function PokemonFilters({ filters, onFiltersChange, className }: PokemonFiltersProps) {
  const { types, isLoading: typesLoading } = usePokemonTypes()
  const [searchInput, setSearchInput] = useState(filters.search)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput })
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchInput, filters, onFiltersChange])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value)
    },
    []
  )

  const handleTypeChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        type: value === 'all' ? null : value,
      })
    },
    [filters, onFiltersChange]
  )

  const handleClearFilters = useCallback(() => {
    setSearchInput('')
    onFiltersChange({ search: '', type: null })
  }, [onFiltersChange])

  const hasActiveFilters = filters.search || filters.type

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Advanced Search Input */}
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center">
            <Search
              className="absolute left-5 h-5 w-5 text-muted-foreground group-focus-within:text-primary group-focus-within:scale-110 transition-all duration-300"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Who are you looking for? (e.g. Mewtwo, Lugia...)"
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full h-14 pl-14 pr-12 bg-background border-2 border-border/50 rounded-full text-lg font-bold placeholder:text-muted-foreground/40 placeholder:font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-4 p-1.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            
          </div>
        </div>

        {/* Rapid Type Selector */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.type || 'all'}
            onValueChange={handleTypeChange}
            disabled={typesLoading}
          >
            <SelectTrigger
              className="w-full md:w-[220px] h-14! bg-background border-2 border-border/50 rounded-full px-5 text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-primary" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border shadow-2xl p-2 bg-popover/95 backdrop-blur-xl">
              <SelectItem value="all" className="rounded-xl font-black uppercase tracking-widest py-3 hover:bg-primary/10">
                All Species
              </SelectItem>
              <div className="grid grid-cols-2 gap-1 mt-1 border-t border-border/50 pt-2">
                {types.map((type) => {
                  return (
                    <SelectItem 
                      key={type.name} 
                      value={type.name}
                      className="rounded-xl font-bold capitalize text-xs tracking-tight py-2.5 hover:bg-secondary"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", `bg-type-${type.name}`)} />
                        {type.name}
                      </div>
                    </SelectItem>
                  )
                })}
              </div>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="icon"
              onClick={handleClearFilters}
              className="h-14 w-14 rounded-full border-2 border-border/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all group shrink-0"
              title="Reset Filters"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Dynamic Filter Suggestions */}
      {!hasActiveFilters && (
        <div className="flex items-center gap-3 animate-fade-in">
           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Try these:
           </span>
            <div className="flex flex-wrap gap-3">
              {['Fire', 'Water', 'Electric', 'Psychic'].map(tag => (
                <button 
                 key={tag}
                 onClick={() => handleTypeChange(tag.toLowerCase())}
                 className="flex items-center h-8 px-4 rounded-full bg-secondary/40 border border-border/60 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
        </div>
      )}
    </div>
  )
}
