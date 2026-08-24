// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ParsedDeck } from '../shared/deck-schema'
import { BatchEditorScreen } from './BatchEditorScreen'

const DECKS: ParsedDeck[] = [
  { id: 'deck_bravo', name: 'Fixture Deck Bravo', config: { dollars: 10 } },
  { id: 'deck_charlie', name: 'Fixture Deck Charlie', config: {} },
]

describe('BatchEditorScreen', () => {
  it('shows the setup form, how many decks it applies to, and which ones', () => {
    render(<BatchEditorScreen decks={DECKS} exePath="C:/balatro.exe" onBack={vi.fn()} />)

    expect(screen.getByLabelText(/^starting money$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /apply to 2 decks/i })).toBeInTheDocument()
    expect(screen.getByText(/fixture deck bravo/i)).toBeInTheDocument()
    expect(screen.getByText(/fixture deck charlie/i)).toBeInTheDocument()
  })

  it('calls onBack when the back link is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<BatchEditorScreen decks={DECKS} exePath="C:/balatro.exe" onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(onBack).toHaveBeenCalled()
  })

  it('loads the consumable catalog for the exe and renders the consumables editor', async () => {
    vi.mocked(window.balatro.getConsumableCatalog).mockResolvedValue([
      { id: 'c_fool', name: 'The Fool', category: 'Tarot', pos: { x: 0, y: 0 } },
    ])

    render(<BatchEditorScreen decks={DECKS} exePath="C:/balatro.exe" onBack={vi.fn()} />)

    expect(window.balatro.getConsumableCatalog).toHaveBeenCalledWith('C:/balatro.exe')
    expect(await screen.findByPlaceholderText(/search tarots/i)).toBeInTheDocument()
  })

  it('sends the typed setup values for all the given decks when confirmed', async () => {
    const user = userEvent.setup()
    render(<BatchEditorScreen decks={DECKS} exePath="C:/balatro.exe" onBack={vi.fn()} />)

    await user.type(screen.getByLabelText(/^starting money$/i), '50')
    await user.click(screen.getByRole('button', { name: /apply to 2 decks/i }))
    await user.click(screen.getByRole('button', { name: /yes, apply/i }))

    expect(window.balatro.saveDecksBatch).toHaveBeenCalledWith('C:/balatro.exe', [
      { id: 'deck_bravo', name: 'Fixture Deck Bravo', config: { dollars: 50, consumables: [] } },
      { id: 'deck_charlie', name: 'Fixture Deck Charlie', config: { dollars: 50, consumables: [] } },
    ])
  })
})
