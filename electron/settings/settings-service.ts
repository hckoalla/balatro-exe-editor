import type { AppSettings } from '../../src/shared/settings-schema'

export interface KeyValueStore<T> {
  get: () => T
  set: (value: T) => void
}

export interface SettingsService {
  getSettings: () => AppSettings
  updateSettings: (partial: Partial<AppSettings>) => AppSettings
}

export function createSettingsService(store: KeyValueStore<AppSettings>): SettingsService {
  return {
    getSettings: () => store.get(),
    updateSettings: (partial) => {
      const merged = { ...store.get(), ...partial }
      store.set(merged)
      return merged
    },
  }
}
