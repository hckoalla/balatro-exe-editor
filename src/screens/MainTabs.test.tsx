// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MainTabs } from './MainTabs'

describe('MainTabs', () => {
  it('shows the deck editor flow by default', async () => {
    vi.mocked(window.balatro.getDecks).mockResolvedValue([])

    render(<MainTabs exePath="C:/balatro.exe" />)

    expect(await screen.findByText(/choose a deck/i)).toBeInTheDocument()
  })

  it('switches to the batch edit flow when its tab is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getDecks).mockResolvedValue([])

    render(<MainTabs exePath="C:/balatro.exe" />)
    await screen.findByText(/choose a deck/i)

    await user.click(screen.getByRole('tab', { name: /batch deck editor/i }))

    expect(await screen.findByText(/select decks to edit/i)).toBeInTheDocument()
  })

  it('switches to the poker hand editor flow when its tab is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getDecks).mockResolvedValue([])
    vi.mocked(window.balatro.getPokerHands).mockResolvedValue([])

    render(<MainTabs exePath="C:/balatro.exe" />)
    await screen.findByText(/choose a deck/i)

    await user.click(screen.getByRole('tab', { name: /poker hand editor/i }))

    expect(await screen.findByText(/poker hand levels/i)).toBeInTheDocument()
  })

  it('switches to the settings flow when its tab is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getDecks).mockResolvedValue([])

    render(<MainTabs exePath="C:/balatro.exe" />)
    await screen.findByText(/choose a deck/i)

    await user.click(screen.getByRole('tab', { name: /^settings$/i }))

    expect(await screen.findByRole('radiogroup', { name: /language/i })).toBeInTheDocument()
  })

  it('switches back to the deck editor flow', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getDecks).mockResolvedValue([])

    render(<MainTabs exePath="C:/balatro.exe" />)
    await user.click(screen.getByRole('tab', { name: /batch deck editor/i }))
    await screen.findByText(/select decks to edit/i)

    await user.click(screen.getByRole('tab', { name: /^deck editor$/i }))

    expect(await screen.findByText(/choose a deck/i)).toBeInTheDocument()
  })
})
