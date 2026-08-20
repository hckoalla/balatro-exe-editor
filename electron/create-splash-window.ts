import { BrowserWindow } from 'electron'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
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

  // `readFileSync` síncrono é aceitável aqui — roda uma vez, antes de qualquer coisa aparecer na
  // tela, e o arquivo é pequeno (ver bee2-aplicar-logo-banner).
  const logoBase64 = readFileSync(join(__dirname, '../logo/logo_v1.png')).toString('base64')
  const html = buildSplashHtml(logoBase64)
  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

  return splashWindow
}
