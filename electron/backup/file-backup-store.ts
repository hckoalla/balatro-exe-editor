import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import type { BackupStore } from './backup-service'

/**
 * Implementação real de `BackupStore` — um arquivo `.lua` por chave, dentro de `baseDir`
 * (tipicamente `app.getPath('userData')/backups`).
 */
export function createFileBackupStore(baseDir: string): BackupStore {
  function pathFor(key: string): string {
    return path.join(baseDir, `${key}.lua`)
  }

  return {
    async has(key) {
      return existsSync(pathFor(key))
    },
    async write(key, content) {
      await mkdir(baseDir, { recursive: true })
      await writeFile(pathFor(key), content, 'utf-8')
    },
    async read(key) {
      return readFile(pathFor(key), 'utf-8')
    },
  }
}
