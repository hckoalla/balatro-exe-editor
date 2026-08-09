import { updateGameLuaInExe } from '../exe-engine/update-game-lua-in-exe'
import { writeExeToDisk } from '../exe-engine/write-exe-to-disk'
import type { BackupService } from './backup-service'

export interface RestoreDefaultExeDeps {
  backupService: BackupService
  readFile: (path: string) => Promise<Buffer>
  writeFile: (path: string, data: Buffer) => Promise<void>
}

/**
 * Reinjeta o `game.lua` do backup de volta no `.exe`, desfazendo todas as customizações atuais
 * de uma vez. Propaga o erro de `backupService.getBackup` (sem backup) e o `FileInUseError` de
 * `writeExeToDisk` (arquivo travado) sem tratamento especial — quem chama decide a mensagem.
 */
export async function restoreDefaultExe(
  exePath: string,
  deps: RestoreDefaultExeDeps,
): Promise<void> {
  const backupGameLua = await deps.backupService.getBackup(exePath)
  const currentExe = await deps.readFile(exePath)
  const restoredExe = updateGameLuaInExe(currentExe, backupGameLua)
  await writeExeToDisk(exePath, restoredExe, deps.writeFile)
}
