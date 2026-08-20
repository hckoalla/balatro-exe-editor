import { describe, expect, it } from 'vitest'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { getConsumableAtlasFromExe } from './get-consumable-atlas-from-exe'

describe('getConsumableAtlasFromExe', () => {
  it('reads the exe and returns the consumable atlas as a data URL', async () => {
    const exe = buildSyntheticBalatroExe('return {}', {
      'resources/textures/1x/Tarots.png': 'fake-atlas-bytes',
    })

    const atlas = await getConsumableAtlasFromExe('C:/fake/balatro.exe', async () => exe)

    const expectedBase64 = Buffer.from('fake-atlas-bytes', 'utf-8').toString('base64')
    expect(atlas).toBe(`data:image/png;base64,${expectedBase64}`)
  })

  it('resolves to null (not throw) when the atlas is missing from the exe', async () => {
    const exe = buildSyntheticBalatroExe('return {}')

    const atlas = await getConsumableAtlasFromExe('C:/fake/balatro.exe', async () => exe)

    expect(atlas).toBeNull()
  })
})
