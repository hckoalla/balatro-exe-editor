// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from '../i18n'
import { SettingsScreen } from './SettingsScreen'

describe('SettingsScreen', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('lists English, Português and Español as language options, always visible', () => {
    render(<SettingsScreen exePath="C:/balatro.exe" />)

    expect(screen.getByRole('radio', { name: /english/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /português/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /español/i })).toBeInTheDocument()
  })

  it('switches the UI language immediately when a language is chosen', async () => {
    const user = userEvent.setup()
    render(<SettingsScreen exePath="C:/balatro.exe" />)

    await user.click(screen.getByRole('radio', { name: /português/i }))

    expect(i18n.language).toBe('pt-BR')
  })

  it('persists the chosen language via updateSettings', async () => {
    const user = userEvent.setup()
    render(<SettingsScreen exePath="C:/balatro.exe" />)

    await user.click(screen.getByRole('radio', { name: /español/i }))

    expect(window.balatro.updateSettings).toHaveBeenCalledWith({ language: 'es' })
  })

  it('shows the general restore-default button once a backup exists', async () => {
    vi.mocked(window.balatro.hasBackup).mockResolvedValue(true)

    render(<SettingsScreen exePath="C:/balatro.exe" />)

    expect(await screen.findByRole('button', { name: /restore default/i })).toBeInTheDocument()
  })
})
