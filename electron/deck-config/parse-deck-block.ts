export interface DeckConfig {
  dollars?: number
  hands?: number
  discards?: number
  joker_slot?: number
  consumable_slot?: number
  consumables?: string[]
}

export interface ParsedDeck {
  id: string
  name: string
  config: DeckConfig
}

// Cada baralho é uma tabela Lua contida numa única linha, marcada por `set = "Back"` — não
// precisamos rastrear a estrutura do arquivo inteiro, só reconhecer esse formato por linha (ver
// Contexto do item.md).
const DECK_ENTRY_LINE = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(\{.*\})\s*,?\s*$/
const SET_BACK = /set\s*=\s*['"]Back['"]/

const NUMERIC_CONFIG_KEYS = ['dollars', 'hands', 'discards', 'joker_slot', 'consumable_slot'] as const

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
  const configBlock = extractConfigBlock(entryBody)
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

function extractConfigBlock(entryBody: string): string | null {
  const keyMatch = /config\s*=\s*\{/.exec(entryBody)
  if (!keyMatch) return null

  const openIndex = keyMatch.index + keyMatch[0].length - 1
  return extractBalancedBraces(entryBody, openIndex)
}

// `config` pode ter chaves aninhadas (`consumables = {...}`) — não dá pra usar regex guloso até
// o fim da linha, precisa contar chaves de verdade pra achar o `}` que fecha o `config` em si.
function extractBalancedBraces(text: string, openIndex: number): string | null {
  let depth = 0
  for (let i = openIndex; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) return text.slice(openIndex, i + 1)
    }
  }
  return null
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
