// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestoreDefaultButton } from './RestoreDefaultButton'

describe('RestoreDefaultButton', () => {
  it('renders nothing while there is no backup for the exe', async () => {
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(false)

    render(<RestoreDefaultButton exePath="C:/balatro.exe" onRestored={vi.fn()} />)

    await vi.waitFor(() => expect(window.balatro.hasBackup).toHaveBeenCalled())
    expect(screen.queryByRole('button', { name: /restore default/i })).not.toBeInTheDocument()
  })

  it('shows the button once a backup exists, asking for confirmation before restoring', async () => {
    const user = userEvent.setup()
    const onRestored = vi.fn()
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(true)

    render(<RestoreDefaultButton exePath="C:/balatro.exe" onRestored={onRestored} />)
    await user.click(await screen.findByRole('button', { name: /restore default/i }))

    // ainda não restaurou — precisa confirmar primeiro
    expect(window.balatro.restoreDefault).not.toHaveBeenCalled()
    expect(screen.getByText(/close balatro/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /yes, restore/i }))

    expect(window.balatro.restoreDefault).toHaveBeenCalledWith('C:/balatro.exe')
    expect(onRestored).toHaveBeenCalled()
  })

  it('cancels without restoring', async () => {
    const user = userEvent.setup()
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(true)

    render(<RestoreDefaultButton exePath="C:/balatro.exe" onRestored={vi.fn()} />)
    await user.click(await screen.findByRole('button', { name: /restore default/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(window.balatro.restoreDefault).not.toHaveBeenCalled()
    expect(screen.queryByText(/close balatro/i)).not.toBeInTheDocument()
  })
})
