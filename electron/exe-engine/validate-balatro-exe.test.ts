import { describe, expect, it } from 'vitest'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { validateBalatroExe } from './validate-balatro-exe'

describe('validateBalatroExe', () => {
  it('is valid when the file is a fused exe containing game.lua', async () => {
    const exe = buildSyntheticBalatroExe('return {}')

    const result = await validateBalatroExe('C:/fake/balatro.exe', async () => exe)

    expect(result).toEqual({ valid: true, reason: null })
  })

  it('is invalid with a clear reason when the buffer has no embedded ZIP', async () => {
    const notAnExe = Buffer.from('just some random bytes')

    const result = await validateBalatroExe('C:/fake/balatro.exe', async () => notAnExe)

    expect(result.valid).toBe(false)
    expect(result.reason).toMatch(/does not look like a fused/i)
  })

  it('is invalid with a clear reason when the file cannot be read', async () => {
    const result = await validateBalatroExe('C:/missing/balatro.exe', async () => {
      throw new Error('ENOENT: no such file or directory')
    })

    expect(result.valid).toBe(false)
    expect(result.reason).toBeTruthy()
  })
})
