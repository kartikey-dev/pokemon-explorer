'use client'

import useSWR from 'swr'
import {
  fetcher,
  API_URLS,
  extractPokemonId,
  transformToCardData,
  getPokemonImageUrl,
} from '@/lib/api/pokemon'
import type {
  Pokemon,
  PokemonListResponse,
  PokemonCardData,
  PokemonTypeResponse,
  TypeDetailResponse,
} from '@/lib/types/pokemon'
import { TOTAL_POKEMON } from '@/lib/api/pokemon'

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

// Hook to fetch ALL Pokemon with basic info (for global filtering)
export function useAllPokemon() {
  const { data, error, isLoading, mutate } = useSWR<PokemonListResponse>(
    API_URLS.allPokemon,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  )

  // Transform to include ID and image URL from the list
  const allPokemon: PokemonCardData[] = (data?.results || []).map((pokemon) => {
    const id = extractPokemonId(pokemon.url)
    return {
      id,
      name: pokemon.name,
      image: getPokemonImageUrl(id),
      types: [], // Will be fetched when needed
    }
  })

  return {
    allPokemon,
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

// Hook to fetch multiple Pokemon details by IDs
export function usePokemonDetails(pokemonIds: number[]) {
  const { data, error, isLoading } = useSWR<PokemonCardData[]>(
    pokemonIds.length > 0
      ? ['pokemon-details', pokemonIds.join(',')]
      : null,
    async () => {
      const pokemonPromises = pokemonIds.map(async (id) => {
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

// Hook to fetch all Pokemon of a specific type
export function usePokemonByType(typeName: string | null) {
  const { data, error, isLoading } = useSWR<TypeDetailResponse>(
    typeName ? API_URLS.pokemonByType(typeName) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  )

  // Transform to basic Pokemon data, filtering only valid Pokemon (id <= TOTAL_POKEMON)
  const pokemonOfType: PokemonCardData[] = (data?.pokemon || [])
    .map((entry) => {
      const id = extractPokemonId(entry.pokemon.url)
      return {
        id,
        name: entry.pokemon.name,
        image: getPokemonImageUrl(id),
        types: [typeName || ''], // At minimum has this type
      }
    })
    .filter((p) => p.id > 0 && p.id <= TOTAL_POKEMON) // Filter valid Pokemon only

  return {
    pokemonOfType,
    isLoading,
    isError: !!error,
    error,
  }
}
