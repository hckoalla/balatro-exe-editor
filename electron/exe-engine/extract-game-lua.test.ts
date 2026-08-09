import { describe, expect, it } from 'vitest'
import AdmZip from 'adm-zip'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from './extract-game-lua'

describe('extractGameLua', () => {
  it('returns the game.lua contents as text', () => {
    const luaSource = 'return { hello = "world" }'
    const exe = buildSyntheticBalatroExe(luaSource)

    expect(extractGameLua(exe)).toBe(luaSource)
  })

  it('throws a clear error when the embedded ZIP has no game.lua entry', () => {
    const exeWithoutGameLua = Buffer.concat([
      Buffer.from('FIXTURE-LOVE2D-STUB-NOT-REAL\0'.repeat(4)),
      zipWithoutGameLua(),
    ])

    expect(() => extractGameLua(exeWithoutGameLua)).toThrow(/game\.lua/i)
  })
})

function zipWithoutGameLua(): Buffer {
  const zip = new AdmZip()
  zip.addFile('conf.lua', Buffer.from('-- no game.lua here'))
  return zip.toBuffer()
}
