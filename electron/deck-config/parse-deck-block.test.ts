import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseDeckBlock } from './parse-deck-block'

const FIXTURE_GAME_LUA = readFileSync(
  join(__dirname, '../../test/fixtures/game.lua'),
  'utf-8',
)

describe('parseDeckBlock', () => {
  it('parses all 16 fixture decks (15 playable + challenge)', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)

    expect(decks).toHaveLength(16)
    expect(decks.map((d) => d.id)).toContain('deck_alpha')
    expect(decks.map((d) => d.id)).toContain('deck_challenge')
  })

  it('leaves config empty for a deck with config = {}', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const alpha = decks.find((d) => d.id === 'deck_alpha')!

    expect(alpha.name).toBe('Fixture Deck Alpha')
    expect(alpha.config).toEqual({})
  })

  it('parses a single numeric field (dollars)', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const bravo = decks.find((d) => d.id === 'deck_bravo')!

    expect(bravo.config).toEqual({ dollars: 10 })
  })

  it('parses joker_slot and consumable_slot individually', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const charlie = decks.find((d) => d.id === 'deck_charlie')!
    const delta = decks.find((d) => d.id === 'deck_delta')!

    expect(charlie.config).toEqual({ joker_slot: 1 })
    expect(delta.config).toEqual({ consumable_slot: -1 })
  })

  it('parses the consumables list, keeping duplicates', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const echo = decks.find((d) => d.id === 'deck_echo')!

    expect(echo.config).toEqual({ consumables: ['c_fixture_one', 'c_fixture_one'] })
  })

  it('parses multiple combined fields on the same deck', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const foxtrot = decks.find((d) => d.id === 'deck_foxtrot')!

    expect(foxtrot.config).toEqual({ dollars: 25, joker_slot: 2, consumable_slot: 1 })
  })

  it('parses negative deltas', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const golf = decks.find((d) => d.id === 'deck_golf')!
    const kilo = decks.find((d) => d.id === 'deck_kilo')!

    expect(golf.config).toEqual({ hands: -1, joker_slot: 1 })
    expect(kilo.config).toEqual({ dollars: -5 })
  })

  it('ignores config keys outside the 6 known ones, without throwing', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const india = decks.find((d) => d.id === 'deck_india')!
    const juliet = decks.find((d) => d.id === 'deck_juliet')!
    const oscar = decks.find((d) => d.id === 'deck_oscar')!

    expect(india.config).toEqual({})
    expect(juliet.config).toEqual({})
    expect(oscar.config).toEqual({})
  })

  it('parses the special challenge deck like any other', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const challenge = decks.find((d) => d.id === 'deck_challenge')!

    expect(challenge.name).toBe('Fixture Challenge Deck')
    expect(challenge.config).toEqual({})
  })
})
