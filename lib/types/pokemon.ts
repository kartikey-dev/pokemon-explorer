// Pokemon type definitions based on PokeAPI
export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  sprites: PokemonSprites
  types: PokemonTypeSlot[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  moves: PokemonMove[]
}

export interface PokemonSprites {
  front_default: string | null
  front_shiny: string | null
  back_default: string | null
  back_shiny: string | null
  other?: {
    'official-artwork': {
      front_default: string | null
      front_shiny: string | null
    }
    dream_world: {
      front_default: string | null
    }
  }
}

export interface PokemonTypeSlot {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonAbility {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface PokemonMove {
  move: {
    name: string
    url: string
  }
}

export interface PokemonType {
  name: string
  url: string
}

export interface PokemonTypeResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonType[]
}

// Filter state
export interface PokemonFilters {
  search: string
  type: string | null
}

// Card display data
export interface PokemonCardData {
  id: number
  name: string
  image: string | null
  types: string[]
}
