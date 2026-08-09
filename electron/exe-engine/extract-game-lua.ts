import AdmZip from 'adm-zip'
import { locateEmbeddedZip } from './locate-embedded-zip'

const GAME_LUA_ENTRY = 'game.lua'

/**
 * Extrai o conteúdo de `game.lua` de dentro do ZIP embutido num `.exe` fusionado do LÖVE2D.
 */
export function extractGameLua(exeBuffer: Buffer): string {
  const zipStartOffset = locateEmbeddedZip(exeBuffer)
  const zip = new AdmZip(exeBuffer.subarray(zipStartOffset))

  const entry = zip.getEntry(GAME_LUA_ENTRY)
  if (!entry) {
    throw new Error(
      `No "${GAME_LUA_ENTRY}" entry found inside the embedded ZIP — this does not look like a Balatro executable.`,
    )
  }

  return entry.getData().toString('utf-8')
}
