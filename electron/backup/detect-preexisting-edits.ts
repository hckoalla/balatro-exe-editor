import type { DeckConfig } from '../../src/shared/deck-schema'
import { parseDeckBlock } from '../deck-config/parse-deck-block'
import { KNOWN_DEFAULT_DECKS, deckConfigsEqual } from './known-default-decks'

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
      return knownDefault !== undefined && !deckConfigsEqual(deck.config, knownDefault)
    })
    .map((deck) => deck.id)
}
