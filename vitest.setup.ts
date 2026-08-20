import { afterEach, vi } from 'vitest'
import { DEFAULT_SETTINGS } from './src/shared/settings-schema'

// Roda em TODOS os arquivos de teste (setupFiles é global), mas a maioria roda sob environment
// `node` (sem `window`) — só os testes de componente React (docblock `@vitest-environment
// jsdom`) precisam do mock de `window.balatro` e do jest-dom.
if (typeof window !== 'undefined') {
  await import('@testing-library/jest-dom/vitest')
  await import('./src/i18n')
  const { cleanup } = await import('@testing-library/react')

  function createDefaultApiMock(): typeof window.balatro {
    return {
      getAppVersion: vi.fn().mockResolvedValue('0.0.0'),
      getSettings: vi.fn().mockResolvedValue(DEFAULT_SETTINGS),
      updateSettings: vi.fn().mockResolvedValue(DEFAULT_SETTINGS),
      selectExeFile: vi.fn().mockResolvedValue({ canceled: true, filePath: null }),
      validateExeFile: vi.fn().mockResolvedValue({ valid: false, reason: null }),
      detectExeViaSteam: vi.fn().mockResolvedValue(null),
      getDecks: vi.fn().mockResolvedValue([]),
      getConsumableCatalog: vi.fn().mockResolvedValue([]),
      getConsumableAtlas: vi.fn().mockResolvedValue(null),
      hasBackup: vi.fn().mockResolvedValue(false),
      restoreDefault: vi.fn().mockResolvedValue(undefined),
      saveDeck: vi.fn().mockResolvedValue({ backupCreated: false, possiblyPreEdited: false }),
    }
  }

  window.balatro = createDefaultApiMock()

  afterEach(() => {
    cleanup()
    window.balatro = createDefaultApiMock()
  })
}
