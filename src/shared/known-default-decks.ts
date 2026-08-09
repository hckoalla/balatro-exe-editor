import type { DeckConfig } from './deck-schema'

/**
 * Valores DEFAULT reais de cada baralho, extraídos do `game.lua` do próprio usuário (linhas
 * ~628–644) — só os 6 campos que o app conhece (`dollars`, `hands`, `discards`, `joker_slot`,
 * `consumable_slot`, `consumables`); as demais chaves de `config` (`voucher`, `remove_faces`,
 * etc.) não entram porque o app não edita elas (ver BEE-10, fase 2).
 *
 * Usado tanto pelo main (detectar edição pré-existente antes do primeiro backup) quanto pelo
 * renderer (badge "Customized"/"Default" na lista de baralhos) — por isso vive em `shared`, não
 * em `electron/`.
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

const NUMERIC_KEYS = ['dollars', 'hands', 'discards', 'joker_slot', 'consumable_slot'] as const

export function deckConfigsEqual(a: DeckConfig, b: DeckConfig): boolean {
  if (NUMERIC_KEYS.some((key) => a[key] !== b[key])) return false

  const aConsumables = a.consumables ?? []
  const bConsumables = b.consumables ?? []
  return (
    aConsumables.length === bConsumables.length &&
    aConsumables.every((id, i) => id === bConsumables[i])
  )
}

/**
 * Baralho é "customizado" se difere do default CONHECIDO do jogo — não simplesmente "tem algo em
 * config" (a maioria dos baralhos já vem com config não-vazio de fábrica, ex: Red Deck tem
 * `discards = 1` por padrão). Baralhos sem default conhecido (versão do jogo diferente) usam a
 * heurística antiga (config não-vazio) como melhor esforço.
 */
export function isDeckCustomized(deck: { id: string; config: DeckConfig }): boolean {
  const knownDefault = KNOWN_DEFAULT_DECKS[deck.id]
  if (knownDefault === undefined) {
    return Object.keys(deck.config).length > 0
  }
  return !deckConfigsEqual(deck.config, knownDefault)
}
