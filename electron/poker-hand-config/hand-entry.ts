// Compartilhado entre parse-poker-hands-block e serialize-poker-hands-block — mesmo espírito de
// electron/deck-config/deck-entry.ts: os dois precisam reconhecer uma entrada de mão da mesma
// forma exata.

export type { ParsedPokerHand, PokerHandConfig } from '../../src/shared/poker-hand-schema'

// Cada mão é uma entrada de uma linha só, chave string entre colchetes — ex.:
// ["Straight Flush"] = {visible = true, order = 4, mult = 8, chips = 100, s_mult = 8, ...},
export const HAND_ENTRY_LINE = /^\s*\["([^"]+)"\]\s*=\s*(\{.*\})\s*,?\s*$/
// `s_mult` só existe nas entradas de mão de pôquer — usado como marcador, mesmo papel de
// SET_BACK em deck-entry.ts, pra não confundir com outra tabela que use o mesmo formato de chave.
export const HAS_HAND_FIELDS = /\bs_mult\s*=/

export const HAND_FIELD_KEYS = ['s_mult', 's_chips', 'l_mult', 'l_chips'] as const
