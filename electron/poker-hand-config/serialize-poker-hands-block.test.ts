import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parsePokerHandsBlock } from './parse-poker-hands-block'
import { serializePokerHandsBlock } from './serialize-poker-hands-block'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('serializePokerHandsBlock', () => {
  it('rewrites the edited fields of the given hands, leaving other hands untouched', () => {
    const one = { name: 'Fixture Hand One', config: { s_mult: 99, s_chips: 88, l_mult: 7, l_chips: 6 } }

    const updated = serializePokerHandsBlock(FIXTURE_GAME_LUA, [one])
    const reparsed = parsePokerHandsBlock(updated)

    expect(reparsed.find((h) => h.name === 'Fixture Hand One')!.config).toEqual({
      s_mult: 99,
      s_chips: 88,
      l_mult: 7,
      l_chips: 6,
    })
    expect(reparsed.find((h) => h.name === 'Fixture Hand Two')!.config).toEqual({
      s_mult: 4,
      s_chips: 20,
      l_mult: 1,
      l_chips: 5,
    })
  })

  it('preserves fields that are neither editable nor derived from them (level, example, etc.)', () => {
    const one = { name: 'Fixture Hand One', config: { s_mult: 99, s_chips: 88, l_mult: 7, l_chips: 6 } }

    const updated = serializePokerHandsBlock(FIXTURE_GAME_LUA, [one])

    expect(updated).toContain("example = {{'S_A', true}}")
    expect(updated).toContain('level = 1,')
  })

  it('also syncs mult/chips (the fields the game actually scores with) to match s_mult/s_chips', () => {
    // O jogo só recalcula mult/chips a partir de s_mult/s_chips quando o jogador sobe a mão de
    // nível (functions/common_events.lua, level_up_hand) -- numa run nova (level = 1), mult/chips
    // ficam travados no valor gravado no arquivo até isso acontecer. Editar só s_mult/s_chips sem
    // sincronizar mult/chips faz a edição não ter efeito nenhum até o jogador subir aquela mão.
    const one = { name: 'Fixture Hand One', config: { s_mult: 99, s_chips: 88, l_mult: 7, l_chips: 6 } }

    const updated = serializePokerHandsBlock(FIXTURE_GAME_LUA, [one])

    expect(updated).toMatch(/\["Fixture Hand One"\][^\n]*\bmult = 99\b/)
    expect(updated).toMatch(/\["Fixture Hand One"\][^\n]*\bchips = 88\b/)
  })

  it('applies changes to more than one hand in a single pass', () => {
    const edited = [
      { name: 'Fixture Hand One', config: { s_mult: 1, s_chips: 1, l_mult: 1, l_chips: 1 } },
      { name: 'Fixture Hand Three', config: { s_mult: 2, s_chips: 2, l_mult: 2, l_chips: 2 } },
    ]

    const updated = serializePokerHandsBlock(FIXTURE_GAME_LUA, edited)
    const reparsed = parsePokerHandsBlock(updated)

    expect(reparsed.find((h) => h.name === 'Fixture Hand One')!.config).toEqual({
      s_mult: 1,
      s_chips: 1,
      l_mult: 1,
      l_chips: 1,
    })
    expect(reparsed.find((h) => h.name === 'Fixture Hand Three')!.config).toEqual({
      s_mult: 2,
      s_chips: 2,
      l_mult: 2,
      l_chips: 2,
    })
  })
})
