import { createHash } from 'node:crypto'

export interface BackupStore {
  has: (key: string) => Promise<boolean>
  write: (key: string, content: string) => Promise<void>
  read: (key: string) => Promise<string>
}

export type EnsureBackupResult = 'created' | 'already-exists'

export interface BackupService {
  ensureBackup: (exePath: string, currentGameLua: string) => Promise<EnsureBackupResult>
  hasBackup: (exePath: string) => Promise<boolean>
  getBackup: (exePath: string) => Promise<string>
}

/**
 * Um backup por `.exe` — a primeira gravação sobre um caminho cria o backup a partir do
 * `game.lua` ainda intocado; gravações seguintes reaproveitam o mesmo backup (nunca sobrescrevem
 * com uma versão já editada).
 */
export function createBackupService(store: BackupStore): BackupService {
  return {
    async ensureBackup(exePath, currentGameLua) {
      const key = keyFor(exePath)
      if (await store.has(key)) return 'already-exists'
      await store.write(key, currentGameLua)
      return 'created'
    },

    hasBackup(exePath) {
      return store.has(keyFor(exePath))
    },

    async getBackup(exePath) {
      const key = keyFor(exePath)
      if (!(await store.has(key))) {
        throw new Error(`No backup found for "${exePath}".`)
      }
      return store.read(key)
    },
  }
}

function keyFor(exePath: string): string {
  return createHash('sha256').update(exePath).digest('hex')
}
