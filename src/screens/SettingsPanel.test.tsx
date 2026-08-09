// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from '../i18n'
import { SettingsPanel } from './SettingsPanel'

describe('SettingsPanel', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('lists English, Português and Español as language options', async () => {
    const user = userEvent.setup()
    render(<SettingsPanel />)

    await user.click(screen.getByRole('button', { name: /settings/i }))

    expect(screen.getByRole('radio', { name: /english/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /português/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /español/i })).toBeInTheDocument()
  })

  it('switches the UI language immediately when a language is chosen', async () => {
    const user = userEvent.setup()
    render(<SettingsPanel />)

    await user.click(screen.getByRole('button', { name: /settings/i }))
    await user.click(screen.getByRole('radio', { name: /português/i }))

    expect(i18n.language).toBe('pt-BR')
    expect(await screen.findByRole('button', { name: /configurações/i })).toBeInTheDocument()
  })

  it('persists the chosen language via updateSettings', async () => {
    const user = userEvent.setup()
    render(<SettingsPanel />)

    await user.click(screen.getByRole('button', { name: /settings/i }))
    await user.click(screen.getByRole('radio', { name: /español/i }))

    expect(window.balatro.updateSettings).toHaveBeenCalledWith({ language: 'es' })
  })
})
