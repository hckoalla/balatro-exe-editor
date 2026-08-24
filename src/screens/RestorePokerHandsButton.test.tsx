// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestorePokerHandsButton } from './RestorePokerHandsButton'

describe('RestorePokerHandsButton', () => {
  it('calls restorePokerHandsDefault, not the general restore, once confirmed', async () => {
    const user = userEvent.setup()
    const onRestored = vi.fn()
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(true)

    render(<RestorePokerHandsButton exePath="C:/balatro.exe" onRestored={onRestored} />)
    await user.click(await screen.findByRole('button', { name: /restore poker hands/i }))
    await user.click(screen.getByRole('button', { name: /yes, restore poker hands/i }))

    expect(window.balatro.restorePokerHandsDefault).toHaveBeenCalledWith('C:/balatro.exe')
    expect(window.balatro.restoreDefault).not.toHaveBeenCalled()
    expect(onRestored).toHaveBeenCalled()
  })
})
