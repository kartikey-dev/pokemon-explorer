'use client'

import { useState, useCallback, useEffect } from 'react'
import { Search, X } from 'lucide-react'
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Search Pokemon..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pl-10 bg-background"
            aria-label="Search Pokemon by name"
          />
        </div>

        {/* Type Filter */}
        <Select
          value={filters.type || 'all'}
          onValueChange={handleTypeChange}
          disabled={typesLoading}
        >
          <SelectTrigger
            className="w-full sm:w-[180px] bg-background"
            aria-label="Filter by Pokemon type"
          >
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => {
              const color = typeColors[type.name]
              return (
                <SelectItem key={type.name} value={type.name}>
                  <div className="flex items-center gap-2">
                    {color && (
                      <div
                        className={`h-3 w-3 rounded-full ${color.bg}`}
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
          className="self-start sm:self-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
