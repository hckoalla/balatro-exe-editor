// Parser mínimo pra `libraryfolders.vdf` — formato VDF (KeyValues) da Valve, não JSON. Não é um
// parser de VDF genérico: só sabe achar o campo "path" de cada biblioteca numerada de topo
// (`"0" { "path" "..." ... }`), que é tudo que a detecção via Steam precisa (ver
// bee8-detectar-instalacao-steam) — mesmo espírito do parser de baralho do game.lua, sob medida
// pro formato real, não um parser completo.
export function parseVdfLibraryPaths(vdf: string): string[] {
  const paths: string[] = []
  let depth = 0
  let libraryDepth: number | null = null

  for (const rawLine of vdf.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (line === '{') {
      depth++
      continue
    }
    if (line === '}') {
      if (depth === libraryDepth) libraryDepth = null
      depth--
      continue
    }

    // Uma chave numérica ("0", "1", ...) direto dentro de "libraryfolders" (depth 1) abre uma
    // nova biblioteca — o "{" na próxima linha vai levar a profundidade a esse nível.
    if (libraryDepth === null && depth === 1 && /^"\d+"$/.test(line)) {
      libraryDepth = 2
      continue
    }

    if (depth === libraryDepth) {
      const match = /^"path"\s+"((?:[^"\\]|\\.)*)"$/.exec(line)
      if (match) paths.push(match[1].replace(/\\\\/g, '\\'))
    }
  }

  return paths
}
