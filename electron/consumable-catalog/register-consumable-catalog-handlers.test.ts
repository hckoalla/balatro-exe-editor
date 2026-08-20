import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createFakeIpcMain } from '../../test/fixtures/fake-ipc-main'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { IPC_CHANNELS } from '../../src/shared/ipc-contract'
import { registerConsumableCatalogHandlers } from './register-consumable-catalog-handlers'

const FIXTURE_GAME_LUA = readFileSync(join(__dirname, '../../test/fixtures/game.lua'), 'utf-8')

describe('registerConsumableCatalogHandlers', () => {
  it('resolves the consumable catalog for the given exe path', async () => {
    const exe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const { ipcMain, invoke } = createFakeIpcMain()
    registerConsumableCatalogHandlers(ipcMain, { readFile: async () => exe })

    const catalog = await invoke(IPC_CHANNELS.getConsumableCatalog, 'C:/fake/balatro.exe')

    expect(catalog).toHaveLength(6)
  })

  it('resolves the consumable atlas as a data URL for the given exe path', async () => {
    const exe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA, {
      'textures/1x/Tarots.png': 'fake-atlas-bytes',
    })
    const { ipcMain, invoke } = createFakeIpcMain()
    registerConsumableCatalogHandlers(ipcMain, { readFile: async () => exe })

    const atlas = await invoke(IPC_CHANNELS.getConsumableAtlas, 'C:/fake/balatro.exe')

    expect(atlas).toBe(`data:image/png;base64,${Buffer.from('fake-atlas-bytes').toString('base64')}`)
  })
})
