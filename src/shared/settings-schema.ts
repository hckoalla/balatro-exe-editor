export type AppLanguage = 'en' | 'pt-BR' | 'es'

export interface AppSettings {
  lastExePath: string | null
  language: AppLanguage
}

export const DEFAULT_SETTINGS: AppSettings = {
  lastExePath: null,
  language: 'en',
}
