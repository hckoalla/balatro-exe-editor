import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, type BalatroApi } from '../src/shared/ipc-contract'

const api: BalatroApi = {
  getAppVersion: () => ipcRenderer.invoke(IPC_CHANNELS.getAppVersion),
}

contextBridge.exposeInMainWorld('balatro', api)
