export interface DeckConfig {
  dollars?: number
  hands?: number
  discards?: number
  joker_slot?: number
  consumable_slot?: number
  consumables?: string[]
}

export interface ParsedDeck {
  id: string
  name: string
  config: DeckConfig
}

export interface SaveDeckResult {
  backupCreated: boolean
  possiblyPreEdited: boolean
}
