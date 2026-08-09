import type { ParsedDeck } from '../../src/shared/deck-schema'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { updateGameLuaInExe } from '../exe-engine/update-game-lua-in-exe'
import { writeExeToDisk } from '../exe-engine/write-exe-to-disk'
import type { BackupService } from '../backup/backup-service'
import { serializeDeckBlock } from './serialize-deck-block'

export interface SaveDeckToExeDeps {
  readFile: (path: string) => Promise<Buffer>
  writeFile: (path: string, data: Buffer) => Promise<void>
  backupService: BackupService
}

/**
 * Ponto onde tudo se conecta: garante o backup do `game.lua` original (antes de qualquer
 * escrita), serializa o baralho editado de volta no texto do `game.lua`, reinjeta no `.exe` e
 * grava em disco.
 */
export async function saveDeckToExe(
  exePath: string,
  editedDeck: ParsedDeck,
  deps: SaveDeckToExeDeps,
): Promise<void> {
  const currentExe = await deps.readFile(exePath)
  const currentGameLua = extractGameLua(currentExe)

  await deps.backupService.ensureBackup(exePath, currentGameLua)

  const newGameLua = serializeDeckBlock(currentGameLua, [editedDeck])
  const updatedExe = updateGameLuaInExe(currentExe, newGameLua)
  await writeExeToDisk(exePath, updatedExe, deps.writeFile)
}
