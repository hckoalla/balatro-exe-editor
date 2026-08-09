import { describe, expect, it } from 'vitest'
import { createBackupService, type BackupStore } from './backup-service'

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

describe('createBackupService', () => {
  it('creates a backup on the first save for a given exe path', async () => {
    const store = createFakeStore()
    const service = createBackupService(store)

    const result = await service.ensureBackup('C:/games/balatro.exe', 'return { original = true }')

    expect(result).toBe('created')
    expect(await service.getBackup('C:/games/balatro.exe')).toBe('return { original = true }')
  })

  it('does not overwrite an existing backup on later saves', async () => {
    const store = createFakeStore()
    const service = createBackupService(store)
    await service.ensureBackup('C:/games/balatro.exe', 'return { original = true }')

    const result = await service.ensureBackup('C:/games/balatro.exe', 'return { edited = true }')

    expect(result).toBe('already-exists')
    expect(await service.getBackup('C:/games/balatro.exe')).toBe('return { original = true }')
  })

  it('keeps backups for different exe paths independent', async () => {
    const store = createFakeStore()
    const service = createBackupService(store)
    await service.ensureBackup('C:/games/balatro.exe', 'return { a = 1 }')
    await service.ensureBackup('D:/other/balatro.exe', 'return { b = 2 }')

    expect(await service.getBackup('C:/games/balatro.exe')).toBe('return { a = 1 }')
    expect(await service.getBackup('D:/other/balatro.exe')).toBe('return { b = 2 }')
  })

  it('throws a clear error when asked for a backup that does not exist', async () => {
    const store = createFakeStore()
    const service = createBackupService(store)

    await expect(service.getBackup('C:/never/saved.exe')).rejects.toThrow(/no backup/i)
  })

  it('reports whether a backup exists without needing to read it', async () => {
    const store = createFakeStore()
    const service = createBackupService(store)

    expect(await service.hasBackup('C:/games/balatro.exe')).toBe(false)
    await service.ensureBackup('C:/games/balatro.exe', 'return {}')
    expect(await service.hasBackup('C:/games/balatro.exe')).toBe(true)
  })
})
