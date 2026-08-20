import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron'
import path from 'node:path'
import { access, readFile, writeFile } from 'node:fs/promises'
import { registerAppHandlers } from './ipc/register-app-handlers'
import { createElectronSettingsStore } from './settings/electron-store-adapter'
import { createSettingsService } from './settings/settings-service'
import { registerSettingsHandlers } from './settings/register-settings-handlers'
import { registerExeHandlers } from './exe-engine/register-exe-handlers'
import { registerDeckHandlers } from './deck-config/register-deck-handlers'
import { registerConsumableCatalogHandlers } from './consumable-catalog/register-consumable-catalog-handlers'
import { createBackupService } from './backup/backup-service'
import { createFileBackupStore } from './backup/file-backup-store'
import { registerBackupHandlers } from './backup/register-backup-handlers'
import { registerSaveDeckHandlers } from './deck-config/register-save-deck-handlers'
import { buildWindowTitle } from './build-window-title'
import { createSplashWindow } from './create-splash-window'
import { detectBalatroViaSteam } from './steam-detection/detect-balatro-via-steam'
import { getSteamPathFromRegistry } from './steam-detection/get-steam-path-from-registry'

const DIST = path.join(__dirname, '../dist')
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

let mainWindow: BrowserWindow | null = null
let splashWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    title: buildWindowTitle(app.getVersion()),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Sem isso, o Electron troca o título de volta pro <title> do index.html assim que a página
  // termina de carregar — a opção `title` acima só vale antes disso.
  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
  })

  // A janela só aparece quando o conteúdo já está pronto pra pintar — até lá, quem o usuário vê
  // é a splash (ver bee1-splash-nativa). Sem isso, apareceria uma janela vazia por um instante.
  mainWindow.once('ready-to-show', () => {
    splashWindow?.close()
    splashWindow = null
    mainWindow?.show()
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(DIST, 'index.html'))
  }
}

app.whenReady().then(() => {
  splashWindow = createSplashWindow()
  Menu.setApplicationMenu(null)
  const settingsService = createSettingsService(createElectronSettingsStore())
  registerAppHandlers(ipcMain, app)
  registerSettingsHandlers(ipcMain, settingsService)
  registerExeHandlers(ipcMain, {
    showOpenDialog: async () => {
      if (!mainWindow) {
        return { canceled: true, filePaths: [] }
      }
      return dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Balatro executable', extensions: ['exe'] }],
      })
    },
    readFile: (filePath) => readFile(filePath),
    detectExeViaSteam: () =>
      detectBalatroViaSteam({
        getSteamPath: getSteamPathFromRegistry,
        readFile: (filePath) => readFile(filePath, 'utf-8'),
        fileExists: (filePath) =>
          access(filePath)
            .then(() => true)
            .catch(() => false),
      }),
  })
  registerDeckHandlers(ipcMain, { readFile: (filePath) => readFile(filePath) })
  registerConsumableCatalogHandlers(ipcMain, { readFile: (filePath) => readFile(filePath) })
  const backupService = createBackupService(
    createFileBackupStore(path.join(app.getPath('userData'), 'backups')),
  )
  registerBackupHandlers(ipcMain, {
    backupService,
    readFile: (filePath) => readFile(filePath),
    writeFile: (filePath, data) => writeFile(filePath, data),
  })
  registerSaveDeckHandlers(ipcMain, {
    backupService,
    readFile: (filePath) => readFile(filePath),
    writeFile: (filePath, data) => writeFile(filePath, data),
  })
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
