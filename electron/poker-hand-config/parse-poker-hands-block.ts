import { HAND_ENTRY_LINE, HAS_HAND_FIELDS, type ParsedPokerHand } from './hand-entry'

export type { ParsedPokerHand, PokerHandConfig } from './hand-entry'

export function parsePokerHandsBlock(gameLuaSource: string): ParsedPokerHand[] {
  const hands: ParsedPokerHand[] = []

  for (const line of gameLuaSource.split('\n')) {
    const entryMatch = HAND_ENTRY_LINE.exec(line)
    if (!entryMatch) continue

    const [, name, body] = entryMatch
    if (!HAS_HAND_FIELDS.test(body)) continue

    hands.push({
      name,
      config: {
        s_mult: extractNumberField(body, 's_mult'),
        s_chips: extractNumberField(body, 's_chips'),
        l_mult: extractNumberField(body, 'l_mult'),
        l_chips: extractNumberField(body, 'l_chips'),
      },
    })
  }

  return hands
}

function extractNumberField(text: string, key: string): number {
  const match = new RegExp(`\\b${key}\\s*=\\s*(-?\\d+(?:\\.\\d+)?)`).exec(text)
  return match ? Number(match[1]) : 0
}
