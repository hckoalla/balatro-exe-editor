import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { createBackupService, type BackupStore } from '../backup/backup-service'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { parseDeckBlock } from './parse-deck-block'
import { registerSaveDeckHandlers } from './register-save-deck-handlers'

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

describe('registerSaveDeckHandlers', () => {
  it('saves the edited deck to the exe via IPC', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    let writtenBuffer: Buffer | null = null
    const backupService = createBackupService(createFakeStore())
    const { ipcMain, invoke } = createFakeIpcMain()
    registerSaveDeckHandlers(ipcMain, {
      readFile: async () => originalExe,
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
      backupService,
    })

    const bravo = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    bravo.config = { dollars: 500 }

    await invoke(IPC_CHANNELS.saveDeck, 'C:/games/balatro.exe', bravo)

    const savedDecks = parseDeckBlock(extractGameLua(writtenBuffer!))
    expect(savedDecks.find((d) => d.id === 'deck_bravo')!.config).toEqual({ dollars: 500 })
  })

  it('saves multiple edited decks to the exe via IPC in one go', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    let writtenBuffer: Buffer | null = null
    const backupService = createBackupService(createFakeStore())
    const { ipcMain, invoke } = createFakeIpcMain()
    registerSaveDeckHandlers(ipcMain, {
      readFile: async () => originalExe,
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
      backupService,
    })

    const parsed = parseDeckBlock(FIXTURE_GAME_LUA)
    const bravo = parsed.find((d) => d.id === 'deck_bravo')!
    const charlie = parsed.find((d) => d.id === 'deck_charlie')!
    bravo.config = { dollars: 500 }
    charlie.config = { dollars: 500 }

    await invoke(IPC_CHANNELS.saveDecksBatch, 'C:/games/balatro.exe', [bravo, charlie])

    const savedDecks = parseDeckBlock(extractGameLua(writtenBuffer!))
    expect(savedDecks.find((d) => d.id === 'deck_bravo')!.config).toEqual({ dollars: 500 })
    expect(savedDecks.find((d) => d.id === 'deck_charlie')!.config).toEqual({ dollars: 500 })
  })
})
