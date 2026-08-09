// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ParsedDeck } from '../shared/deck-schema'
import { DecksScreen } from './DecksScreen'

const DECKS: ParsedDeck[] = [
  { id: 'deck_alpha', name: 'Fixture Deck Alpha', config: {} },
  { id: 'deck_bravo', name: 'Fixture Deck Bravo', config: { dollars: 10 } },
]

describe('DecksScreen', () => {
  it('lists every deck by name', async () => {
    vi.mocked(window.balatro.getDecks).mockResolvedValue(DECKS)

    render(<DecksScreen exePath="C:/balatro.exe" onSelectDeck={vi.fn()} />)

    expect(await screen.findByText('Fixture Deck Alpha')).toBeInTheDocument()
    expect(screen.getByText('Fixture Deck Bravo')).toBeInTheDocument()
  })

  it('marks a deck as customized only when its config is non-empty', async () => {
    vi.mocked(window.balatro.getDecks).mockResolvedValue(DECKS)

    render(<DecksScreen exePath="C:/balatro.exe" onSelectDeck={vi.fn()} />)
    await screen.findByText('Fixture Deck Alpha')

    const alphaCard = screen.getByTestId('deck-card-deck_alpha')
    const bravoCard = screen.getByTestId('deck-card-deck_bravo')
    expect(alphaCard).not.toHaveTextContent(/customized/i)
    expect(bravoCard).toHaveTextContent(/customized/i)
  })

  it('calls onSelectDeck with the chosen deck', async () => {
    const user = userEvent.setup()
    const onSelectDeck = vi.fn()
    vi.mocked(window.balatro.getDecks).mockResolvedValue(DECKS)

    render(<DecksScreen exePath="C:/balatro.exe" onSelectDeck={onSelectDeck} />)
    await user.click(await screen.findByText('Fixture Deck Bravo'))

    expect(onSelectDeck).toHaveBeenCalledWith(DECKS[1])
  })
})
