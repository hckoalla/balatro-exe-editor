import { HAND_ENTRY_LINE, HAND_FIELD_KEYS, HAS_HAND_FIELDS, type ParsedPokerHand } from './hand-entry'

/**
 * Regrava os 4 campos editáveis das mãos em `handsToApply` de volta no texto do `game.lua` —
 * substitui só `s_mult`/`s_chips`/`l_mult`/`l_chips`, preservando tudo mais na linha (`mult`,
 * `chips`, `level`, `example`, etc.) exatamente como estava. Mãos fora de `handsToApply` não são
 * tocadas.
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
  return newBody
}
