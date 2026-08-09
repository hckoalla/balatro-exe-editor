import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { DeckConfig } from '../../src/shared/deck-schema'
import { detectPreexistingEdits } from './detect-preexisting-edits'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

// Defaults fictícios que casam com os IDs da fixture (deck_alpha, deck_bravo, ...) — os defaults
// reais (KNOWN_DEFAULT_DECKS) usam IDs reais (b_red, b_blue, ...), que não aparecem na fixture.
const FIXTURE_DEFAULTS: Record<string, DeckConfig> = {
  deck_alpha: {},
  deck_bravo: { dollars: 10 },
  deck_charlie: { joker_slot: 1 },
}

describe('detectPreexistingEdits', () => {
  it('returns an empty list when every known deck matches its default', () => {
    expect(detectPreexistingEdits(FIXTURE_GAME_LUA, FIXTURE_DEFAULTS)).toEqual([])
  })

  it('flags a deck whose config no longer matches its known default', () => {
    const editedLua = FIXTURE_GAME_LUA.replace(
      'config = {dollars = 10}',
      'config = {dollars = 999}',
    )

    expect(detectPreexistingEdits(editedLua, FIXTURE_DEFAULTS)).toEqual(['deck_bravo'])
  })

  it('ignores decks that are not in the known-defaults map (different game version)', () => {
    // deck_delta não está em FIXTURE_DEFAULTS — mesmo tendo config não-vazio, não é reportado.
    expect(detectPreexistingEdits(FIXTURE_GAME_LUA, FIXTURE_DEFAULTS)).not.toContain('deck_delta')
  })

  it('uses KNOWN_DEFAULT_DECKS (real deck ids) by default, without crashing on fixture data', () => {
    // Fixture não tem b_red/b_blue/etc — nada deveria bater, mas não pode lançar erro.
    expect(() => detectPreexistingEdits(FIXTURE_GAME_LUA)).not.toThrow()
    expect(detectPreexistingEdits(FIXTURE_GAME_LUA)).toEqual([])
  })
})
