import type { DeckConfig, ParsedDeck, SaveDeckResult } from '../../src/shared/deck-schema'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { updateGameLuaInExe } from '../exe-engine/update-game-lua-in-exe'
import { writeExeToDisk } from '../exe-engine/write-exe-to-disk'
import type { BackupService } from '../backup/backup-service'
import { detectPreexistingEdits } from '../backup/detect-preexisting-edits'
import { serializeDeckBlock } from './serialize-deck-block'

export interface SaveDeckToExeDeps {
  readFile: (path: string) => Promise<Buffer>
  writeFile: (path: string, data: Buffer) => Promise<void>
  backupService: BackupService
  // Testável — em produção usa KNOWN_DEFAULT_DECKS (default de detectPreexistingEdits).
  knownDefaults?: Record<string, DeckConfig>
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
): Promise<SaveDeckResult> {
  const currentExe = await deps.readFile(exePath)
  const currentGameLua = extractGameLua(currentExe)

  const backupStatus = await deps.backupService.ensureBackup(exePath, currentGameLua)
  const backupCreated = backupStatus === 'created'
  const possiblyPreEdited =
    backupCreated && detectPreexistingEdits(currentGameLua, deps.knownDefaults).length > 0

  const newGameLua = serializeDeckBlock(currentGameLua, [editedDeck])
  const updatedExe = updateGameLuaInExe(currentExe, newGameLua)
  await writeExeToDisk(exePath, updatedExe, deps.writeFile)

  return { backupCreated, possiblyPreEdited }
}
