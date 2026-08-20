import { describe, expect, it } from 'vitest'
import { stripBalatroMarkup } from './strip-balatro-markup'

describe('stripBalatroMarkup', () => {
  it('removes color/style tags, keeping the wrapped text', () => {
    expect(stripBalatroMarkup('{C:tarot}Tarot{} or {C:planet}Planet{} card')).toBe(
      'Tarot or Planet card',
    )
  })

  it('handles tags with multiple attributes and mismatched open/close pairs', () => {
    expect(stripBalatroMarkup('{s:0.8,C:tarot}The Fool{s:0.8} excluded')).toBe('The Fool excluded')
  })

  it('leaves plain text (no markup) untouched', () => {
    expect(stripBalatroMarkup('Creates the last')).toBe('Creates the last')
  })
})
