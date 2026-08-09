import {
  DECK_ENTRY_LINE,
  findConfigBlock,
  NUMERIC_CONFIG_KEYS,
  SET_BACK,
  type DeckConfig,
  type ParsedDeck,
} from './deck-entry'

export type { DeckConfig, ParsedDeck } from './deck-entry'

export function parseDeckBlock(gameLuaSource: string): ParsedDeck[] {
  const decks: ParsedDeck[] = []

  for (const line of gameLuaSource.split('\n')) {
    const entryMatch = DECK_ENTRY_LINE.exec(line)
    if (!entryMatch) continue

    const [, id, body] = entryMatch
    if (!SET_BACK.test(body)) continue

    decks.push({
      id,
      name: extractStringField(body, 'name') ?? id,
      config: extractConfig(body),
    })
  }

  return decks
}

function extractConfig(entryBody: string): DeckConfig {
  const configBlock = findConfigBlock(entryBody)?.block
  if (!configBlock) return {}

  const config: DeckConfig = {}

  for (const key of NUMERIC_CONFIG_KEYS) {
    const value = extractNumberField(configBlock, key)
    if (value !== undefined) config[key] = value
  }

  const consumables = extractConsumables(configBlock)
  if (consumables !== undefined) config.consumables = consumables

  return config
}

function extractNumberField(text: string, key: string): number | undefined {
  const match = new RegExp(`\\b${key}\\s*=\\s*(-?\\d+(?:\\.\\d+)?)`).exec(text)
  return match ? Number(match[1]) : undefined
}

function extractStringField(text: string, key: string): string | undefined {
  const match = new RegExp(`\\b${key}\\s*=\\s*['"]([^'"]*)['"]`).exec(text)
  return match ? match[1] : undefined
}

function extractConsumables(configBlock: string): string[] | undefined {
  const match = /consumables\s*=\s*\{([^}]*)\}/.exec(configBlock)
  if (!match) return undefined
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1])
}
