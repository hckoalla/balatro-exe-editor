import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { getPokerHandsFromExe } from './get-poker-hands-from-exe'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('getPokerHandsFromExe', () => {
  it('reads the exe, extracts game.lua and parses the poker hands block', async () => {
    const exe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)

    const hands = await getPokerHandsFromExe('C:/fake/balatro.exe', async () => exe)

    expect(hands).toHaveLength(3)
    expect(hands.find((h) => h.name === 'Fixture Hand One')).toEqual({
      name: 'Fixture Hand One',
      config: { s_mult: 8, s_chips: 40, l_mult: 2, l_chips: 10 },
    })
  })
})
