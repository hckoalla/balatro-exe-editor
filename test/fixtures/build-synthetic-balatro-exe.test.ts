import { describe, expect, it } from 'vitest'
import AdmZip from 'adm-zip'
import { buildSyntheticBalatroExe, FIXTURE_STUB } from './build-synthetic-balatro-exe'

describe('buildSyntheticBalatroExe', () => {
  it('prefixes the buffer with the fake stub bytes, untouched', () => {
    const exe = buildSyntheticBalatroExe('return {}')

    expect(exe.subarray(0, FIXTURE_STUB.length)).toEqual(FIXTURE_STUB)
  })

  it('appends a valid ZIP after the stub containing the given game.lua content', () => {
    const luaSource = 'return { hello = "world" }'
    const exe = buildSyntheticBalatroExe(luaSource)

    const zipBuffer = exe.subarray(FIXTURE_STUB.length)
    const zip = new AdmZip(zipBuffer)
    const entry = zip.getEntry('game.lua')

    expect(entry).not.toBeNull()
    expect(entry!.getData().toString('utf-8')).toBe(luaSource)
  })

  it('is deterministic: same input produces byte-identical output', () => {
    const a = buildSyntheticBalatroExe('return { x = 1 }')
    const b = buildSyntheticBalatroExe('return { x = 1 }')

    expect(a.equals(b)).toBe(true)
  })
})
