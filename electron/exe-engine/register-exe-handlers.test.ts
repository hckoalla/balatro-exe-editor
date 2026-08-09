import { describe, expect, it } from 'vitest'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { registerExeHandlers } from './register-exe-handlers'

describe('registerExeHandlers', () => {
  describe('selectExeFile', () => {
    it('returns the chosen path when the user picks a file', async () => {
      const { ipcMain, invoke } = createFakeIpcMain()
      registerExeHandlers(ipcMain, {
        showOpenDialog: async () => ({ canceled: false, filePaths: ['C:/games/balatro.exe'] }),
        readFile: async () => Buffer.from(''),
      })

      await expect(invoke(IPC_CHANNELS.selectExeFile)).resolves.toEqual({
        canceled: false,
        filePath: 'C:/games/balatro.exe',
      })
    })

    it('returns canceled when the user closes the dialog without choosing', async () => {
      const { ipcMain, invoke } = createFakeIpcMain()
      registerExeHandlers(ipcMain, {
        showOpenDialog: async () => ({ canceled: true, filePaths: [] }),
        readFile: async () => Buffer.from(''),
      })

      await expect(invoke(IPC_CHANNELS.selectExeFile)).resolves.toEqual({
        canceled: true,
        filePath: null,
      })
    })
  })

  describe('validateExeFile', () => {
    it('resolves the validation result for the given path', async () => {
      const exe = buildSyntheticBalatroExe('return {}')
      const { ipcMain, invoke } = createFakeIpcMain()
      registerExeHandlers(ipcMain, {
        showOpenDialog: async () => ({ canceled: true, filePaths: [] }),
        readFile: async () => exe,
      })

      await expect(invoke(IPC_CHANNELS.validateExeFile, 'C:/games/balatro.exe')).resolves.toEqual(
        { valid: true, reason: null },
      )
    })
  })
})
