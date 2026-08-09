// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ParsedDeck } from '../shared/deck-schema'
import { DeckEditorScreen } from './DeckEditorScreen'

const DECK: ParsedDeck = { id: 'deck_bravo', name: 'Fixture Deck Bravo', config: { dollars: 10 } }

describe('DeckEditorScreen', () => {
  it('shows the deck name and its numeric fields form', () => {
    render(<DeckEditorScreen deck={DECK} onBack={vi.fn()} />)

    expect(screen.getByText('Fixture Deck Bravo')).toBeInTheDocument()
    expect(screen.getByLabelText(/^starting money$/i)).toHaveValue(10)
  })

  it('calls onBack when the back link is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<DeckEditorScreen deck={DECK} onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(onBack).toHaveBeenCalled()
  })
})
