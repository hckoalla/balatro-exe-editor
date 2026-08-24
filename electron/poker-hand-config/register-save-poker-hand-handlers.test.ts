import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { createBackupService, type BackupStore } from '../backup/backup-service'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { parsePokerHandsBlock } from './parse-poker-hands-block'
import { registerSavePokerHandHandlers } from './register-save-poker-hand-handlers'

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

describe('registerSavePokerHandHandlers', () => {
  it('saves the edited hands to the exe via IPC', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    let writtenBuffer: Buffer | null = null
    const backupService = createBackupService(createFakeStore())
    const { ipcMain, invoke } = createFakeIpcMain()
    registerSavePokerHandHandlers(ipcMain, {
      readFile: async () => originalExe,
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
      backupService,
    })

    await invoke(IPC_CHANNELS.savePokerHands, 'C:/games/balatro.exe', [
      { name: 'Fixture Hand One', config: { s_mult: 99, s_chips: 88, l_mult: 7, l_chips: 6 } },
    ])

    const savedHands = parsePokerHandsBlock(extractGameLua(writtenBuffer!))
    expect(savedHands.find((h) => h.name === 'Fixture Hand One')!.config).toEqual({
      s_mult: 99,
      s_chips: 88,
      l_mult: 7,
      l_chips: 6,
    })
  })
})
