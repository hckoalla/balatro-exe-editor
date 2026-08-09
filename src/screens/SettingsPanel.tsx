import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppLanguage } from '../shared/settings-schema'
import './SettingsPanel.css'

const LANGUAGE_OPTIONS: Array<{ value: AppLanguage; nativeName: string }> = [
  { value: 'en', nativeName: 'English' },
  { value: 'pt-BR', nativeName: 'Português' },
  { value: 'es', nativeName: 'Español' },
]

export function SettingsPanel() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  async function handleLanguageChange(language: AppLanguage) {
    await i18n.changeLanguage(language)
    await window.balatro.updateSettings({ language })
  }

  return (
    <div>
      <button
        type="button"
        className="settings-panel__trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        {t('settings.button')}
      </button>

      {open && (
        <div className="settings-panel__panel">
          <p className="settings-panel__label">{t('settings.language')}</p>
          <div role="radiogroup" aria-label={t('settings.language')}>
            {LANGUAGE_OPTIONS.map((option) => (
              <label className="settings-panel__option" key={option.value}>
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
      )}
    </div>
  )
}
