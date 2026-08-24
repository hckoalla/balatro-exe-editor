import { useTranslation } from 'react-i18next'
import type { AppLanguage } from '../shared/settings-schema'
import { RestoreDefaultButton } from './RestoreDefaultButton'
import './SettingsScreen.css'

export interface SettingsScreenProps {
  exePath: string
}

const LANGUAGE_OPTIONS: Array<{ value: AppLanguage; nativeName: string }> = [
  { value: 'en', nativeName: 'English' },
  { value: 'pt-BR', nativeName: 'Português' },
  { value: 'es', nativeName: 'Español' },
]

export function SettingsScreen({ exePath }: SettingsScreenProps) {
  const { t, i18n } = useTranslation()

  async function handleLanguageChange(language: AppLanguage) {
    await i18n.changeLanguage(language)
    await window.balatro.updateSettings({ language })
  }

  return (
    <div className="settings-screen">
      <h1 className="settings-screen__title">{t('tabs.settings')}</h1>

      <div className="settings-screen__section">
        <p className="settings-screen__label">{t('settings.language')}</p>
        <div role="radiogroup" aria-label={t('settings.language')}>
          {LANGUAGE_OPTIONS.map((option) => (
            <label className="settings-screen__option" key={option.value}>
              <input
                type="radio"
                name="language"
                value={option.value}
                checked={i18n.language === option.value}
                onChange={() => handleLanguageChange(option.value)}
              />
              {option.nativeName}
            </label>
          ))}
        </div>
      </div>

      <div className="settings-screen__section">
        <p className="settings-screen__label">{t('restore.button')}</p>
        <RestoreDefaultButton exePath={exePath} onRestored={() => {}} />
      </div>
    </div>
  )
}
