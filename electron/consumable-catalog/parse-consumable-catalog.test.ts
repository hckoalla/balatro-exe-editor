import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseConsumableCatalog } from './parse-consumable-catalog'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('parseConsumableCatalog', () => {
  it('parses Tarot, Planet and Spectral entries with id + friendly name', () => {
    const catalog = parseConsumableCatalog(FIXTURE_GAME_LUA)

    expect(catalog).toContainEqual({
      id: 'c_fixture_tarot_one',
      name: 'The Fixture Fool',
      category: 'Tarot',
    })
    expect(catalog).toContainEqual({
      id: 'c_fixture_planet_one',
      name: 'Fixture Mercury',
      category: 'Planet',
    })
    expect(catalog).toContainEqual({
      id: 'c_fixture_spectral_one',
      name: 'Fixture Wraith',
      category: 'Spectral',
    })
  })

  it('covers all 3 categories, 2 entries each in the fixture', () => {
    const catalog = parseConsumableCatalog(FIXTURE_GAME_LUA)

    expect(catalog.filter((c) => c.category === 'Tarot')).toHaveLength(2)
    expect(catalog.filter((c) => c.category === 'Planet')).toHaveLength(2)
    expect(catalog.filter((c) => c.category === 'Spectral')).toHaveLength(2)
  })

  it('does not pick up deck entries (set = "Back") as consumables', () => {
    const catalog = parseConsumableCatalog(FIXTURE_GAME_LUA)

    expect(catalog.find((c) => c.id === 'deck_alpha')).toBeUndefined()
  })
})
