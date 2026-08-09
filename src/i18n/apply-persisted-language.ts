import type { AppSettings } from '../shared/settings-schema'

type GetSettings = () => Promise<AppSettings>
type ChangeLanguage = (lang: string) => Promise<unknown>

/**
 * Aplica o idioma salvo em `AppSettings` no i18next, ao iniciar o app — pra escolha de idioma
 * persistir entre reinícios (ver bee1-electron-store-config).
 */
export async function applyPersistedLanguage(
  getSettings: GetSettings,
  changeLanguage: ChangeLanguage,
): Promise<void> {
  const settings = await getSettings()
  await changeLanguage(settings.language)
}
