import { describe, expect, it, afterEach } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createFileBackupStore } from './file-backup-store'

const tempDirs: string[] = []

async function createTempDir() {
  const dir = await mkdtemp(join(tmpdir(), 'balatro-backup-test-'))
  tempDirs.push(dir)
  return dir
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

describe('createFileBackupStore', () => {
  it('reports no value for a key that was never written', async () => {
    const store = createFileBackupStore(join(await createTempDir(), 'backups'))

    expect(await store.has('some-key')).toBe(false)
  })

  it('writes and reads a value back, creating the directory if needed', async () => {
    const store = createFileBackupStore(join(await createTempDir(), 'backups'))

    await store.write('some-key', 'return { hello = "world" }')

    expect(await store.has('some-key')).toBe(true)
    expect(await store.read('some-key')).toBe('return { hello = "world" }')
  })
})
