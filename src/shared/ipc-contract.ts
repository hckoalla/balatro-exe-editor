// Contrato de IPC compartilhado entre main (electron/) e renderer (src/) — única fonte de
// verdade pros nomes de canal e pros tipos de payload/retorno, pra main e preload nunca
// divergirem silenciosamente.

import type { AppSettings } from './settings-schema'
import type { ParsedDeck } from './deck-schema'
import type { ConsumableCatalogEntry } from './consumable-catalog-schema'

export const IPC_CHANNELS = {
  getAppVersion: 'app:get-version',
  getSettings: 'settings:get',
  updateSettings: 'settings:update',
  selectExeFile: 'exe:select-file',
  validateExeFile: 'exe:validate-file',
  getDecks: 'deck:get-all',
  getConsumableCatalog: 'consumable-catalog:get-all',
} as const

export interface SelectExeFileResult {
  canceled: boolean
  filePath: string | null
}

export interface ValidateExeFileResult {
  valid: boolean
  reason: string | null
}

export interface BalatroApi {
  getAppVersion: () => Promise<string>
  getSettings: () => Promise<AppSettings>
  updateSettings: (partial: Partial<AppSettings>) => Promise<AppSettings>
  selectExeFile: () => Promise<SelectExeFileResult>
  validateExeFile: (filePath: string) => Promise<ValidateExeFileResult>
  getDecks: (filePath: string) => Promise<ParsedDeck[]>
  getConsumableCatalog: (filePath: string) => Promise<ConsumableCatalogEntry[]>
}
