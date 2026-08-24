// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ParsedDeck } from '../shared/deck-schema'
import { BatchDecksScreen } from './BatchDecksScreen'

const DECKS: ParsedDeck[] = [
  { id: 'deck_alpha', name: 'Fixture Deck Alpha', config: {} },
  { id: 'deck_bravo', name: 'Fixture Deck Bravo', config: { dollars: 10 } },
  { id: 'deck_charlie', name: 'Fixture Deck Charlie', config: {} },
]

describe('BatchDecksScreen', () => {
  it('lists every deck with a checkbox, unchecked by default', async () => {
    vi.mocked(window.balatro.getDecks).mockResolvedValue(DECKS)

    render(<BatchDecksScreen exePath="C:/balatro.exe" onContinue={vi.fn()} />)

    const alpha = await screen.findByRole('checkbox', { name: /fixture deck alpha/i })
    expect(alpha).not.toBeChecked()
  })

  it('keeps the continue action disabled until at least one deck is selected', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getDecks).mockResolvedValue(DECKS)

    render(<BatchDecksScreen exePath="C:/balatro.exe" onContinue={vi.fn()} />)
    const button = await screen.findByRole('button', { name: /continue/i })
    expect(button).toBeDisabled()

    await user.click(screen.getByRole('checkbox', { name: /fixture deck alpha/i }))
    expect(button).toBeEnabled()
  })

  it('calls onContinue with the selected decks only', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()
    vi.mocked(window.balatro.getDecks).mockResolvedValue(DECKS)

    render(<BatchDecksScreen exePath="C:/balatro.exe" onContinue={onContinue} />)
    await user.click(await screen.findByRole('checkbox', { name: /fixture deck alpha/i }))
    await user.click(screen.getByRole('checkbox', { name: /fixture deck charlie/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(onContinue).toHaveBeenCalledWith([DECKS[0], DECKS[2]])
  })

  it('toggles a deck off when its checkbox is clicked twice', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getDecks).mockResolvedValue(DECKS)

    render(<BatchDecksScreen exePath="C:/balatro.exe" onContinue={vi.fn()} />)
    const alpha = await screen.findByRole('checkbox', { name: /fixture deck alpha/i })
    await user.click(alpha)
    await user.click(alpha)

    expect(alpha).not.toBeChecked()
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  })
})
