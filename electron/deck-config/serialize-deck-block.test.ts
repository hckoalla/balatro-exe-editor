import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseDeckBlock } from './parse-deck-block'
import { serializeDeckBlock } from './serialize-deck-block'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('serializeDeckBlock', () => {
  it('round-trips: parsing then serializing unchanged decks produces identical text', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)

    const result = serializeDeckBlock(FIXTURE_GAME_LUA, decks)

    expect(result).toBe(FIXTURE_GAME_LUA)
  })

  it('adds a new key to a deck whose config did not have it before', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const alpha = decks.find((d) => d.id === 'deck_alpha')!
    alpha.config = { dollars: 42 }

    const result = serializeDeckBlock(FIXTURE_GAME_LUA, [alpha])

    expect(result).toContain('deck_alpha=    {name = "Fixture Deck Alpha"')
    expect(result).toMatch(/deck_alpha=.*config = \{dollars = 42\}/)
    // resto do arquivo intacto
    expect(result).toContain('deck_bravo=    {name = "Fixture Deck Bravo"')
  })

  it('updates an existing key in place', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const bravo = decks.find((d) => d.id === 'deck_bravo')!
    bravo.config = { dollars: 999 }

    const result = serializeDeckBlock(FIXTURE_GAME_LUA, [bravo])

    expect(result).toMatch(/deck_bravo=.*config = \{dollars = 999\}/)
  })

  it('removes a key when the caller clears it', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const bravo = decks.find((d) => d.id === 'deck_bravo')!
    bravo.config = {}

    const result = serializeDeckBlock(FIXTURE_GAME_LUA, [bravo])

    expect(result).toMatch(/deck_bravo=.*config = \{\}/)
  })

  it('preserves unrelated config keys it does not understand', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const india = decks.find((d) => d.id === 'deck_india')!
    // parser não capturou `some_unknown_flag` (fora dos 6 campos conhecidos) — deck.config é {}.
    // Mesmo assim, adicionar um campo conhecido não pode apagar o campo desconhecido do texto.
    india.config = { dollars: 5 }

    const result = serializeDeckBlock(FIXTURE_GAME_LUA, [india])

    expect(result).toMatch(/deck_india=.*some_unknown_flag = true/)
    expect(result).toMatch(/deck_india=.*dollars = 5/)
  })

  it('only touches the config of the requested deck, leaving all other lines untouched', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const charlie = decks.find((d) => d.id === 'deck_charlie')!
    charlie.config = { joker_slot: 99 }

    const result = serializeDeckBlock(FIXTURE_GAME_LUA, [charlie])
    const originalLines = FIXTURE_GAME_LUA.split('\n')
    const resultLines = result.split('\n')

    const changedLines = originalLines.filter((line, i) => line !== resultLines[i])
    expect(changedLines).toHaveLength(1)
    expect(changedLines[0]).toContain('deck_charlie')
  })

  it('serializes the consumables list', () => {
    const decks = parseDeckBlock(FIXTURE_GAME_LUA)
    const alpha = decks.find((d) => d.id === 'deck_alpha')!
    alpha.config = { consumables: ['c_new_one', 'c_new_two'] }

    const result = serializeDeckBlock(FIXTURE_GAME_LUA, [alpha])

    expect(result).toMatch(/deck_alpha=.*consumables = \{'c_new_one', 'c_new_two'\}/)
  })
})
