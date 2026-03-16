import type {
  Pokemon,
  PokemonListResponse,
  PokemonCardData,
  PokemonTypeResponse,
} from '@/lib/types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

// Fetcher function for SWR
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

// Get Pokemon list
export const getPokemonList = async (
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> => {
  return fetcher<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  )
}

// Get single Pokemon by ID or name
export const getPokemon = async (idOrName: string | number): Promise<Pokemon> => {
  return fetcher<Pokemon>(`${BASE_URL}/pokemon/${idOrName}`)
}

// Get all Pokemon types
export const getPokemonTypes = async (): Promise<PokemonTypeResponse> => {
  return fetcher<PokemonTypeResponse>(`${BASE_URL}/type`)
}

// Extract Pokemon ID from URL
export const extractPokemonId = (url: string): number => {
  const matches = url.match(/\/pokemon\/(\d+)\//)
  return matches ? parseInt(matches[1], 10) : 0
}

// Get Pokemon image URL
export const getPokemonImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

// Transform Pokemon to card data
export const transformToCardData = (pokemon: Pokemon): PokemonCardData => ({
  id: pokemon.id,
  name: pokemon.name,
  image:
    pokemon.sprites.other?.['official-artwork'].front_default ||
    pokemon.sprites.front_default,
  types: pokemon.types.map((t) => t.type.name),
})

// Format Pokemon ID to 3 digits
export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`
}

// Capitalize Pokemon name
export const capitalizeName = (name: string): string => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format stat name
export const formatStatName = (statName: string): string => {
  const statMap: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  }
  return statMap[statName] || statName
}

// Get stat color based on value
export const getStatColor = (value: number): string => {
  if (value >= 100) return 'bg-emerald-500'
  if (value >= 70) return 'bg-green-500'
  if (value >= 50) return 'bg-yellow-500'
  if (value >= 30) return 'bg-orange-500'
  return 'bg-red-500'
}

// Pokemon type colors
export const typeColors: Record<string, { bg: string; text: string }> = {
  normal: { bg: 'bg-gray-400', text: 'text-gray-900' },
  fire: { bg: 'bg-orange-500', text: 'text-white' },
  water: { bg: 'bg-blue-500', text: 'text-white' },
  electric: { bg: 'bg-yellow-400', text: 'text-gray-900' },
  grass: { bg: 'bg-green-500', text: 'text-white' },
  ice: { bg: 'bg-cyan-400', text: 'text-gray-900' },
  fighting: { bg: 'bg-red-700', text: 'text-white' },
  poison: { bg: 'bg-purple-500', text: 'text-white' },
  ground: { bg: 'bg-amber-600', text: 'text-white' },
  flying: { bg: 'bg-indigo-400', text: 'text-white' },
  psychic: { bg: 'bg-pink-500', text: 'text-white' },
  bug: { bg: 'bg-lime-500', text: 'text-white' },
  rock: { bg: 'bg-stone-500', text: 'text-white' },
  ghost: { bg: 'bg-purple-700', text: 'text-white' },
  dragon: { bg: 'bg-indigo-600', text: 'text-white' },
  dark: { bg: 'bg-gray-800', text: 'text-white' },
  steel: { bg: 'bg-slate-400', text: 'text-gray-900' },
  fairy: { bg: 'bg-pink-400', text: 'text-gray-900' },
}

// Total Pokemon count (Gen 1-9)
export const TOTAL_POKEMON = 1025

// API URLs for SWR keys
export const API_URLS = {
  pokemonList: (limit: number, offset: number) =>
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  allPokemon: `${BASE_URL}/pokemon?limit=${TOTAL_POKEMON}&offset=0`,
  pokemon: (idOrName: string | number) => `${BASE_URL}/pokemon/${idOrName}`,
  types: `${BASE_URL}/type`,
  pokemonByType: (type: string) => `${BASE_URL}/type/${type}`,
}
