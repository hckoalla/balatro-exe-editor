// Contrato de IPC compartilhado entre main (electron/) e renderer (src/) — única fonte de
// verdade pros nomes de canal e pros tipos de payload/retorno, pra main e preload nunca
// divergirem silenciosamente.

import type { AppSettings } from './settings-schema'
import type { ParsedDeck, SaveDeckResult } from './deck-schema'
import type { ConsumableCatalogEntry } from './consumable-catalog-schema'
import type { ParsedPokerHand, SavePokerHandsResult } from './poker-hand-schema'

export const IPC_CHANNELS = {
  getAppVersion: 'app:get-version',
  getSettings: 'settings:get',
  updateSettings: 'settings:update',
  selectExeFile: 'exe:select-file',
  validateExeFile: 'exe:validate-file',
  detectExeViaSteam: 'exe:detect-steam',
  getDecks: 'deck:get-all',
  getConsumableCatalog: 'consumable-catalog:get-all',
  getConsumableAtlas: 'consumable-catalog:get-atlas',
  getConsumableDescriptions: 'consumable-catalog:get-descriptions',
  hasBackup: 'backup:has',
  restoreDefault: 'backup:restore',
  restoreDecksDefault: 'backup:restore-decks',
  restorePokerHandsDefault: 'backup:restore-poker-hands',
  saveDeck: 'deck:save',
  saveDecksBatch: 'deck:save-batch',
  getPokerHands: 'poker-hand:get-all',
  savePokerHands: 'poker-hand:save-batch',
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
  detectExeViaSteam: () => Promise<string | null>
  getDecks: (filePath: string) => Promise<ParsedDeck[]>
  getConsumableCatalog: (filePath: string) => Promise<ConsumableCatalogEntry[]>
  getConsumableAtlas: (filePath: string) => Promise<string | null>
  getConsumableDescriptions: (
    filePath: string,
    language: string,
  ) => Promise<Record<string, string> | null>
  hasBackup: (filePath: string) => Promise<boolean>
  restoreDefault: (filePath: string) => Promise<void>
  restoreDecksDefault: (filePath: string) => Promise<void>
  restorePokerHandsDefault: (filePath: string) => Promise<void>
  saveDeck: (filePath: string, deck: ParsedDeck) => Promise<SaveDeckResult>
  saveDecksBatch: (filePath: string, decks: ParsedDeck[]) => Promise<SaveDeckResult>
  getPokerHands: (filePath: string) => Promise<ParsedPokerHand[]>
  savePokerHands: (filePath: string, hands: ParsedPokerHand[]) => Promise<SavePokerHandsResult>
}
