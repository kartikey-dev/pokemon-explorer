import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import {
  usePokemonList,
  usePokemon,
  usePokemonTypes,
} from './use-pokemon'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('usePokemonList', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => usePokemonList())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.pokemonList).toEqual([])
  })

  it('should return pokemon list on successful fetch', async () => {
    const mockResponse = {
      count: 1281,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const { result } = renderHook(() => usePokemonList(2, 0))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pokemonList).toHaveLength(2)
    expect(result.current.pokemonList[0].name).toBe('bulbasaur')
    expect(result.current.totalCount).toBe(1281)
  })

  it('should handle fetch error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    const { result } = renderHook(() => usePokemonList())

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})

describe('usePokemon', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should not fetch when id is null', () => {
    const { result } = renderHook(() => usePokemon(null))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.pokemon).toBeUndefined()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should fetch pokemon by id', async () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      sprites: {
        front_default: 'https://example.com/pikachu.png',
      },
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      stats: [],
      abilities: [],
      moves: [],
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemon),
    })

    const { result } = renderHook(() => usePokemon(25))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pokemon?.name).toBe('pikachu')
    expect(result.current.pokemon?.id).toBe(25)
  })

  it('should fetch pokemon by name', async () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      sprites: {
        front_default: 'https://example.com/pikachu.png',
      },
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      stats: [],
      abilities: [],
      moves: [],
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemon),
    })

    const { result } = renderHook(() => usePokemon('pikachu'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pokemon?.name).toBe('pikachu')
  })
})

describe('usePokemonTypes', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should fetch and filter pokemon types', async () => {
    const mockTypes = {
      count: 20,
      results: [
        { name: 'normal', url: '' },
        { name: 'fire', url: '' },
        { name: 'unknown', url: '' },
        { name: 'shadow', url: '' },
      ],
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTypes),
    })

    const { result } = renderHook(() => usePokemonTypes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should filter out 'unknown' and 'shadow' types
    expect(result.current.types).toHaveLength(2)
    expect(result.current.types.map((t) => t.name)).toEqual(['normal', 'fire'])
  })
})
