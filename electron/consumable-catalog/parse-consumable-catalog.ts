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

    const pos = extractPos(body)
    if (!pos) continue

    catalog.push({ id, name, category: categoryMatch[1] as ConsumableCategory, pos })
  }

  return catalog
}

function extractStringField(text: string, key: string): string | undefined {
  const match = new RegExp(`\\b${key}\\s*=\\s*['"]([^'"]*)['"]`).exec(text)
  return match ? match[1] : undefined
}

// Posição da célula do item dentro do atlas de sprites do jogo (ex. `resources/textures/1x/Tarots.png`) —
// usada pra recortar a imagem correta (ver bee5-imagens-consumiveis).
function extractPos(text: string): { x: number; y: number } | undefined {
  const match = /pos\s*=\s*\{\s*x\s*=\s*(-?\d+(?:\.\d+)?)\s*,\s*y\s*=\s*(-?\d+(?:\.\d+)?)\s*\}/.exec(
    text,
  )
  return match ? { x: Number(match[1]), y: Number(match[2]) } : undefined
}
