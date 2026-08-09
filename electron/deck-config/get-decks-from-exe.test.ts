import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { getDecksFromExe } from './get-decks-from-exe'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('getDecksFromExe', () => {
  it('reads the exe, extracts game.lua and parses the deck block', async () => {
    const exe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)

    const decks = await getDecksFromExe('C:/fake/balatro.exe', async () => exe)

    expect(decks).toHaveLength(16)
    expect(decks.find((d) => d.id === 'deck_bravo')).toEqual({
      id: 'deck_bravo',
      name: 'Fixture Deck Bravo',
      config: { dollars: 10 },
    })
  })
})
