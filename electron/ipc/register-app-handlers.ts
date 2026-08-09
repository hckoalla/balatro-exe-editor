import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import type { IpcMainLike } from './ipc-main-like'

export interface AppLike {
  getVersion(): string
}

export function registerAppHandlers(ipcMain: IpcMainLike, app: AppLike) {
  ipcMain.handle(IPC_CHANNELS.getAppVersion, () => app.getVersion())
}
