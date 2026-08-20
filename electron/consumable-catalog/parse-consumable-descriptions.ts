// Parser mínimo pros arquivos de localização do jogo (`localization/en-us.lua`, `pt_BR.lua`,
// `es_ES.lua`, ...) — não entende a estrutura toda do arquivo, só varre linha por linha
// procurando `<id>={` seguido (em algum momento depois) de `text={` com linhas de string, que é
// o formato usado pra descrição de cada carta. Não precisa rastrear em qual categoria
// (Tarot/Planet/Spectral) a entrada está — os IDs já são globalmente únicos no jogo, e quem
// filtra pelo catálogo certo é o chamador (ver bee5-tooltip-consumiveis).
const ENTRY_START = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\{$/
const TEXT_START = /^text\s*=\s*\{$/
const TEXT_LINE = /^"((?:[^"\\]|\\.)*)",?$/
const BLOCK_END = /^\},?$/

export function parseConsumableDescriptions(localizationLua: string): Map<string, string[]> {
  const descriptions = new Map<string, string[]>()

  let currentId: string | null = null
  let collectingText = false
  let textLines: string[] = []

  for (const rawLine of localizationLua.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (collectingText) {
      if (BLOCK_END.test(line)) {
        collectingText = false
        if (currentId) descriptions.set(currentId, textLines)
        continue
      }
      const textMatch = TEXT_LINE.exec(line)
      if (textMatch) textLines.push(textMatch[1])
      continue
    }

    if (TEXT_START.test(line)) {
      collectingText = true
      textLines = []
      continue
    }

    const entryMatch = ENTRY_START.exec(line)
    if (entryMatch) {
      currentId = entryMatch[1]
    }
  }

  return descriptions
}
