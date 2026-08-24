import { extractGameLua } from '../exe-engine/extract-game-lua'
import { updateGameLuaInExe } from '../exe-engine/update-game-lua-in-exe'
import { writeExeToDisk } from '../exe-engine/write-exe-to-disk'
import type { BackupService } from '../backup/backup-service'
import { parseDeckBlock } from './parse-deck-block'
import { serializeDeckBlock } from './serialize-deck-block'

export interface RestoreDecksToExeDeps {
  backupService: BackupService
  readFile: (path: string) => Promise<Buffer>
  writeFile: (path: string, data: Buffer) => Promise<void>
}

/**
 * Restaura só os baralhos pro estado do backup — extrai a config original de cada baralho do
 * backup e regrava só as linhas de baralho no `game.lua` ATUAL, sem tocar em nenhuma outra
 * customização que exista fora do bloco de baralhos (ex.: níveis de mão de pôquer).
 */
export async function restoreDecksToExe(
  exePath: string,
  deps: RestoreDecksToExeDeps,
): Promise<void> {
  const backupGameLua = await deps.backupService.getBackup(exePath)
  const currentExe = await deps.readFile(exePath)
  const currentGameLua = extractGameLua(currentExe)

  const originalDecks = parseDeckBlock(backupGameLua)
  const restoredGameLua = serializeDeckBlock(currentGameLua, originalDecks)
  const restoredExe = updateGameLuaInExe(currentExe, restoredGameLua)
  await writeExeToDisk(exePath, restoredExe, deps.writeFile)
}
