import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { parseDeckBlock } from '../deck-config/parse-deck-block'
import { serializeDeckBlock } from '../deck-config/serialize-deck-block'
import { parsePokerHandsBlock } from '../poker-hand-config/parse-poker-hands-block'
import { serializePokerHandsBlock } from '../poker-hand-config/serialize-poker-hands-block'
import { createBackupService, type BackupStore } from './backup-service'
import { registerBackupHandlers } from './register-backup-handlers'

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

describe('registerBackupHandlers', () => {
  it('resolves hasBackup as false, then true after a backup is created', async () => {
    const backupService = createBackupService(createFakeStore())
    const { ipcMain, invoke } = createFakeIpcMain()
    registerBackupHandlers(ipcMain, {
      backupService,
      readFile: async () => buildSyntheticBalatroExe('return {}'),
      writeFile: async () => {},
    })

    expect(await invoke(IPC_CHANNELS.hasBackup, 'C:/games/balatro.exe')).toBe(false)
    await backupService.ensureBackup('C:/games/balatro.exe', 'return { original = true }')
    expect(await invoke(IPC_CHANNELS.hasBackup, 'C:/games/balatro.exe')).toBe(true)
  })

  it('restores the default game.lua via restoreDefault', async () => {
    const backupService = createBackupService(createFakeStore())
    await backupService.ensureBackup('C:/games/balatro.exe', 'return { original = true }')
    let writtenBuffer: Buffer | null = null

    const { ipcMain, invoke } = createFakeIpcMain()
    registerBackupHandlers(ipcMain, {
      backupService,
      readFile: async () => buildSyntheticBalatroExe('return { edited = true }'),
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
    })

    await invoke(IPC_CHANNELS.restoreDefault, 'C:/games/balatro.exe')

    expect(extractGameLua(writtenBuffer!)).toBe('return { original = true }')
  })

  it('restores only the decks via restoreDecksDefault, leaving poker hand edits intact', async () => {
    const backupService = createBackupService(createFakeStore())
    await backupService.ensureBackup('C:/games/balatro.exe', FIXTURE_GAME_LUA)

    const editedHand = {
      name: 'Fixture Hand One',
      config: { s_mult: 500, s_chips: 40, l_mult: 2, l_chips: 10 },
    }
    const editedDeck = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    editedDeck.config = { dollars: 999 }
    let currentGameLua = serializePokerHandsBlock(FIXTURE_GAME_LUA, [editedHand])
    currentGameLua = serializeDeckBlock(currentGameLua, [editedDeck])
    let writtenBuffer: Buffer | null = null

    const { ipcMain, invoke } = createFakeIpcMain()
    registerBackupHandlers(ipcMain, {
      backupService,
      readFile: async () => buildSyntheticBalatroExe(currentGameLua),
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
    })

    await invoke(IPC_CHANNELS.restoreDecksDefault, 'C:/games/balatro.exe')

    const restoredGameLua = extractGameLua(writtenBuffer!)
    expect(parseDeckBlock(restoredGameLua).find((d) => d.id === 'deck_bravo')!.config).toEqual({
      dollars: 10,
    })
    expect(
      parsePokerHandsBlock(restoredGameLua).find((h) => h.name === 'Fixture Hand One')!.config,
    ).toEqual({ s_mult: 500, s_chips: 40, l_mult: 2, l_chips: 10 })
  })

  it('restores only the poker hands via restorePokerHandsDefault, leaving deck edits intact', async () => {
    const backupService = createBackupService(createFakeStore())
    await backupService.ensureBackup('C:/games/balatro.exe', FIXTURE_GAME_LUA)

    const editedHand = {
      name: 'Fixture Hand One',
      config: { s_mult: 500, s_chips: 40, l_mult: 2, l_chips: 10 },
    }
    const editedDeck = parseDeckBlock(FIXTURE_GAME_LUA).find((d) => d.id === 'deck_bravo')!
    editedDeck.config = { dollars: 999 }
    let currentGameLua = serializePokerHandsBlock(FIXTURE_GAME_LUA, [editedHand])
    currentGameLua = serializeDeckBlock(currentGameLua, [editedDeck])
    let writtenBuffer: Buffer | null = null

    const { ipcMain, invoke } = createFakeIpcMain()
    registerBackupHandlers(ipcMain, {
      backupService,
      readFile: async () => buildSyntheticBalatroExe(currentGameLua),
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
    })

    await invoke(IPC_CHANNELS.restorePokerHandsDefault, 'C:/games/balatro.exe')

    const restoredGameLua = extractGameLua(writtenBuffer!)
    expect(
      parsePokerHandsBlock(restoredGameLua).find((h) => h.name === 'Fixture Hand One')!.config,
    ).toEqual({ s_mult: 8, s_chips: 40, l_mult: 2, l_chips: 10 })
    expect(parseDeckBlock(restoredGameLua).find((d) => d.id === 'deck_bravo')!.config).toEqual({
      dollars: 999,
    })
  })
})
