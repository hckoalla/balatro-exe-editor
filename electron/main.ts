import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'node:path'
import { registerAppHandlers } from './ipc/register-app-handlers'
import { createElectronSettingsStore } from './settings/electron-store-adapter'
import { createSettingsService } from './settings/settings-service'
import { registerSettingsHandlers } from './settings/register-settings-handlers'

const DIST = path.join(__dirname, '../dist')
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(DIST, 'index.html'))
  }
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  const settingsService = createSettingsService(createElectronSettingsStore())
  registerAppHandlers(ipcMain, app)
  registerSettingsHandlers(ipcMain, settingsService)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
