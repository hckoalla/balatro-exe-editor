import { HAND_ENTRY_LINE, HAND_FIELD_KEYS, HAS_HAND_FIELDS, type ParsedPokerHand } from './hand-entry'

/**
 * Regrava os 4 campos editáveis das mãos em `handsToApply` de volta no texto do `game.lua` —
 * substitui `s_mult`/`s_chips`/`l_mult`/`l_chips` e sincroniza `mult`/`chips` com os novos
 * `s_mult`/`s_chips` (ver `applyConfigToEntry`), preservando tudo mais na linha (`level`,
 * `example`, etc.) exatamente como estava. Mãos fora de `handsToApply` não são tocadas.
 */
export function serializePokerHandsBlock(
  gameLuaSource: string,
  handsToApply: ParsedPokerHand[],
): string {
  const handsByName = new Map(handsToApply.map((hand) => [hand.name, hand]))

  return gameLuaSource
    .split('\n')
    .map((line) => {
      const entryMatch = HAND_ENTRY_LINE.exec(line)
      if (!entryMatch) return line

      const [, name, body] = entryMatch
      if (!HAS_HAND_FIELDS.test(body)) return line

      const hand = handsByName.get(name)
      if (!hand) return line

      return line.replace(body, applyConfigToEntry(body, hand.config))
    })
    .join('\n')
}

function applyConfigToEntry(entryBody: string, config: ParsedPokerHand['config']): string {
  let newBody = entryBody
  for (const key of HAND_FIELD_KEYS) {
    newBody = newBody.replace(
      new RegExp(`\\b${key}\\s*=\\s*-?\\d+(?:\\.\\d+)?`),
      `${key} = ${config[key]}`,
    )
  }

  // O jogo só recalcula `mult`/`chips` (o que a mão realmente vale na pontuação) a partir de
  // `s_mult`/`s_chips` quando o jogador sobe a mão de nível (functions/common_events.lua,
  // level_up_hand) -- nessa tabela (estado inicial de uma run nova, level = 1), mult/chips
  // precisam ser sincronizados aqui, senão a edição de s_mult/s_chips fica sem efeito nenhum até
  // a primeira subida de nível daquela mão.
  newBody = newBody.replace(/\bmult\s*=\s*-?\d+(?:\.\d+)?/, `mult = ${config.s_mult}`)
  newBody = newBody.replace(/\bchips\s*=\s*-?\d+(?:\.\d+)?/, `chips = ${config.s_chips}`)

  return newBody
}
