// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ParsedDeck } from '../shared/deck-schema'
import { SaveButton } from './SaveButton'

const DECK: ParsedDeck = { id: 'deck_bravo', name: 'Fixture Deck Bravo', config: {} }

describe('SaveButton', () => {
  it('asks for confirmation before writing to the exe', async () => {
    const user = userEvent.setup()
    render(<SaveButton exePath="C:/balatro.exe" deck={DECK} config={{ dollars: 10 }} />)

    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(window.balatro.saveDeck).not.toHaveBeenCalled()
    expect(screen.getByText(/close balatro/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /yes, save/i }))

    expect(window.balatro.saveDeck).toHaveBeenCalledWith('C:/balatro.exe', {
      id: 'deck_bravo',
      name: 'Fixture Deck Bravo',
      config: { dollars: 10 },
    })
  })

  it('shows clear success feedback after saving', async () => {
    const user = userEvent.setup()
    render(<SaveButton exePath="C:/balatro.exe" deck={DECK} config={{}} />)

    await user.click(screen.getByRole('button', { name: /^save$/i }))
    await user.click(screen.getByRole('button', { name: /yes, save/i }))

    expect(await screen.findByText(/saved/i)).toBeInTheDocument()
  })

  it('shows a specific, actionable error message and keeps the edits when saving fails', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.saveDeck).mockRejectedValue(
      new Error('"C:/balatro.exe" is in use by another program — close Balatro before saving.'),
    )

    render(<SaveButton exePath="C:/balatro.exe" deck={DECK} config={{ dollars: 10 }} />)
    await user.click(screen.getByRole('button', { name: /^save$/i }))
    await user.click(screen.getByRole('button', { name: /yes, save/i }))

    expect(await screen.findByText(/close balatro before saving/i)).toBeInTheDocument()
    // ainda dá pra tentar salvar de novo — botão continua ali
    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument()
  })

  it('cancels without saving', async () => {
    const user = userEvent.setup()
    render(<SaveButton exePath="C:/balatro.exe" deck={DECK} config={{}} />)

    await user.click(screen.getByRole('button', { name: /^save$/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(window.balatro.saveDeck).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByText(/close balatro/i)).not.toBeInTheDocument())
  })
})
