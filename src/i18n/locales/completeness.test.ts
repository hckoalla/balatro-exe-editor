import { describe, expect, it } from 'vitest'
import { en } from './en'
import { ptBR } from './pt-BR'

function collectKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'string' ? [path] : collectKeys(value as object, path)
  })
}

const enKeys = collectKeys(en).sort()

describe('translation completeness', () => {
  it('pt-BR has every key that en has, no more, no less', () => {
    expect(collectKeys(ptBR).sort()).toEqual(enKeys)
  })

  it('pt-BR does not have any value left untranslated (identical to en)', () => {
    const untranslated = collectKeys(en).filter((path) => {
      const enValue = path.split('.').reduce((o: never, k) => o[k], en as never)
      const ptValue = path.split('.').reduce((o: never, k) => o[k], ptBR as never)
      return enValue === ptValue
    })

    expect(untranslated).toEqual([])
  })
})
