import { extractGameLua } from '../exe-engine/extract-game-lua'
import { updateGameLuaInExe } from '../exe-engine/update-game-lua-in-exe'
import { writeExeToDisk } from '../exe-engine/write-exe-to-disk'
import type { BackupService } from '../backup/backup-service'
import { parsePokerHandsBlock } from './parse-poker-hands-block'
import { serializePokerHandsBlock } from './serialize-poker-hands-block'

export interface RestorePokerHandsToExeDeps {
  backupService: BackupService
  readFile: (path: string) => Promise<Buffer>
  writeFile: (path: string, data: Buffer) => Promise<void>
}

/**
 * Restaura só as mãos de pôquer pro estado do backup — mesmo espírito de restoreDecksToExe
 * (electron/deck-config), mas pro bloco de mãos: não toca em nenhuma outra customização que
 * exista fora dele (ex.: baralhos).
 */
export async function restorePokerHandsToExe(
  exePath: string,
  deps: RestorePokerHandsToExeDeps,
): Promise<void> {
  const backupGameLua = await deps.backupService.getBackup(exePath)
  const currentExe = await deps.readFile(exePath)
  const currentGameLua = extractGameLua(currentExe)

  const originalHands = parsePokerHandsBlock(backupGameLua)
  const restoredGameLua = serializePokerHandsBlock(currentGameLua, originalHands)
  const restoredExe = updateGameLuaInExe(currentExe, restoredGameLua)
  await writeExeToDisk(exePath, restoredExe, deps.writeFile)
}
