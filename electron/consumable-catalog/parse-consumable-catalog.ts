// ConsumableCategory/ConsumableCatalogEntry vivem em src/shared (o renderer também precisa
// deles pro contrato de IPC).
export type {
  ConsumableCategory,
  ConsumableCatalogEntry,
} from '../../src/shared/consumable-catalog-schema'
import type {
  ConsumableCategory,
  ConsumableCatalogEntry,
} from '../../src/shared/consumable-catalog-schema'

const ENTRY_LINE = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(\{.*\})\s*,?\s*$/
const CATEGORY_MARKER = /set\s*=\s*['"](Tarot|Planet|Spectral)['"]/

/**
 * Extrai o catálogo de Tarots/Planetas/Spectrals do `game.lua`, com nome amigável — usado pra
 * popular o seletor de consumíveis iniciais na UI (BEE-5), em vez de expor os IDs internos do
 * jogo (`c_fool`, `c_hex`, ...) direto pro usuário.
 */
export function parseConsumableCatalog(gameLuaSource: string): ConsumableCatalogEntry[] {
  const catalog: ConsumableCatalogEntry[] = []

  for (const line of gameLuaSource.split('\n')) {
    const entryMatch = ENTRY_LINE.exec(line)
    if (!entryMatch) continue

    const [, id, body] = entryMatch
    const categoryMatch = CATEGORY_MARKER.exec(body)
    if (!categoryMatch) continue

    const name = extractStringField(body, 'name')
    if (!name) continue

    catalog.push({ id, name, category: categoryMatch[1] as ConsumableCategory })
  }

  return catalog
}

function extractStringField(text: string, key: string): string | undefined {
  const match = new RegExp(`\\b${key}\\s*=\\s*['"]([^'"]*)['"]`).exec(text)
  return match ? match[1] : undefined
}
