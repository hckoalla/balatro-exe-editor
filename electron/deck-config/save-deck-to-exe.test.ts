import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { createBackupService, type BackupStore } from '../backup/backup-service'
import { parseDeckBlock } from './parse-deck-block'
import { saveDeckToExe } from './save-deck-to-exe'

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

describe('saveDeckToExe', () => {
  it('writes the edited deck config into the exe on disk', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    let writtenBuffer: Buffer | null = null
    const backupService = createBackupService(createFakeStore())

    const bravo = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    bravo.config = { dollars: 999 }

    await saveDeckToExe('C:/games/balatro.exe', bravo, {
      readFile: async () => originalExe,
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
      backupService,
    })

    expect(writtenBuffer).not.toBeNull()
    const savedDecks = parseDeckBlock(extractGameLua(writtenBuffer!))
    expect(savedDecks.find((d) => d.id === 'deck_bravo')!.config).toEqual({ dollars: 999 })
    // outros baralhos intactos
    expect(savedDecks.find((d) => d.id === 'deck_alpha')!.config).toEqual({})
  })

  it('creates a backup of the pre-edit game.lua on the first save', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const backupService = createBackupService(createFakeStore())
    const bravo = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    bravo.config = { dollars: 999 }

    await saveDeckToExe('C:/games/balatro.exe', bravo, {
      readFile: async () => originalExe,
      writeFile: async () => {},
      backupService,
    })

    expect(await backupService.hasBackup('C:/games/balatro.exe')).toBe(true)
    expect(await backupService.getBackup('C:/games/balatro.exe')).toBe(FIXTURE_GAME_LUA)
  })

  it('does not overwrite the backup on a second save', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const backupService = createBackupService(createFakeStore())
    const bravo = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!

    bravo.config = { dollars: 111 }
    let lastWritten = originalExe
    await saveDeckToExe('C:/games/balatro.exe', bravo, {
      readFile: async () => lastWritten,
      writeFile: async (_p, data) => {
        lastWritten = data
      },
      backupService,
    })

    bravo.config = { dollars: 222 }
    await saveDeckToExe('C:/games/balatro.exe', bravo, {
      readFile: async () => lastWritten,
      writeFile: async (_p, data) => {
        lastWritten = data
      },
      backupService,
    })

    expect(await backupService.getBackup('C:/games/balatro.exe')).toBe(FIXTURE_GAME_LUA)
  })
})
