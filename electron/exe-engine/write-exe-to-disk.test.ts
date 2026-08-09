import { describe, expect, it } from 'vitest'
import { FileInUseError, writeExeToDisk } from './write-exe-to-disk'

describe('writeExeToDisk', () => {
  it('writes the buffer to the given path using the injected writer', async () => {
    const writes: Array<{ path: string; data: Buffer }> = []

    await writeExeToDisk('C:/fake/balatro.exe', Buffer.from('data'), async (path, data) => {
      writes.push({ path, data })
    })

    expect(writes).toEqual([{ path: 'C:/fake/balatro.exe', data: Buffer.from('data') }])
  })

  it('wraps a file-lock error (EBUSY) into a clear FileInUseError', async () => {
    const lockedWriter = async () => {
      const error = new Error('resource busy or locked') as NodeJS.ErrnoException
      error.code = 'EBUSY'
      throw error
    }

    await expect(
      writeExeToDisk('C:/fake/balatro.exe', Buffer.from('x'), lockedWriter),
    ).rejects.toBeInstanceOf(FileInUseError)
  })

  it('rethrows unrelated errors unchanged', async () => {
    const brokenWriter = async () => {
      throw new Error('disk full')
    }

    await expect(
      writeExeToDisk('C:/fake/balatro.exe', Buffer.from('x'), brokenWriter),
    ).rejects.toThrow('disk full')
  })
})
