import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import type { IpcMainLike } from '../ipc/ipc-main-like'
import { getPokerHandsFromExe } from './get-poker-hands-from-exe'

export interface PokerHandHandlersDeps {
  readFile: (path: string) => Promise<Buffer>
}

export function registerPokerHandHandlers(ipcMain: IpcMainLike, deps: PokerHandHandlersDeps) {
  ipcMain.handle(IPC_CHANNELS.getPokerHands, (_event, exePath: string) =>
    getPokerHandsFromExe(exePath, deps.readFile),
  )
}
