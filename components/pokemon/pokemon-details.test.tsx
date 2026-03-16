import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PokemonDetails } from './pokemon-details'
import type { Pokemon } from '@/lib/types/pokemon'

describe('PokemonDetails', () => {
  const mockPokemon: Pokemon = {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    base_experience: 112,
    sprites: {
      front_default: 'https://example.com/pikachu-front.png',
      front_shiny: null,
      back_default: null,
      back_shiny: null,
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-official.png',
          front_shiny: null,
        },
        dream_world: {
          front_default: null,
        },
      },
    },
    types: [{ slot: 1, type: { name: 'electric', url: '' } }],
    stats: [
      { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: '' } },
      { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 90, effort: 2, stat: { name: 'speed', url: '' } },
    ],
    abilities: [
      { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
      { ability: { name: 'lightning-rod', url: '' }, is_hidden: true, slot: 3 },
    ],
    moves: [
      { move: { name: 'thunder-shock', url: '' } },
      { move: { name: 'quick-attack', url: '' } },
      { move: { name: 'thunderbolt', url: '' } },
    ],
  }

  it('should render pokemon name', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    expect(screen.getByText('Pikachu')).toBeInTheDocument()
  })

  it('should render pokemon ID in correct format', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    expect(screen.getByText('#025')).toBeInTheDocument()
  })

  it('should render pokemon types', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    expect(screen.getByText('electric')).toBeInTheDocument()
  })

  it('should render pokemon height in meters', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    // Height is 4 decimeters = 0.4 meters
    expect(screen.getByText('0.4m')).toBeInTheDocument()
  })

  it('should render pokemon weight in kilograms', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    // Weight is 60 hectograms = 6.0 kg
    expect(screen.getByText('6.0kg')).toBeInTheDocument()
  })

  it('should render all base stats', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('Attack')).toBeInTheDocument()
    expect(screen.getByText('Defense')).toBeInTheDocument()
    expect(screen.getByText('Sp. Atk')).toBeInTheDocument()
    expect(screen.getByText('Sp. Def')).toBeInTheDocument()
    expect(screen.getByText('Speed')).toBeInTheDocument()
  })

  it('should render stat values', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    expect(screen.getByText('35')).toBeInTheDocument() // HP
    expect(screen.getByText('55')).toBeInTheDocument() // Attack
    expect(screen.getByText('40')).toBeInTheDocument() // Defense
    expect(screen.getByText('90')).toBeInTheDocument() // Speed
  })

  it('should render total stats', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    // Total: 35 + 55 + 40 + 50 + 50 + 90 = 320
    expect(screen.getByText('Total: 320')).toBeInTheDocument()
  })

  it('should render abilities', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    expect(screen.getByText('Static')).toBeInTheDocument()
    expect(screen.getByText(/Lightning Rod/)).toBeInTheDocument()
  })

  it('should indicate hidden abilities', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    expect(screen.getByText('(Hidden)')).toBeInTheDocument()
  })

  it('should render pokemon moves', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    expect(screen.getByText('Thunder Shock')).toBeInTheDocument()
    expect(screen.getByText('Quick Attack')).toBeInTheDocument()
    expect(screen.getByText('Thunderbolt')).toBeInTheDocument()
  })

  it('should render move count', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    expect(screen.getByText('3 total')).toBeInTheDocument()
  })

  it('should render pokemon image with alt text', () => {
    render(<PokemonDetails pokemon={mockPokemon} />)

    const image = screen.getByAltText('Pikachu')
    expect(image).toBeInTheDocument()
  })

  it('should render dual-type pokemon correctly', () => {
    const dualTypePokemon: Pokemon = {
      ...mockPokemon,
      id: 6,
      name: 'charizard',
      types: [
        { slot: 1, type: { name: 'fire', url: '' } },
        { slot: 2, type: { name: 'flying', url: '' } },
      ],
    }

    render(<PokemonDetails pokemon={dualTypePokemon} />)

    expect(screen.getByText('fire')).toBeInTheDocument()
    expect(screen.getByText('flying')).toBeInTheDocument()
  })
})
