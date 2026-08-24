import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { createBackupService, type BackupStore } from '../backup/backup-service'
import { parseDeckBlock } from '../deck-config/parse-deck-block'
import { serializeDeckBlock } from '../deck-config/serialize-deck-block'
import { parsePokerHandsBlock } from './parse-poker-hands-block'
import { serializePokerHandsBlock } from './serialize-poker-hands-block'
import { restorePokerHandsToExe } from './restore-poker-hands-to-exe'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

function createFakeStore(): BackupStore {
  const data = new Map<string, string>()
  return {
    has: async (key) => data.has(key),
    write: async (key, content) => {
      data.set(key, content)
    },
    read: async (key) => {
      const value = data.get(key)
      if (value === undefined) throw new Error(`No value for "${key}"`)
      return value
    },
  }
}

describe('restorePokerHandsToExe', () => {
  it('restores every hand to its backed-up config, without touching deck edits', async () => {
    const backupService = createBackupService(createFakeStore())
    await backupService.ensureBackup('C:/games/balatro.exe', FIXTURE_GAME_LUA)

    // Simula o estado atual: mão de pôquer editada E baralho editado.
    const editedHand = { name: 'Fixture Hand One', config: { s_mult: 500, s_chips: 40, l_mult: 2, l_chips: 10 } }
    let currentGameLua = serializePokerHandsBlock(FIXTURE_GAME_LUA, [editedHand])
    const editedDeck = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    editedDeck.config = { dollars: 999 }
    currentGameLua = serializeDeckBlock(currentGameLua, [editedDeck])
    const currentExe = buildSyntheticBalatroExe(currentGameLua)
    let writtenBuffer: Buffer | null = null

    await restorePokerHandsToExe('C:/games/balatro.exe', {
      backupService,
      readFile: async () => currentExe,
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
    })

    const restoredGameLua = extractGameLua(writtenBuffer!)
    const restoredHands = parsePokerHandsBlock(restoredGameLua)
    expect(restoredHands.find((h) => h.name === 'Fixture Hand One')!.config).toEqual({
      s_mult: 8,
      s_chips: 40,
      l_mult: 2,
      l_chips: 10,
    })
    // baralho editado continua intacto -- restaurar mãos não mexe nele
    expect(parseDeckBlock(restoredGameLua).find((d) => d.id === 'deck_bravo')!.config).toEqual({
      dollars: 999,
    })
  })
})
