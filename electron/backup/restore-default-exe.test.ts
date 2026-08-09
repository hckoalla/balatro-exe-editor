import { describe, expect, it } from 'vitest'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { createBackupService, type BackupStore } from './backup-service'
import { restoreDefaultExe } from './restore-default-exe'

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

describe('restoreDefaultExe', () => {
  it('reinjects the backed-up game.lua into the exe and writes it to disk', async () => {
    const originalLua = 'return { original = true }'
    const editedLua = 'return { edited = true }'
    const backupService = createBackupService(createFakeStore())
    await backupService.ensureBackup('C:/games/balatro.exe', originalLua)

    const editedExe = buildSyntheticBalatroExe(editedLua)
    let writtenBuffer: Buffer | null = null

    await restoreDefaultExe('C:/games/balatro.exe', {
      backupService,
      readFile: async () => editedExe,
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
    })

    expect(writtenBuffer).not.toBeNull()
    expect(extractGameLua(writtenBuffer!)).toBe(originalLua)
  })

  it('propagates a clear error when there is no backup for the exe', async () => {
    const backupService = createBackupService(createFakeStore())

    await expect(
      restoreDefaultExe('C:/never/saved.exe', {
        backupService,
        readFile: async () => buildSyntheticBalatroExe('return {}'),
        writeFile: async () => {},
      }),
    ).rejects.toThrow(/no backup/i)
  })
})
