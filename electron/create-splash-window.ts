import { BrowserWindow } from 'electron'
import { buildSplashHtml } from './build-splash-html'

/**
 * Janela splash: sem moldura, pequena, sempre no topo — abre instantaneamente via `data:` URL
 * (não depende do Vite dev server nem do bundle React). Quem fecha essa janela é o chamador,
 * no momento em que a janela principal estiver pronta pra aparecer (ver `main.ts`).
 */
export function createSplashWindow(): BrowserWindow {
  const splashWindow = new BrowserWindow({
    width: 320,
    height: 200,
    frame: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: { contextIsolation: true },
  })

  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(buildSplashHtml())}`)

  return splashWindow
}
