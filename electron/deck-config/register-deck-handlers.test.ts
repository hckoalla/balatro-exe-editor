import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { registerDeckHandlers } from './register-deck-handlers'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('registerDeckHandlers', () => {
  it('resolves the parsed decks for the given exe path', async () => {
    const exe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const { ipcMain, invoke } = createFakeIpcMain()
    registerDeckHandlers(ipcMain, { readFile: async () => exe })

    const decks = await invoke(IPC_CHANNELS.getDecks, 'C:/fake/balatro.exe')

    expect(decks).toHaveLength(16)
  })
})
