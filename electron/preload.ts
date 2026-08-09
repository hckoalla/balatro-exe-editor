import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, type BalatroApi } from '../src/shared/ipc-contract'

const api: BalatroApi = {
  getAppVersion: () => ipcRenderer.invoke(IPC_CHANNELS.getAppVersion),
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.getSettings),
  updateSettings: (partial) => ipcRenderer.invoke(IPC_CHANNELS.updateSettings, partial),
  selectExeFile: () => ipcRenderer.invoke(IPC_CHANNELS.selectExeFile),
  validateExeFile: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.validateExeFile, filePath),
  getDecks: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.getDecks, filePath),
  getConsumableCatalog: (filePath) =>
    ipcRenderer.invoke(IPC_CHANNELS.getConsumableCatalog, filePath),
  hasBackup: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.hasBackup, filePath),
  restoreDefault: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.restoreDefault, filePath),
  saveDeck: (filePath, deck) => ipcRenderer.invoke(IPC_CHANNELS.saveDeck, filePath, deck),
}

contextBridge.exposeInMainWorld('balatro', api)
