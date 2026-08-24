// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestoreButton } from './RestoreButton'

describe('RestoreButton', () => {
  it('renders nothing while there is no backup for the exe', async () => {
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(false)

    render(
      <RestoreButton
        exePath="C:/balatro.exe"
        onRestored={vi.fn()}
        restore={vi.fn()}
        labelKey="restore.button"
        confirmBodyKey="restore.confirmBody"
        confirmYesKey="restore.confirmYes"
      />,
    )

    await vi.waitFor(() => expect(window.balatro.hasBackup).toHaveBeenCalled())
    expect(screen.queryByRole('button', { name: /restore default/i })).not.toBeInTheDocument()
  })

  it('shows the button once a backup exists, asking for confirmation before calling restore', async () => {
    const user = userEvent.setup()
    const onRestored = vi.fn()
    const restore = vi.fn().mockResolvedValue(undefined)
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(true)

    render(
      <RestoreButton
        exePath="C:/balatro.exe"
        onRestored={onRestored}
        restore={restore}
        labelKey="restore.button"
        confirmBodyKey="restore.confirmBody"
        confirmYesKey="restore.confirmYes"
      />,
    )
    await user.click(await screen.findByRole('button', { name: /restore default/i }))

    expect(restore).not.toHaveBeenCalled()
    expect(screen.getByText(/close balatro/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /yes, restore/i }))

    expect(restore).toHaveBeenCalledWith('C:/balatro.exe')
    expect(onRestored).toHaveBeenCalled()
  })

  it('cancels without calling restore', async () => {
    const user = userEvent.setup()
    const restore = vi.fn()
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(true)

    render(
      <RestoreButton
        exePath="C:/balatro.exe"
        onRestored={vi.fn()}
        restore={restore}
        labelKey="restore.button"
        confirmBodyKey="restore.confirmBody"
        confirmYesKey="restore.confirmYes"
      />,
    )
    await user.click(await screen.findByRole('button', { name: /restore default/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(restore).not.toHaveBeenCalled()
    expect(screen.queryByText(/close balatro/i)).not.toBeInTheDocument()
  })
})
