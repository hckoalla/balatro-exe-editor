import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parsePokerHandsBlock } from './parse-poker-hands-block'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('parsePokerHandsBlock', () => {
  it('parses every poker hand entry with its 4 editable fields', () => {
    const hands = parsePokerHandsBlock(FIXTURE_GAME_LUA)

    expect(hands).toHaveLength(3)
    expect(hands.find((h) => h.name === 'Fixture Hand One')).toEqual({
      name: 'Fixture Hand One',
      config: { s_mult: 8, s_chips: 40, l_mult: 2, l_chips: 10 },
    })
  })

  it('preserves the order hands appear in the source file', () => {
    const hands = parsePokerHandsBlock(FIXTURE_GAME_LUA)

    expect(hands.map((h) => h.name)).toEqual([
      'Fixture Hand One',
      'Fixture Hand Two',
      'Fixture Hand Three',
    ])
  })

  it('does not pick up unrelated bracket-keyed entries, like the deck block', () => {
    const hands = parsePokerHandsBlock(FIXTURE_GAME_LUA)

    expect(hands.some((h) => h.name.startsWith('Fixture Deck'))).toBe(false)
  })
})
