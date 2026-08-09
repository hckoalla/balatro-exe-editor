import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_SETTINGS } from '../shared/settings-schema'
import { applyPersistedLanguage } from './apply-persisted-language'

describe('applyPersistedLanguage', () => {
  it('applies the language saved in settings on startup', async () => {
    const changeLanguage = vi.fn().mockResolvedValue(undefined)
    const getSettings = vi.fn().mockResolvedValue({ ...DEFAULT_SETTINGS, language: 'pt-BR' })

    await applyPersistedLanguage(getSettings, changeLanguage)

    expect(changeLanguage).toHaveBeenCalledWith('pt-BR')
  })

  it('applies English when that is the saved language (no-op, but consistent)', async () => {
    const changeLanguage = vi.fn().mockResolvedValue(undefined)
    const getSettings = vi.fn().mockResolvedValue(DEFAULT_SETTINGS)

    await applyPersistedLanguage(getSettings, changeLanguage)

    expect(changeLanguage).toHaveBeenCalledWith('en')
  })
})
