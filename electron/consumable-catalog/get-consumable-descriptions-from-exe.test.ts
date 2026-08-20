import { describe, expect, it } from 'vitest'
import { buildSyntheticBalatroExe } from '../../test/fixtures/build-synthetic-balatro-exe'
import { getConsumableDescriptionsFromExe } from './get-consumable-descriptions-from-exe'

const FIXTURE_LOCALIZATION = `
descriptions={
    Tarot={
        c_fixture_tarot_one={
            name="The Fixture Fool",
            text={
                "Creates the last",
                "{C:tarot}Tarot{} or {C:planet}Planet{} card",
            },
        },
    },
},
`

describe('getConsumableDescriptionsFromExe', () => {
  it('reads the exe, extracts the localization file for the given language, and returns clean joined descriptions', async () => {
    const exe = buildSyntheticBalatroExe('return {}', {
      'localization/en-us.lua': FIXTURE_LOCALIZATION,
    })

    const descriptions = await getConsumableDescriptionsFromExe(
      'C:/fake/balatro.exe',
      'en',
      async () => exe,
    )

    expect(descriptions).toEqual({
      c_fixture_tarot_one: 'Creates the last Tarot or Planet card',
    })
  })

  it('maps app language codes to the right localization file', async () => {
    const exe = buildSyntheticBalatroExe('return {}', {
      'localization/pt_BR.lua': FIXTURE_LOCALIZATION,
    })

    const descriptions = await getConsumableDescriptionsFromExe(
      'C:/fake/balatro.exe',
      'pt-BR',
      async () => exe,
    )

    expect(descriptions).toEqual({
      c_fixture_tarot_one: 'Creates the last Tarot or Planet card',
    })
  })

  it('resolves to null (not throw) when the localization file is missing', async () => {
    const exe = buildSyntheticBalatroExe('return {}')

    const descriptions = await getConsumableDescriptionsFromExe(
      'C:/fake/balatro.exe',
      'en',
      async () => exe,
    )

    expect(descriptions).toBeNull()
  })
})
