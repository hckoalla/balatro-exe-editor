import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS, type AppSettings } from '../../src/shared/settings-schema'
import { createSettingsService, type KeyValueStore } from './settings-service'

function createFakeStore(initial: AppSettings): KeyValueStore<AppSettings> {
  let value = initial
  return {
    get: () => value,
    set: (next) => {
      value = next
    },
  }
}

describe('createSettingsService', () => {
  it('returns the current settings from the store', () => {
    const store = createFakeStore({ ...DEFAULT_SETTINGS, language: 'pt-BR' })
    const service = createSettingsService(store)

    expect(service.getSettings()).toEqual({ ...DEFAULT_SETTINGS, language: 'pt-BR' })
  })

  it('updates only the given fields, preserving the rest', () => {
    const store = createFakeStore(DEFAULT_SETTINGS)
    const service = createSettingsService(store)

    const updated = service.updateSettings({ lastExePath: 'C:/Games/balatro.exe' })

    expect(updated).toEqual({ ...DEFAULT_SETTINGS, lastExePath: 'C:/Games/balatro.exe' })
    expect(service.getSettings()).toEqual({ ...DEFAULT_SETTINGS, lastExePath: 'C:/Games/balatro.exe' })
  })
})
