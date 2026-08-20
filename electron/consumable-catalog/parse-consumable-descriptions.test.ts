import { describe, expect, it } from 'vitest'
import { parseConsumableDescriptions } from './parse-consumable-descriptions'

// Formato real de localization/en-us.lua (ver bee5-tooltip-consumiveis) — bloco de descrições
// aninhado por categoria, cada carta com name= e text={"linha", ...}.
const FIXTURE_LOCALIZATION = `
G.localization = {
    descriptions={
        Tarot={
            c_fixture_tarot_one={
                name="The Fixture Fool",
                text={
                    "Creates the last",
                    "{C:tarot}Tarot{} or {C:planet}Planet{} card",
                    "{s:0.8,C:tarot}The Fixture Fool{s:0.8} excluded",
                },
            },
            c_fixture_tarot_two={
                name="The Fixture Star",
                text={
                    "Creates up to {C:attention}#1#",
                    "random {C:tarot}Tarot{} cards",
                },
            },
        },
        Planet={
            c_fixture_planet_one={
                name="Fixture Mercury",
                text={
                    "Level up",
                    "{C:attention}Pair{}",
                },
            },
        },
    },
}
`

describe('parseConsumableDescriptions', () => {
  it('extracts the raw text lines for each consumable id', () => {
    const result = parseConsumableDescriptions(FIXTURE_LOCALIZATION)

    expect(result.get('c_fixture_tarot_one')).toEqual([
      'Creates the last',
      '{C:tarot}Tarot{} or {C:planet}Planet{} card',
      '{s:0.8,C:tarot}The Fixture Fool{s:0.8} excluded',
    ])
  })

  it('extracts entries from every category, not just the first', () => {
    const result = parseConsumableDescriptions(FIXTURE_LOCALIZATION)

    expect(result.get('c_fixture_planet_one')).toEqual(['Level up', '{C:attention}Pair{}'])
  })

  it('keeps dynamic value placeholders (#1#) as-is — known limitation', () => {
    const result = parseConsumableDescriptions(FIXTURE_LOCALIZATION)

    expect(result.get('c_fixture_tarot_two')?.[0]).toContain('#1#')
  })

  it('returns an empty map for malformed/unexpected content, without throwing', () => {
    expect(parseConsumableDescriptions('not a localization file at all').size).toBe(0)
  })
})
