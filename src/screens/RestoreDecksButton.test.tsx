// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestoreDecksButton } from './RestoreDecksButton'

describe('RestoreDecksButton', () => {
  it('calls restoreDecksDefault, not the general restore, once confirmed', async () => {
    const user = userEvent.setup()
    const onRestored = vi.fn()
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(true)

    render(<RestoreDecksButton exePath="C:/balatro.exe" onRestored={onRestored} />)
    await user.click(await screen.findByRole('button', { name: /restore decks/i }))
    await user.click(screen.getByRole('button', { name: /yes, restore decks/i }))

    expect(window.balatro.restoreDecksDefault).toHaveBeenCalledWith('C:/balatro.exe')
    expect(window.balatro.restoreDefault).not.toHaveBeenCalled()
    expect(onRestored).toHaveBeenCalled()
  })
})
