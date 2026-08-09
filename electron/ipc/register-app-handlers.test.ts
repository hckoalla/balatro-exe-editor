import { describe, expect, it } from 'vitest'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { registerAppHandlers } from './register-app-handlers'

describe('registerAppHandlers', () => {
  it('resolves the app version from the injected app instance', async () => {
    const { ipcMain, invoke } = createFakeIpcMain()
    registerAppHandlers(ipcMain, { getVersion: () => '1.2.3' })

    await expect(invoke(IPC_CHANNELS.getAppVersion)).resolves.toBe('1.2.3')
  })
})
