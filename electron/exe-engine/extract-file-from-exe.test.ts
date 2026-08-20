import { describe, expect, it } from 'vitest'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractFileFromExe } from './extract-file-from-exe'

describe('extractFileFromExe', () => {
  it('extracts an arbitrary entry from the embedded ZIP by path', () => {
    const exe = buildSyntheticBalatroExe('return {}', {
      'textures/1x/Tarots.png': 'fake-atlas-bytes',
    })

    const result = extractFileFromExe(exe, 'textures/1x/Tarots.png')

    expect(result.toString('utf-8')).toBe('fake-atlas-bytes')
  })

  it('throws a clear error when the entry does not exist', () => {
    const exe = buildSyntheticBalatroExe('return {}')

    expect(() => extractFileFromExe(exe, 'textures/1x/Tarots.png')).toThrow(/not found/i)
  })
})
