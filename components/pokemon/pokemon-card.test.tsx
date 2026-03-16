import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PokemonCard } from './pokemon-card'
import type { PokemonCardData } from '@/lib/types/pokemon'

describe('PokemonCard', () => {
  const mockPokemon: PokemonCardData = {
    id: 25,
    name: 'pikachu',
    image: 'https://example.com/pikachu.png',
    types: ['electric'],
  }

  it('should render pokemon name correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />)

    expect(screen.getByText('Pikachu')).toBeInTheDocument()
  })

  it('should render pokemon ID in correct format', () => {
    render(<PokemonCard pokemon={mockPokemon} />)

    expect(screen.getByText('#025')).toBeInTheDocument()
  })

  it('should render pokemon type badges', () => {
    render(<PokemonCard pokemon={mockPokemon} />)

    expect(screen.getByText('electric')).toBeInTheDocument()
  })

  it('should render multiple type badges for dual-type pokemon', () => {
    const dualTypePokemon: PokemonCardData = {
      id: 6,
      name: 'charizard',
      image: 'https://example.com/charizard.png',
      types: ['fire', 'flying'],
    }

    render(<PokemonCard pokemon={dualTypePokemon} />)

    expect(screen.getByText('fire')).toBeInTheDocument()
    expect(screen.getByText('flying')).toBeInTheDocument()
  })

  it('should render pokemon image with correct alt text', () => {
    render(<PokemonCard pokemon={mockPokemon} />)

    const image = screen.getByAltText('Pikachu')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src')
  })

  it('should link to pokemon detail page', () => {
    render(<PokemonCard pokemon={mockPokemon} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/pokemon/25')
  })

  it('should have accessible label', () => {
    render(<PokemonCard pokemon={mockPokemon} />)

    const link = screen.getByLabelText('View details for Pikachu')
    expect(link).toBeInTheDocument()
  })

  it('should render placeholder when image is null', () => {
    const pokemonWithoutImage: PokemonCardData = {
      ...mockPokemon,
      image: null,
    }

    render(<PokemonCard pokemon={pokemonWithoutImage} />)

    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('should format hyphenated pokemon names correctly', () => {
    const hyphenatedPokemon: PokemonCardData = {
      id: 122,
      name: 'mr-mime',
      image: 'https://example.com/mr-mime.png',
      types: ['psychic', 'fairy'],
    }

    render(<PokemonCard pokemon={hyphenatedPokemon} />)

    expect(screen.getByText('Mr Mime')).toBeInTheDocument()
  })
})
