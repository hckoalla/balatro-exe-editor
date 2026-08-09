import { describe, expect, it } from 'vitest'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { DEFAULT_SETTINGS } from '../../src/shared/settings-schema'
import { createSettingsService, type KeyValueStore } from './settings-service'
import { registerSettingsHandlers } from './register-settings-handlers'
import type { AppSettings } from '../../src/shared/settings-schema'

function createFakeStore(initial: AppSettings): KeyValueStore<AppSettings> {
  let value = initial
  return {
    get: () => value,
    set: (next) => {
      value = next
    },
  }
}

describe('registerSettingsHandlers', () => {
  it('resolves the current settings via getSettings', async () => {
    const { ipcMain, invoke } = createFakeIpcMain()
    const service = createSettingsService(createFakeStore({ ...DEFAULT_SETTINGS, language: 'es' }))
    registerSettingsHandlers(ipcMain, service)

    await expect(invoke(IPC_CHANNELS.getSettings)).resolves.toEqual({
      ...DEFAULT_SETTINGS,
      language: 'es',
    })
  })

  it('applies a partial update via updateSettings', async () => {
    const { ipcMain, invoke } = createFakeIpcMain()
    const service = createSettingsService(createFakeStore(DEFAULT_SETTINGS))
    registerSettingsHandlers(ipcMain, service)

    const result = await invoke(IPC_CHANNELS.updateSettings, { lastExePath: 'C:/balatro.exe' })

    expect(result).toEqual({ ...DEFAULT_SETTINGS, lastExePath: 'C:/balatro.exe' })
  })
})
