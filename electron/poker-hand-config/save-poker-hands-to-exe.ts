import type { ParsedPokerHand, SavePokerHandsResult } from '../../src/shared/poker-hand-schema'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { updateGameLuaInExe } from '../exe-engine/update-game-lua-in-exe'
import { writeExeToDisk } from '../exe-engine/write-exe-to-disk'
import type { BackupService } from '../backup/backup-service'
import { serializePokerHandsBlock } from './serialize-poker-hands-block'

export interface SavePokerHandsToExeDeps {
  readFile: (path: string) => Promise<Buffer>
  writeFile: (path: string, data: Buffer) => Promise<void>
  backupService: BackupService
}

/**
 * Mesmo espírito de saveDecksToExe (electron/deck-config): garante o backup do `game.lua`
 * original, regrava as mãos editadas de volta no texto, reinjeta no `.exe` e grava em disco —
 * um único ciclo de leitura/escrita cobrindo todas as mãos editadas.
 */
export async function savePokerHandsToExe(
  exePath: string,
  editedHands: ParsedPokerHand[],
  deps: SavePokerHandsToExeDeps,
): Promise<SavePokerHandsResult> {
  const currentExe = await deps.readFile(exePath)
  const currentGameLua = extractGameLua(currentExe)

  const backupStatus = await deps.backupService.ensureBackup(exePath, currentGameLua)
  const backupCreated = backupStatus === 'created'

  const newGameLua = serializePokerHandsBlock(currentGameLua, editedHands)
  const updatedExe = updateGameLuaInExe(currentExe, newGameLua)
  await writeExeToDisk(exePath, updatedExe, deps.writeFile)

  return { backupCreated }
}
