import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import type { IpcMainLike } from '../ipc/ipc-main-like'
import { restoreDecksToExe } from '../deck-config/restore-decks-to-exe'
import { restorePokerHandsToExe } from '../poker-hand-config/restore-poker-hands-to-exe'
import type { BackupService } from './backup-service'
import { restoreDefaultExe } from './restore-default-exe'

export interface BackupHandlersDeps {
  backupService: BackupService
  readFile: (path: string) => Promise<Buffer>
  writeFile: (path: string, data: Buffer) => Promise<void>
}

export function registerBackupHandlers(ipcMain: IpcMainLike, deps: BackupHandlersDeps) {
  ipcMain.handle(IPC_CHANNELS.hasBackup, (_event, exePath: string) =>
    deps.backupService.hasBackup(exePath),
  )

  ipcMain.handle(IPC_CHANNELS.restoreDefault, (_event, exePath: string) =>
    restoreDefaultExe(exePath, deps),
  )

  ipcMain.handle(IPC_CHANNELS.restoreDecksDefault, (_event, exePath: string) =>
    restoreDecksToExe(exePath, deps),
  )

  ipcMain.handle(IPC_CHANNELS.restorePokerHandsDefault, (_event, exePath: string) =>
    restorePokerHandsToExe(exePath, deps),
  )
}
