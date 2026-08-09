import type { DeckConfig } from '../../src/shared/deck-schema'

/**
 * Valores DEFAULT reais de cada baralho, extraídos do `game.lua` do próprio usuário (linhas
 * ~628–644) — só os 6 campos que o app conhece (`dollars`, `hands`, `discards`, `joker_slot`,
 * `consumable_slot`, `consumables`); as demais chaves de `config` (`voucher`, `remove_faces`,
 * etc.) não entram porque o app não edita elas (ver BEE-10, fase 2). Usado só pra DETECTAR se um
 * baralho já foi editado antes do primeiro backup — ver `detect-preexisting-edits.ts`.
 */
export const KNOWN_DEFAULT_DECKS: Record<string, DeckConfig> = {
  b_red: { discards: 1 },
  b_blue: { hands: 1 },
  b_yellow: { dollars: 10 },
  b_green: {},
  b_black: { hands: -1, joker_slot: 1 },
  b_magic: { consumables: ['c_fool', 'c_fool'] },
  b_nebula: { consumable_slot: -1 },
  b_ghost: { consumables: ['c_hex'] },
  b_abandoned: {},
  b_checkered: {},
  b_zodiac: {},
  b_painted: { joker_slot: -1 },
  b_anaglyph: {},
  b_plasma: {},
  b_erratic: {},
  b_challenge: {},
}
