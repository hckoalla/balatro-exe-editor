import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import type { IpcMainLike } from '../ipc/ipc-main-like'
import { getDecksFromExe } from './get-decks-from-exe'

export interface DeckHandlersDeps {
  readFile: (path: string) => Promise<Buffer>
}

export function registerDeckHandlers(ipcMain: IpcMainLike, deps: DeckHandlersDeps) {
  ipcMain.handle(IPC_CHANNELS.getDecks, (_event, exePath: string) =>
    getDecksFromExe(exePath, deps.readFile),
  )
}
