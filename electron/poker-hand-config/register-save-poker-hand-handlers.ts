import type { ParsedPokerHand } from '../../src/shared/poker-hand-schema'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import type { IpcMainLike } from '../ipc/ipc-main-like'
import { savePokerHandsToExe, type SavePokerHandsToExeDeps } from './save-poker-hands-to-exe'

export function registerSavePokerHandHandlers(
  ipcMain: IpcMainLike,
  deps: SavePokerHandsToExeDeps,
) {
  ipcMain.handle(IPC_CHANNELS.savePokerHands, (_event, exePath: string, hands: ParsedPokerHand[]) =>
    savePokerHandsToExe(exePath, hands, deps),
  )
}
