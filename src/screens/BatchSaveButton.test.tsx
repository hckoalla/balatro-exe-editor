// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ParsedDeck } from '../shared/deck-schema'
import { BatchSaveButton } from './BatchSaveButton'

const DECKS: ParsedDeck[] = [
  { id: 'deck_bravo', name: 'Fixture Deck Bravo', config: { dollars: 10 } },
  { id: 'deck_charlie', name: 'Fixture Deck Charlie', config: {} },
]

describe('BatchSaveButton', () => {
  it('asks for confirmation naming how many decks are affected before writing to the exe', async () => {
    const user = userEvent.setup()
    render(
      <BatchSaveButton
        exePath="C:/balatro.exe"
        decks={DECKS}
        setup={{ dollars: 50 }}
        consumables={['c_fool']}
      />,
    )

    await user.click(screen.getByRole('button', { name: /apply to 2 decks/i }))

    expect(window.balatro.saveDecksBatch).not.toHaveBeenCalled()
    expect(screen.getByText(/close balatro/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /yes, apply to 2 decks/i }))

    expect(window.balatro.saveDecksBatch).toHaveBeenCalledWith('C:/balatro.exe', [
      { id: 'deck_bravo', name: 'Fixture Deck Bravo', config: { dollars: 50, consumables: ['c_fool'] } },
      { id: 'deck_charlie', name: 'Fixture Deck Charlie', config: { dollars: 50, consumables: ['c_fool'] } },
    ])
  })

  it('shows clear success feedback after saving', async () => {
    const user = userEvent.setup()
    render(<BatchSaveButton exePath="C:/balatro.exe" decks={DECKS} setup={{}} consumables={[]} />)

    await user.click(screen.getByRole('button', { name: /apply to 2 decks/i }))
    await user.click(screen.getByRole('button', { name: /yes, apply/i }))

    expect(await screen.findByText(/saved/i)).toBeInTheDocument()
  })

  it('shows a specific error message and keeps the setup when saving fails', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.saveDecksBatch).mockRejectedValue(
      new Error('"C:/balatro.exe" is in use by another program — close Balatro before saving.'),
    )

    render(<BatchSaveButton exePath="C:/balatro.exe" decks={DECKS} setup={{}} consumables={[]} />)
    await user.click(screen.getByRole('button', { name: /apply to 2 decks/i }))
    await user.click(screen.getByRole('button', { name: /yes, apply/i }))

    expect(await screen.findByText(/close balatro before saving/i)).toBeInTheDocument()
  })

  it('cancels without saving', async () => {
    const user = userEvent.setup()
    render(<BatchSaveButton exePath="C:/balatro.exe" decks={DECKS} setup={{}} consumables={[]} />)

    await user.click(screen.getByRole('button', { name: /apply to 2 decks/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(window.balatro.saveDecksBatch).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByText(/2 decks, replacing/i)).not.toBeInTheDocument())
  })
})
