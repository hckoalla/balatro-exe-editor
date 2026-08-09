import Store from 'electron-store'
import { DEFAULT_SETTINGS, type AppSettings } from '../../src/shared/settings-schema'
import type { KeyValueStore } from './settings-service'

export function createElectronSettingsStore(): KeyValueStore<AppSettings> {
  const store = new Store<AppSettings>({ defaults: DEFAULT_SETTINGS })

  return {
    get: () => store.store,
    set: (value) => {
      store.store = value
    },
  }
}
