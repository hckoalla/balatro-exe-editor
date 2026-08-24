// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ParsedPokerHand } from '../shared/poker-hand-schema'
import { PokerHandsScreen } from './PokerHandsScreen'

const HANDS: ParsedPokerHand[] = [
  { name: 'Straight Flush', config: { s_mult: 8, s_chips: 100, l_mult: 4, l_chips: 40 } },
  { name: 'High Card', config: { s_mult: 1, s_chips: 5, l_mult: 1, l_chips: 10 } },
]

describe('PokerHandsScreen', () => {
  it('loads every hand and shows its 4 fields with the current values', async () => {
    vi.mocked(window.balatro.getPokerHands).mockResolvedValue(HANDS)

    render(<PokerHandsScreen exePath="C:/balatro.exe" />)

    expect(await screen.findByText('Straight Flush')).toBeInTheDocument()
    expect(screen.getByLabelText(/base mult.*straight flush/i)).toHaveValue(8)
    expect(screen.getByLabelText(/base chips.*straight flush/i)).toHaveValue(100)
    expect(screen.getByLabelText(/mult per level.*straight flush/i)).toHaveValue(4)
    expect(screen.getByLabelText(/chips per level.*straight flush/i)).toHaveValue(40)
  })

  it('lets the user edit a field', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getPokerHands).mockResolvedValue(HANDS)

    render(<PokerHandsScreen exePath="C:/balatro.exe" />)
    const field = await screen.findByLabelText(/base mult.*straight flush/i)
    await user.clear(field)
    await user.type(field, '15')

    expect(field).toHaveValue(15)
  })

  it('shows a provisional, unconfirmed warning when a field drifts more than 20 from its loaded value', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getPokerHands).mockResolvedValue(HANDS)

    render(<PokerHandsScreen exePath="C:/balatro.exe" />)
    const field = await screen.findByLabelText(/base mult.*straight flush/i)
    await user.clear(field)
    await user.type(field, '50')

    expect(screen.getByText(/hasn't been confirmed by testing/i)).toBeInTheDocument()
  })

  it('sends every hand, with edits applied, when the save is confirmed', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getPokerHands).mockResolvedValue(HANDS)

    render(<PokerHandsScreen exePath="C:/balatro.exe" />)
    const field = await screen.findByLabelText(/base mult.*straight flush/i)
    await user.clear(field)
    await user.type(field, '15')

    await user.click(screen.getByRole('button', { name: /^save$/i }))
    await user.click(screen.getByRole('button', { name: /yes, save/i }))

    expect(window.balatro.savePokerHands).toHaveBeenCalledWith('C:/balatro.exe', [
      { name: 'Straight Flush', config: { s_mult: 15, s_chips: 100, l_mult: 4, l_chips: 40 } },
      { name: 'High Card', config: { s_mult: 1, s_chips: 5, l_mult: 1, l_chips: 10 } },
    ])
  })

  it('reloads the hands after a scoped restore', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.getPokerHands).mockResolvedValue(HANDS)
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(true)

    render(<PokerHandsScreen exePath="C:/balatro.exe" />)
    await screen.findByText('Straight Flush')
    vi.mocked(window.balatro.getPokerHands).mockClear()

    await user.click(await screen.findByRole('button', { name: /restore poker hands/i }))
    await user.click(screen.getByRole('button', { name: /yes, restore poker hands/i }))

    expect(window.balatro.restorePokerHandsDefault).toHaveBeenCalledWith('C:/balatro.exe')
    expect(window.balatro.getPokerHands).toHaveBeenCalledWith('C:/balatro.exe')
  })
})
