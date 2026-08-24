import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, type BalatroApi } from '../src/shared/ipc-contract'

const api: BalatroApi = {
  getAppVersion: () => ipcRenderer.invoke(IPC_CHANNELS.getAppVersion),
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.getSettings),
  updateSettings: (partial) => ipcRenderer.invoke(IPC_CHANNELS.updateSettings, partial),
  selectExeFile: () => ipcRenderer.invoke(IPC_CHANNELS.selectExeFile),
  validateExeFile: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.validateExeFile, filePath),
  detectExeViaSteam: () => ipcRenderer.invoke(IPC_CHANNELS.detectExeViaSteam),
  getDecks: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.getDecks, filePath),
  getConsumableCatalog: (filePath) =>
    ipcRenderer.invoke(IPC_CHANNELS.getConsumableCatalog, filePath),
  getConsumableAtlas: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.getConsumableAtlas, filePath),
  getConsumableDescriptions: (filePath, language) =>
    ipcRenderer.invoke(IPC_CHANNELS.getConsumableDescriptions, filePath, language),
  hasBackup: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.hasBackup, filePath),
  restoreDefault: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.restoreDefault, filePath),
  saveDeck: (filePath, deck) => ipcRenderer.invoke(IPC_CHANNELS.saveDeck, filePath, deck),
  saveDecksBatch: (filePath, decks) =>
    ipcRenderer.invoke(IPC_CHANNELS.saveDecksBatch, filePath, decks),
  getPokerHands: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.getPokerHands, filePath),
  savePokerHands: (filePath, hands) =>
    ipcRenderer.invoke(IPC_CHANNELS.savePokerHands, filePath, hands),
}

contextBridge.exposeInMainWorld('balatro', api)
