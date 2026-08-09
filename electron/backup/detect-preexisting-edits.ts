import type { DeckConfig } from '../../src/shared/deck-schema'
import { parseDeckBlock } from '../deck-config/parse-deck-block'
import { KNOWN_DEFAULT_DECKS } from './known-default-decks'

const NUMERIC_KEYS = ['dollars', 'hands', 'discards', 'joker_slot', 'consumable_slot'] as const

function configsEqual(a: DeckConfig, b: DeckConfig): boolean {
  if (NUMERIC_KEYS.some((key) => a[key] !== b[key])) return false

  const aConsumables = a.consumables ?? []
  const bConsumables = b.consumables ?? []
  return (
    aConsumables.length === bConsumables.length &&
    aConsumables.every((id, i) => id === bConsumables[i])
  )
}

/**
 * Compara os baralhos do `game.lua` contra valores DEFAULT conhecidos (`KNOWN_DEFAULT_DECKS`,
 * por padrão) e retorna os IDs dos que já diferem — sinal de que o arquivo pode já ter sido
 * editado (manualmente ou por uma execução anterior sem backup) antes do primeiro backup deste
 * app. Baralhos sem default conhecido (ex: versão do jogo diferente) são ignorados, não
 * reportados como suspeitos.
 */
export function detectPreexistingEdits(
  gameLuaSource: string,
  knownDefaults: Record<string, DeckConfig> = KNOWN_DEFAULT_DECKS,
): string[] {
  return parseDeckBlock(gameLuaSource)
    .filter((deck) => {
      const knownDefault = knownDefaults[deck.id]
      return knownDefault !== undefined && !configsEqual(deck.config, knownDefault)
    })
    .map((deck) => deck.id)
}
