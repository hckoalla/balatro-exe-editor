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

  it('marks an unknown deck as customized only when its config is non-empty', async () => {
    vi.mocked(window.balatro.getDecks).mockResolvedValue(DECKS)

    render(<DecksScreen exePath="C:/balatro.exe" onSelectDeck={vi.fn()} />)
    await screen.findByText('Fixture Deck Alpha')

    const alphaCard = screen.getByTestId('deck-card-deck_alpha')
    const bravoCard = screen.getByTestId('deck-card-deck_bravo')
    expect(alphaCard).not.toHaveTextContent(/customized/i)
    expect(bravoCard).toHaveTextContent(/customized/i)
  })

  it('does not mark a known deck as customized when it only matches its own game default', async () => {
    // Red Deck vem com `config = {discards = 1}` de fábrica — não é edição do usuário.
    const redDeck: ParsedDeck = { id: 'b_red', name: 'Red Deck', config: { discards: 1 } }
    vi.mocked(window.balatro.getDecks).mockResolvedValue([redDeck])

    render(<DecksScreen exePath="C:/balatro.exe" onSelectDeck={vi.fn()} />)

    const card = await screen.findByTestId('deck-card-b_red')
    expect(card).not.toHaveTextContent(/customized/i)
    expect(card).toHaveTextContent(/default/i)
  })

  it('marks a known deck as customized when it genuinely deviates from its game default', async () => {
    const redDeck: ParsedDeck = { id: 'b_red', name: 'Red Deck', config: { dollars: 999 } }
    vi.mocked(window.balatro.getDecks).mockResolvedValue([redDeck])

    render(<DecksScreen exePath="C:/balatro.exe" onSelectDeck={vi.fn()} />)

    const card = await screen.findByTestId('deck-card-b_red')
    expect(card).toHaveTextContent(/customized/i)
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
