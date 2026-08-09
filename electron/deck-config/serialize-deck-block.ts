import {
  DECK_ENTRY_LINE,
  findConfigBlock,
  NUMERIC_CONFIG_KEYS,
  SET_BACK,
  type DeckConfig,
  type ParsedDeck,
} from './deck-entry'

/**
 * Regrava a `config` de cada baralho em `decksToApply` de volta no texto do `game.lua`,
 * campo por campo (não substitui o bloco inteiro) — chaves não reconhecidas dentro de `config`
 * (fora dos 6 campos conhecidos) são preservadas do jeito que estavam. Baralhos fora de
 * `decksToApply` não são tocados.
 */
export function serializeDeckBlock(gameLuaSource: string, decksToApply: ParsedDeck[]): string {
  const decksById = new Map(decksToApply.map((deck) => [deck.id, deck]))

  return gameLuaSource
    .split('\n')
    .map((line) => {
      const entryMatch = DECK_ENTRY_LINE.exec(line)
      if (!entryMatch) return line

      const [, id, body] = entryMatch
      if (!SET_BACK.test(body)) return line

      const deck = decksById.get(id)
      if (!deck) return line

      return line.replace(body, applyConfigToEntry(body, deck.config))
    })
    .join('\n')
}

function applyConfigToEntry(entryBody: string, newConfig: DeckConfig): string {
  const found = findConfigBlock(entryBody)
  if (!found) return entryBody

  const { block, startIndex } = found
  const mergedBlock = mergeConfigBlock(block, newConfig)

  return entryBody.slice(0, startIndex) + mergedBlock + entryBody.slice(startIndex + block.length)
}

interface ConfigSegment {
  key: string
  raw: string
}

function mergeConfigBlock(originalBlock: string, newConfig: DeckConfig): string {
  const segments = splitConfigSegments(originalBlock)

  for (const key of NUMERIC_CONFIG_KEYS) {
    applyField(segments, key, newConfig[key] === undefined ? undefined : `${key} = ${newConfig[key]}`)
  }

  const consumables = newConfig.consumables
  applyField(
    segments,
    'consumables',
    consumables === undefined
      ? undefined
      : `consumables = {${consumables.map((id) => `'${id}'`).join(', ')}}`,
  )

  return `{${segments.map((s) => s.raw).join(', ')}}`
}

function applyField(segments: ConfigSegment[], key: string, newRaw: string | undefined) {
  const existingIndex = segments.findIndex((s) => s.key === key)

  if (newRaw === undefined) {
    if (existingIndex >= 0) segments.splice(existingIndex, 1)
    return
  }

  if (existingIndex >= 0) {
    segments[existingIndex] = { key, raw: newRaw }
  } else {
    segments.push({ key, raw: newRaw })
  }
}

// Divide o conteúdo de `{...}` em segmentos separados por vírgula de nível superior, sem quebrar
// no meio de uma vírgula dentro de `consumables = {...}`.
function splitConfigSegments(configBlock: string): ConfigSegment[] {
  const inner = configBlock.slice(1, -1)
  const rawSegments: string[] = []
  let depth = 0
  let start = 0

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i]
    if (char === '{') depth++
    else if (char === '}') depth--
    else if (char === ',' && depth === 0) {
      rawSegments.push(inner.slice(start, i))
      start = i + 1
    }
  }
  const last = inner.slice(start)
  if (last.trim() !== '') rawSegments.push(last)

  return rawSegments
    .map((raw) => raw.trim())
    .map((raw) => ({ key: /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=/.exec(raw)![1], raw }))
}
