import { join } from 'node:path'
import { parseVdfLibraryPaths } from './parse-vdf-library-paths'
import { extractAppmanifestInstallDir } from './extract-appmanifest-installdir'

const BALATRO_APP_ID = '2379780'

export interface DetectBalatroViaSteamDeps {
  getSteamPath: () => Promise<string | null>
  readFile: (path: string) => Promise<string>
  fileExists: (path: string) => Promise<boolean>
}

/**
 * Detecta o `balatro.exe` a partir de uma instalação via Steam, sem assumir `Program Files`:
 * registro → `libraryfolders.vdf` (todas as bibliotecas, não só a principal) →
 * `appmanifest_2379780.acf` por biblioteca → `Balatro.exe`. Nunca lança — qualquer etapa que
 * falhar (Steam não instalada, biblioteca sem o jogo, arquivo ausente/corrompido) resolve pra
 * `null`, e a UI cai de volta pro fluxo manual (ver bee8-detectar-instalacao-steam).
 */
export async function detectBalatroViaSteam(
  deps: DetectBalatroViaSteamDeps,
): Promise<string | null> {
  const steamPath = await deps.getSteamPath()
  if (!steamPath) return null

  let libraries: string[]
  try {
    const vdf = await deps.readFile(join(steamPath, 'steamapps', 'libraryfolders.vdf'))
    libraries = parseVdfLibraryPaths(vdf)
  } catch {
    return null
  }

  for (const library of libraries) {
    const exePath = await tryFindInLibrary(library, deps)
    if (exePath) return exePath
  }

  return null
}

async function tryFindInLibrary(
  library: string,
  deps: DetectBalatroViaSteamDeps,
): Promise<string | null> {
  try {
    const acf = await deps.readFile(
      join(library, 'steamapps', `appmanifest_${BALATRO_APP_ID}.acf`),
    )
    const installDir = extractAppmanifestInstallDir(acf)
    if (!installDir) return null

    const exePath = join(library, 'steamapps', 'common', installDir, 'Balatro.exe')
    return (await deps.fileExists(exePath)) ? exePath : null
  } catch {
    return null
  }
}
