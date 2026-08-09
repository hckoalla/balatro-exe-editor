// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectExeScreen } from './SelectExeScreen'

describe('SelectExeScreen', () => {
  it('lets the user browse for and select a valid exe', async () => {
    const user = userEvent.setup()
    const onExeSelected = vi.fn()
    vi.mocked(window.balatro.selectExeFile).mockResolvedValue({
      canceled: false,
      filePath: 'C:/games/balatro.exe',
    })
    vi.mocked(window.balatro.validateExeFile).mockResolvedValue({ valid: true, reason: null })

    render(<SelectExeScreen onExeSelected={onExeSelected} />)
    await user.click(screen.getByRole('button', { name: /browse/i }))

    await waitFor(() => expect(onExeSelected).toHaveBeenCalledWith('C:/games/balatro.exe'))
    expect(window.balatro.updateSettings).toHaveBeenCalledWith({
      lastExePath: 'C:/games/balatro.exe',
    })
  })

  it('shows a clear error and allows retrying when the file is invalid', async () => {
    const user = userEvent.setup()
    const onExeSelected = vi.fn()
    vi.mocked(window.balatro.selectExeFile).mockResolvedValue({
      canceled: false,
      filePath: 'C:/games/not-balatro.exe',
    })
    vi.mocked(window.balatro.validateExeFile).mockResolvedValue({
      valid: false,
      reason: 'No "game.lua" entry found inside the embedded ZIP.',
    })

    render(<SelectExeScreen onExeSelected={onExeSelected} />)
    await user.click(screen.getByRole('button', { name: /browse/i }))

    expect(await screen.findByText(/no "game\.lua" entry found/i)).toBeInTheDocument()
    expect(onExeSelected).not.toHaveBeenCalled()
    // ainda dá pra tentar de novo
    expect(screen.getByRole('button', { name: /browse/i })).toBeEnabled()
  })

  it('does nothing when the user cancels the native dialog', async () => {
    const user = userEvent.setup()
    const onExeSelected = vi.fn()
    vi.mocked(window.balatro.selectExeFile).mockResolvedValue({ canceled: true, filePath: null })

    render(<SelectExeScreen onExeSelected={onExeSelected} />)
    await user.click(screen.getByRole('button', { name: /browse/i }))

    expect(onExeSelected).not.toHaveBeenCalled()
    expect(window.balatro.validateExeFile).not.toHaveBeenCalled()
  })

  it('suggests reopening the last used exe path when it is still valid', async () => {
    const user = userEvent.setup()
    const onExeSelected = vi.fn()
    vi.mocked(window.balatro.getSettings).mockResolvedValue({
      lastExePath: 'C:/games/balatro.exe',
      language: 'en',
    })
    vi.mocked(window.balatro.validateExeFile).mockResolvedValue({ valid: true, reason: null })

    render(<SelectExeScreen onExeSelected={onExeSelected} />)

    const continueButton = await screen.findByRole('button', { name: /continue/i })
    await user.click(continueButton)

    expect(onExeSelected).toHaveBeenCalledWith('C:/games/balatro.exe')
  })

  it('falls back to the manual flow silently when the saved path is no longer valid', async () => {
    vi.mocked(window.balatro.getSettings).mockResolvedValue({
      lastExePath: 'C:/games/moved.exe',
      language: 'en',
    })
    vi.mocked(window.balatro.validateExeFile).mockResolvedValue({
      valid: false,
      reason: 'Could not read "C:/games/moved.exe".',
    })

    render(<SelectExeScreen onExeSelected={vi.fn()} />)

    await waitFor(() => expect(window.balatro.validateExeFile).toHaveBeenCalled())
    expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/could not read/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument()
  })
})
