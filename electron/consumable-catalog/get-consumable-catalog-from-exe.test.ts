import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { getConsumableCatalogFromExe } from './get-consumable-catalog-from-exe'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('getConsumableCatalogFromExe', () => {
  it('reads the exe, extracts game.lua and parses the consumable catalog', async () => {
    const exe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)

    const catalog = await getConsumableCatalogFromExe('C:/fake/balatro.exe', async () => exe)

    expect(catalog).toHaveLength(6)
    expect(catalog).toContainEqual({
      id: 'c_fixture_tarot_one',
      name: 'The Fixture Fool',
      category: 'Tarot',
      pos: { x: 0, y: 0 },
    })
  })
})
