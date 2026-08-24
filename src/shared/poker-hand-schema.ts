export interface PokerHandConfig {
  s_mult: number
  s_chips: number
  l_mult: number
  l_chips: number
}

export interface ParsedPokerHand {
  name: string
  config: PokerHandConfig
}

export interface SavePokerHandsResult {
  backupCreated: boolean
}
