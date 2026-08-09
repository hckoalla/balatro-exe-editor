import { describe, expect, it } from 'vitest'
import { en } from './en'
import { ptBR } from './pt-BR'
import { es } from './es'

function collectKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'string' ? [path] : collectKeys(value as object, path)
  })
}

function valueAt(obj: object, path: string): unknown {
  return path.split('.').reduce((o: never, k) => o[k], obj as never)
}

const enKeys = collectKeys(en).sort()

describe.each([
  ['pt-BR', ptBR],
  ['es', es],
])('translation completeness — %s', (_name, locale) => {
  it('has every key that en has, no more, no less', () => {
    expect(collectKeys(locale).sort()).toEqual(enKeys)
  })

  it('does not have any value left untranslated (identical to en)', () => {
    const untranslated = enKeys.filter((path) => valueAt(en, path) === valueAt(locale, path))

    expect(untranslated).toEqual([])
  })
})
