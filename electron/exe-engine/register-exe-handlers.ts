import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import type { IpcMainLike } from '../ipc/ipc-main-like'
import { validateBalatroExe } from './validate-balatro-exe'

export interface OpenDialogResult {
  canceled: boolean
  filePaths: string[]
}

export interface ExeHandlersDeps {
  showOpenDialog: () => Promise<OpenDialogResult>
  readFile: (path: string) => Promise<Buffer>
}

export function registerExeHandlers(ipcMain: IpcMainLike, deps: ExeHandlersDeps) {
  ipcMain.handle(IPC_CHANNELS.selectExeFile, async () => {
    const result = await deps.showOpenDialog()
    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true, filePath: null }
    }
    return { canceled: false, filePath: result.filePaths[0] }
  })

  ipcMain.handle(IPC_CHANNELS.validateExeFile, (_event, filePath: string) =>
    validateBalatroExe(filePath, deps.readFile),
  )
}
