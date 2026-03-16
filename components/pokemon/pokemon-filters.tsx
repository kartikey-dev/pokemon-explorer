'use client'

import { useState, useCallback, useEffect } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
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

interface PokemonFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function PokemonFilters({ filters, onFiltersChange }: PokemonFiltersProps) {
  const { types, isLoading: typesLoading } = usePokemonTypes()
  const [searchInput, setSearchInput] = useState(filters.search)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, filters, onFiltersChange])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value.toLowerCase())
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder="Search Pokemon..."
          value={searchInput}
          onChange={handleSearchChange}
          className="pl-10 h-10 bg-card border-border/50 rounded-xl focus-visible:ring-primary/30"
          aria-label="Search Pokemon by name"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput('')
              onFiltersChange({ ...filters, search: '' })
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" aria-hidden="true" />
        <Select
          value={filters.type || 'all'}
          onValueChange={handleTypeChange}
          disabled={typesLoading}
        >
          <SelectTrigger
            className="w-full sm:w-[160px] h-10 bg-card border-border/50 rounded-xl"
            aria-label="Filter by Pokemon type"
          >
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => {
              const color = typeColors[type.name]
              return (
                <SelectItem key={type.name} value={type.name}>
                  <div className="flex items-center gap-2">
                    {color && (
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${color.bg}`}
                        aria-hidden="true"
                      />
                    )}
                    <span className="capitalize">{capitalizeName(type.name)}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="self-start sm:self-auto text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1.5 h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
