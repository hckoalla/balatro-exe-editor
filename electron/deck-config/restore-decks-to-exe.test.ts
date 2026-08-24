import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { createBackupService, type BackupStore } from '../backup/backup-service'
import { parseDeckBlock } from './parse-deck-block'
import { serializeDeckBlock } from './serialize-deck-block'
import { restoreDecksToExe } from './restore-decks-to-exe'

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

describe('restoreDecksToExe', () => {
  it('restores every deck to its backed-up config, without touching poker hand edits', async () => {
    const backupService = createBackupService(createFakeStore())
    await backupService.ensureBackup('C:/games/balatro.exe', FIXTURE_GAME_LUA)

    // Simula o estado atual: baralho editado E mão de pôquer editada.
    const editedDeck = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    editedDeck.config = { dollars: 999 }
    let currentGameLua = serializeDeckBlock(FIXTURE_GAME_LUA, [editedDeck])
    currentGameLua = currentGameLua.replace(
      /\["Fixture Hand One"\] =\s*\{[^}]*s_mult\s*=\s*8/,
      (match) => match.replace('s_mult = 8', 's_mult = 500'),
    )
    const currentExe = buildSyntheticBalatroExe(currentGameLua)
    let writtenBuffer: Buffer | null = null

    await restoreDecksToExe('C:/games/balatro.exe', {
      backupService,
      readFile: async () => currentExe,
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
    })

    const restoredGameLua = extractGameLua(writtenBuffer!)
    const restoredDecks = parseDeckBlock(restoredGameLua)
    expect(restoredDecks.find((d) => d.id === 'deck_bravo')!.config).toEqual({ dollars: 10 })
    // mão de pôquer editada continua intacta -- restaurar baralhos não mexe nela
    expect(restoredGameLua).toContain('s_mult = 500')
  })
})
