// Compartilhado entre parse-deck-block e serialize-deck-block — os dois precisam reconhecer uma
// entrada de baralho da mesma forma exata, senão um consegue achar uma linha que o outro não.

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
// Contexto do item.md de bee4-parser-bloco-baralhos).
export const DECK_ENTRY_LINE = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(\{.*\})\s*,?\s*$/
export const SET_BACK = /set\s*=\s*['"]Back['"]/

export const NUMERIC_CONFIG_KEYS = [
  'dollars',
  'hands',
  'discards',
  'joker_slot',
  'consumable_slot',
] as const

// `config` pode ter chaves aninhadas (`consumables = {...}`) — não dá pra usar regex guloso até
// o fim da linha, precisa contar chaves de verdade pra achar o `}` que fecha o bloco em si.
export function extractBalancedBraces(text: string, openIndex: number): string | null {
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

export function findConfigBlock(entryBody: string): { block: string; startIndex: number } | null {
  const keyMatch = /config\s*=\s*\{/.exec(entryBody)
  if (!keyMatch) return null

  const startIndex = keyMatch.index + keyMatch[0].length - 1
  const block = extractBalancedBraces(entryBody, startIndex)
  return block ? { block, startIndex } : null
}
