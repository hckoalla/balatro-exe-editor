// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import i18n from './index'

describe('i18n', () => {
  it('defaults to English', () => {
    expect(i18n.t('save.button')).toBe('Save')
  })

  it('falls back to English for a language with no resources loaded', () => {
    const t = i18n.getFixedT('xx')
    expect(t('save.button')).toBe('Save')
  })
})
