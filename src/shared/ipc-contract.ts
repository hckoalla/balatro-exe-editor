// Contrato de IPC compartilhado entre main (electron/) e renderer (src/) — única fonte de
// verdade pros nomes de canal e pros tipos de payload/retorno, pra main e preload nunca
// divergirem silenciosamente.

import type { AppSettings } from './settings-schema'

export const IPC_CHANNELS = {
  getAppVersion: 'app:get-version',
  getSettings: 'settings:get',
  updateSettings: 'settings:update',
} as const

export interface BalatroApi {
  getAppVersion: () => Promise<string>
  getSettings: () => Promise<AppSettings>
  updateSettings: (partial: Partial<AppSettings>) => Promise<AppSettings>
}
