import { describe, expect, it } from 'vitest'
import { buildWindowTitle } from './build-window-title'

describe('buildWindowTitle', () => {
  it('includes the app name, credit and version', () => {
    expect(buildWindowTitle('0.1.0')).toBe('Balatro EXE Editor - by hckoalla - v0.1.0')
  })
})
