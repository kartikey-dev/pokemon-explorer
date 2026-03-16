import { describe, it, expect } from 'vitest'
import {
  extractPokemonId,
  getPokemonImageUrl,
  formatPokemonId,
  capitalizeName,
  formatStatName,
  getStatColor,
  transformToCardData,
  typeColors,
} from './pokemon'
import type { Pokemon } from '@/lib/types/pokemon'

describe('Pokemon API Utilities', () => {
  describe('extractPokemonId', () => {
    it('should extract Pokemon ID from URL', () => {
      expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
      expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/1/')).toBe(1)
      expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/151/')).toBe(151)
    })

    it('should return 0 for invalid URL', () => {
      expect(extractPokemonId('invalid-url')).toBe(0)
      expect(extractPokemonId('')).toBe(0)
    })
  })

  describe('getPokemonImageUrl', () => {
    it('should return correct image URL for Pokemon ID', () => {
      const url = getPokemonImageUrl(25)
      expect(url).toContain('25.png')
      expect(url).toContain('official-artwork')
    })
  })

  describe('formatPokemonId', () => {
    it('should format single digit ID', () => {
      expect(formatPokemonId(1)).toBe('#001')
    })

    it('should format double digit ID', () => {
      expect(formatPokemonId(25)).toBe('#025')
    })

    it('should format triple digit ID', () => {
      expect(formatPokemonId(151)).toBe('#151')
    })

    it('should handle IDs over 999', () => {
      expect(formatPokemonId(1000)).toBe('#1000')
    })
  })

  describe('capitalizeName', () => {
    it('should capitalize simple names', () => {
      expect(capitalizeName('pikachu')).toBe('Pikachu')
      expect(capitalizeName('bulbasaur')).toBe('Bulbasaur')
    })

    it('should handle hyphenated names', () => {
      expect(capitalizeName('mr-mime')).toBe('Mr Mime')
      expect(capitalizeName('ho-oh')).toBe('Ho Oh')
    })
  })

  describe('formatStatName', () => {
    it('should format stat names correctly', () => {
      expect(formatStatName('hp')).toBe('HP')
      expect(formatStatName('attack')).toBe('Attack')
      expect(formatStatName('defense')).toBe('Defense')
      expect(formatStatName('special-attack')).toBe('Sp. Atk')
      expect(formatStatName('special-defense')).toBe('Sp. Def')
      expect(formatStatName('speed')).toBe('Speed')
    })

    it('should return original name for unknown stats', () => {
      expect(formatStatName('unknown')).toBe('unknown')
    })
  })

  describe('getStatColor', () => {
    it('should return emerald for high stats (>=100)', () => {
      expect(getStatColor(100)).toBe('bg-emerald-500')
      expect(getStatColor(150)).toBe('bg-emerald-500')
    })

    it('should return green for good stats (>=70)', () => {
      expect(getStatColor(70)).toBe('bg-green-500')
      expect(getStatColor(99)).toBe('bg-green-500')
    })

    it('should return yellow for average stats (>=50)', () => {
      expect(getStatColor(50)).toBe('bg-yellow-500')
      expect(getStatColor(69)).toBe('bg-yellow-500')
    })

    it('should return orange for below average stats (>=30)', () => {
      expect(getStatColor(30)).toBe('bg-orange-500')
      expect(getStatColor(49)).toBe('bg-orange-500')
    })

    it('should return red for low stats (<30)', () => {
      expect(getStatColor(29)).toBe('bg-red-500')
      expect(getStatColor(1)).toBe('bg-red-500')
    })
  })

  describe('transformToCardData', () => {
    it('should transform Pokemon to card data', () => {
      const mockPokemon: Pokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        base_experience: 112,
        sprites: {
          front_default: 'https://example.com/default.png',
          front_shiny: null,
          back_default: null,
          back_shiny: null,
          other: {
            'official-artwork': {
              front_default: 'https://example.com/official.png',
              front_shiny: null,
            },
            dream_world: {
              front_default: null,
            },
          },
        },
        types: [
          { slot: 1, type: { name: 'electric', url: '' } },
        ],
        stats: [],
        abilities: [],
        moves: [],
      }

      const result = transformToCardData(mockPokemon)

      expect(result.id).toBe(25)
      expect(result.name).toBe('pikachu')
      expect(result.image).toBe('https://example.com/official.png')
      expect(result.types).toEqual(['electric'])
    })

    it('should fallback to front_default if official artwork is not available', () => {
      const mockPokemon: Pokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        base_experience: 112,
        sprites: {
          front_default: 'https://example.com/default.png',
          front_shiny: null,
          back_default: null,
          back_shiny: null,
        },
        types: [{ slot: 1, type: { name: 'electric', url: '' } }],
        stats: [],
        abilities: [],
        moves: [],
      }

      const result = transformToCardData(mockPokemon)
      expect(result.image).toBe('https://example.com/default.png')
    })
  })

  describe('typeColors', () => {
    it('should have colors for all standard Pokemon types', () => {
      const standardTypes = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
      ]

      standardTypes.forEach((type) => {
        expect(typeColors[type]).toBeDefined()
        expect(typeColors[type].bg).toBeDefined()
        expect(typeColors[type].text).toBeDefined()
      })
    })
  })
})
