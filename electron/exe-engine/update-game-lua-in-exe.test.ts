import { describe, expect, it } from 'vitest'
import AdmZip from 'adm-zip'
import {
  buildSyntheticBalatroExe,
  FIXTURE_STUB,
} from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from './extract-game-lua'
import { locateEmbeddedZip } from './locate-embedded-zip'
import { updateGameLuaInExe } from './update-game-lua-in-exe'

describe('updateGameLuaInExe', () => {
  it('replaces game.lua while keeping the binary stub byte-for-byte untouched', () => {
    const original = buildSyntheticBalatroExe('return { original = true }')

    const updated = updateGameLuaInExe(original, 'return { updated = true }')

    expect(updated.subarray(0, FIXTURE_STUB.length)).toEqual(FIXTURE_STUB)
    expect(extractGameLua(updated)).toBe('return { updated = true }')
  })

  it('keeps other files inside the ZIP untouched', () => {
    const original = buildSyntheticBalatroExe('return {}', { 'conf.lua': '-- fixture conf' })

    const updated = updateGameLuaInExe(original, 'return { changed = true }')

    const zip = new AdmZip(updated.subarray(locateEmbeddedZip(updated)))
    expect(zip.getEntry('conf.lua')!.getData().toString('utf-8')).toBe('-- fixture conf')
  })

  it('round-trips: extract, modify, reinject, extract again matches', () => {
    const original = buildSyntheticBalatroExe('return { count = 1 }')
    const modified = extractGameLua(original).replace('count = 1', 'count = 2')

    const updated = updateGameLuaInExe(original, modified)

    expect(extractGameLua(updated)).toBe('return { count = 2 }')
  })
})
