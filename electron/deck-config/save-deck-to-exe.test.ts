import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { createBackupService, type BackupStore } from '../backup/backup-service'
import { parseDeckBlock } from './parse-deck-block'
import { saveDeckToExe, saveDecksToExe } from './save-deck-to-exe'

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

  it('reports possiblyPreEdited when the pre-edit file already deviates from known defaults', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const backupService = createBackupService(createFakeStore())
    const bravo = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    bravo.config = { dollars: 500 }

    const result = await saveDeckToExe('C:/games/balatro.exe', bravo, {
      readFile: async () => originalExe,
      writeFile: async () => {},
      backupService,
      // deck_bravo já vem com dollars:10 na fixture, mas o "default conhecido" aqui diz {} —
      // simula um baralho que já tinha sido editado antes do primeiro backup.
      knownDefaults: { deck_alpha: {}, deck_bravo: {} },
    })

    expect(result).toEqual({ backupCreated: true, possiblyPreEdited: true })
  })

  it('does not report possiblyPreEdited when the pre-edit file matches known defaults', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const backupService = createBackupService(createFakeStore())
    const bravo = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    bravo.config = { dollars: 500 }

    const result = await saveDeckToExe('C:/games/balatro.exe', bravo, {
      readFile: async () => originalExe,
      writeFile: async () => {},
      backupService,
      knownDefaults: { deck_alpha: {}, deck_bravo: { dollars: 10 } },
    })

    expect(result).toEqual({ backupCreated: true, possiblyPreEdited: false })
  })

  it('does not report possiblyPreEdited on a second save (backup already exists)', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const backupService = createBackupService(createFakeStore())
    const bravo = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    const deps = {
      readFile: async () => originalExe,
      writeFile: async () => {},
      backupService,
      knownDefaults: { deck_alpha: {}, deck_bravo: {} },
    }

    bravo.config = { dollars: 100 }
    await saveDeckToExe('C:/games/balatro.exe', bravo, deps)

    bravo.config = { dollars: 200 }
    const result = await saveDeckToExe('C:/games/balatro.exe', bravo, deps)

    expect(result).toEqual({ backupCreated: false, possiblyPreEdited: false })
  })
})

describe('saveDecksToExe', () => {
  it('writes multiple decks in a single pass, leaving decks not in the list untouched', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    let writtenBuffer: Buffer | null = null
    const backupService = createBackupService(createFakeStore())

    const parsed = parseDeckBlock(FIXTURE_GAME_LUA)
    const bravo = parsed.find((d) => d.id === 'deck_bravo')!
    const charlie = parsed.find((d) => d.id === 'deck_charlie')!
    bravo.config = { dollars: 50 }
    charlie.config = { dollars: 50 }

    await saveDecksToExe('C:/games/balatro.exe', [bravo, charlie], {
      readFile: async () => originalExe,
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
      backupService,
    })

    const savedDecks = parseDeckBlock(extractGameLua(writtenBuffer!))
    expect(savedDecks.find((d) => d.id === 'deck_bravo')!.config).toEqual({ dollars: 50 })
    expect(savedDecks.find((d) => d.id === 'deck_charlie')!.config).toEqual({ dollars: 50 })
    // baralho fora da lista permanece intacto
    expect(savedDecks.find((d) => d.id === 'deck_alpha')!.config).toEqual({})
  })

  it('creates only one backup for a batch write covering several decks', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const backupService = createBackupService(createFakeStore())
    const parsed = parseDeckBlock(FIXTURE_GAME_LUA)
    const bravo = parsed.find((d) => d.id === 'deck_bravo')!
    const charlie = parsed.find((d) => d.id === 'deck_charlie')!
    bravo.config = { dollars: 50 }
    charlie.config = { dollars: 50 }

    const result = await saveDecksToExe('C:/games/balatro.exe', [bravo, charlie], {
      readFile: async () => originalExe,
      writeFile: async () => {},
      backupService,
    })

    expect(result.backupCreated).toBe(true)
    expect(await backupService.getBackup('C:/games/balatro.exe')).toBe(FIXTURE_GAME_LUA)
  })
})
