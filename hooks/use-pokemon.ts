'use client'

import useSWR from 'swr'
import {
  fetcher,
  API_URLS,
  extractPokemonId,
  transformToCardData,
} from '@/lib/api/pokemon'
import type {
  Pokemon,
  PokemonListResponse,
  PokemonCardData,
  PokemonTypeResponse,
} from '@/lib/types/pokemon'

// Hook to fetch Pokemon list
export function usePokemonList(limit: number = 20, offset: number = 0) {
  const { data, error, isLoading, mutate } = useSWR<PokemonListResponse>(
    API_URLS.pokemonList(limit, offset),
    fetcher
  )

  return {
    pokemonList: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}

// Hook to fetch single Pokemon details
export function usePokemon(idOrName: string | number | null) {
  const { data, error, isLoading } = useSWR<Pokemon>(
    idOrName ? API_URLS.pokemon(idOrName) : null,
    fetcher
  )

  return {
    pokemon: data,
    isLoading,
    isError: !!error,
    error,
  }
}

// Hook to fetch multiple Pokemon details
export function usePokemonDetails(
  pokemonList: Array<{ name: string; url: string }>
) {
  const { data, error, isLoading } = useSWR<PokemonCardData[]>(
    pokemonList.length > 0
      ? ['pokemon-details', pokemonList.map((p) => p.name).join(',')]
      : null,
    async () => {
      const pokemonPromises = pokemonList.map(async (item) => {
        const id = extractPokemonId(item.url)
        const pokemon = await fetcher<Pokemon>(API_URLS.pokemon(id))
        return transformToCardData(pokemon)
      })
      return Promise.all(pokemonPromises)
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  )

  return {
    pokemonDetails: data || [],
    isLoading,
    isError: !!error,
    error,
  }
}

// Hook to fetch Pokemon types
export function usePokemonTypes() {
  const { data, error, isLoading } = useSWR<PokemonTypeResponse>(
    API_URLS.types,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  )

  // Filter out non-standard types
  const standardTypes = data?.results.filter(
    (type) => !['unknown', 'shadow'].includes(type.name)
  )

  return {
    types: standardTypes || [],
    isLoading,
    isError: !!error,
    error,
  }
}
