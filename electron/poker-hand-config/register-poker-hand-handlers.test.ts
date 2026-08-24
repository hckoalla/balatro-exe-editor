import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { registerPokerHandHandlers } from './register-poker-hand-handlers'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('registerPokerHandHandlers', () => {
  it('returns the parsed poker hands via IPC', async () => {
    const exe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const { ipcMain, invoke } = createFakeIpcMain()
    registerPokerHandHandlers(ipcMain, { readFile: async () => exe })

    const hands = await invoke(IPC_CHANNELS.getPokerHands, 'C:/games/balatro.exe')

    expect(hands).toHaveLength(3)
  })
})
