import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { extractGameLua } from '../exe-engine/extract-game-lua'
import { createBackupService, type BackupStore } from '../backup/backup-service'
import { parsePokerHandsBlock } from './parse-poker-hands-block'
import { savePokerHandsToExe } from './save-poker-hands-to-exe'

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

describe('savePokerHandsToExe', () => {
  it('writes the edited hands into the exe on disk', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    let writtenBuffer: Buffer | null = null
    const backupService = createBackupService(createFakeStore())

    const edited = { name: 'Fixture Hand One', config: { s_mult: 99, s_chips: 88, l_mult: 7, l_chips: 6 } }

    await savePokerHandsToExe('C:/games/balatro.exe', [edited], {
      readFile: async () => originalExe,
      writeFile: async (_path, data) => {
        writtenBuffer = data
      },
      backupService,
    })

    expect(writtenBuffer).not.toBeNull()
    const savedHands = parsePokerHandsBlock(extractGameLua(writtenBuffer!))
    expect(savedHands.find((h) => h.name === 'Fixture Hand One')!.config).toEqual({
      s_mult: 99,
      s_chips: 88,
      l_mult: 7,
      l_chips: 6,
    })
    // outras mãos intactas
    expect(savedHands.find((h) => h.name === 'Fixture Hand Two')!.config).toEqual({
      s_mult: 4,
      s_chips: 20,
      l_mult: 1,
      l_chips: 5,
    })
  })

  it('creates a backup of the pre-edit game.lua on the first save', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const backupService = createBackupService(createFakeStore())
    const edited = { name: 'Fixture Hand One', config: { s_mult: 99, s_chips: 88, l_mult: 7, l_chips: 6 } }

    const result = await savePokerHandsToExe('C:/games/balatro.exe', [edited], {
      readFile: async () => originalExe,
      writeFile: async () => {},
      backupService,
    })

    expect(result).toEqual({ backupCreated: true })
    expect(await backupService.hasBackup('C:/games/balatro.exe')).toBe(true)
    expect(await backupService.getBackup('C:/games/balatro.exe')).toBe(FIXTURE_GAME_LUA)
  })

  it('does not overwrite the backup on a second save', async () => {
    const originalExe = buildSyntheticBalatroExe(FIXTURE_GAME_LUA)
    const backupService = createBackupService(createFakeStore())
    let lastWritten = originalExe

    await savePokerHandsToExe(
      'C:/games/balatro.exe',
      [{ name: 'Fixture Hand One', config: { s_mult: 1, s_chips: 1, l_mult: 1, l_chips: 1 } }],
      {
        readFile: async () => lastWritten,
        writeFile: async (_p, data) => {
          lastWritten = data
        },
        backupService,
      },
    )

    const result = await savePokerHandsToExe(
      'C:/games/balatro.exe',
      [{ name: 'Fixture Hand One', config: { s_mult: 2, s_chips: 2, l_mult: 2, l_chips: 2 } }],
      {
        readFile: async () => lastWritten,
        writeFile: async (_p, data) => {
          lastWritten = data
        },
        backupService,
      },
    )

    expect(result).toEqual({ backupCreated: false })
    expect(await backupService.getBackup('C:/games/balatro.exe')).toBe(FIXTURE_GAME_LUA)
  })
})
