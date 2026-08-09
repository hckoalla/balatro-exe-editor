import { describe, expect, it } from 'vitest'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { createBackupService, type BackupStore } from './backup-service'
import { registerBackupHandlers } from './register-backup-handlers'

function createFakeStore(): BackupStore {
  const data = new Map<string, string>()
  return {
    has: async (key) => data.has(key),
    write: async (key, content) => {
      data.set(key, content)
    },
    read: async (key) => {
      const value = data.get(key)
      if (value === undefined) throw new Error(`No value for "${key}"`)
      return value
    },
  }
}

describe('registerBackupHandlers', () => {
  it('resolves hasBackup as false, then true after a backup is created', async () => {
    const backupService = createBackupService(createFakeStore())
    const { ipcMain, invoke } = createFakeIpcMain()
    registerBackupHandlers(ipcMain, {
      backupService,
      readFile: async () => buildSyntheticBalatroExe('return {}'),
      writeFile: async () => {},
    })

    expect(await invoke(IPC_CHANNELS.hasBackup, 'C:/games/balatro.exe')).toBe(false)
    await backupService.ensureBackup('C:/games/balatro.exe', 'return { original = true }')
    expect(await invoke(IPC_CHANNELS.hasBackup, 'C:/games/balatro.exe')).toBe(true)
  })

  it('restores the default game.lua via restoreDefault', async () => {
    const backupService = createBackupService(createFakeStore())
    await backupService.ensureBackup('C:/games/balatro.exe', 'return { original = true }')
    let writtenBuffer: Buffer | null = null

    const { ipcMain, invoke } = createFakeIpcMain()
    registerBackupHandlers(ipcMain, {
      backupService,
      readFile: async () => buildSyntheticBalatroExe('return { edited = true }'),
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
    })

    await invoke(IPC_CHANNELS.restoreDefault, 'C:/games/balatro.exe')

    expect(extractGameLua(writtenBuffer!)).toBe('return { original = true }')
  })
})
