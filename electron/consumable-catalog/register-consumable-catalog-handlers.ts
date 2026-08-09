import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import type { IpcMainLike } from '../ipc/ipc-main-like'
import { getConsumableCatalogFromExe } from './get-consumable-catalog-from-exe'

export interface ConsumableCatalogHandlersDeps {
  readFile: (path: string) => Promise<Buffer>
}

export function registerConsumableCatalogHandlers(
  ipcMain: IpcMainLike,
  deps: ConsumableCatalogHandlersDeps,
) {
  ipcMain.handle(IPC_CHANNELS.getConsumableCatalog, (_event, exePath: string) =>
    getConsumableCatalogFromExe(exePath, deps.readFile),
  )
}
