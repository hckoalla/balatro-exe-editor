import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import type { AppSettings } from '../../src/shared/settings-schema'
import type { IpcMainLike } from '../ipc/ipc-main-like'
import type { SettingsService } from './settings-service'

export function registerSettingsHandlers(ipcMain: IpcMainLike, settingsService: SettingsService) {
  ipcMain.handle(IPC_CHANNELS.getSettings, () => settingsService.getSettings())
  ipcMain.handle(IPC_CHANNELS.updateSettings, (_event, partial: Partial<AppSettings>) =>
    settingsService.updateSettings(partial),
  )
}
