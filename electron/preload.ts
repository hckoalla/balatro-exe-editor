import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, type BalatroApi } from '../src/shared/ipc-contract'

const api: BalatroApi = {
  getAppVersion: () => ipcRenderer.invoke(IPC_CHANNELS.getAppVersion),
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.getSettings),
  updateSettings: (partial) => ipcRenderer.invoke(IPC_CHANNELS.updateSettings, partial),
}

contextBridge.exposeInMainWorld('balatro', api)
