import type { ParsedDeck } from '../../src/shared/deck-schema'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import type { IpcMainLike } from '../ipc/ipc-main-like'
import { saveDeckToExe, type SaveDeckToExeDeps } from './save-deck-to-exe'

export function registerSaveDeckHandlers(ipcMain: IpcMainLike, deps: SaveDeckToExeDeps) {
  ipcMain.handle(IPC_CHANNELS.saveDeck, (_event, exePath: string, deck: ParsedDeck) =>
    saveDeckToExe(exePath, deck, deps),
  )
}
