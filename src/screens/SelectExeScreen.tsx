import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './SelectExeScreen.css'

export interface SelectExeScreenProps {
  onExeSelected: (filePath: string) => void
}

export function SelectExeScreen({ onExeSelected }: SelectExeScreenProps) {
  const { t } = useTranslation()
  const [suggestedPath, setSuggestedPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function suggestLastUsedPath() {
      const settings = await window.balatro.getSettings()
      if (!settings.lastExePath) return

      const result = await window.balatro.validateExeFile(settings.lastExePath)
      if (!cancelled && result.valid) {
        setSuggestedPath(settings.lastExePath)
      }
    }

    suggestLastUsedPath()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleUseExe(filePath: string) {
    setIsBusy(true)
    setError(null)
    try {
      const result = await window.balatro.validateExeFile(filePath)
      if (!result.valid) {
        setError(result.reason ?? t('selectExe.genericInvalid'))
        return
      }
      await window.balatro.updateSettings({ lastExePath: filePath })
      onExeSelected(filePath)
    } finally {
      setIsBusy(false)
    }
  }

  async function handleBrowse() {
    const selection = await window.balatro.selectExeFile()
    if (selection.canceled || !selection.filePath) return
    await handleUseExe(selection.filePath)
  }

  return (
    <div className="select-exe-screen">
      <div className="select-exe-screen__icon">
        <div className="select-exe-screen__icon-stack">
          <div className="select-exe-screen__card select-exe-screen__card--back" />
          <div className="select-exe-screen__card select-exe-screen__card--mid" />
          <div className="select-exe-screen__card select-exe-screen__card--front">&#9824;</div>
        </div>
      </div>

      <h1 className="select-exe-screen__title">{t('selectExe.title')}</h1>
      <p className="select-exe-screen__subtitle">{t('selectExe.subtitle')}</p>

      <div className="select-exe-screen__actions">
        {suggestedPath && (
          <button
            type="button"
            className="select-exe-screen__button select-exe-screen__button--secondary"
            onClick={() => handleUseExe(suggestedPath)}
            disabled={isBusy}
          >
            {t('selectExe.continueWith', { path: suggestedPath })}
          </button>
        )}

        <button
          type="button"
          className="select-exe-screen__button select-exe-screen__button--primary"
          onClick={handleBrowse}
          disabled={isBusy}
        >
          {t('selectExe.browse')}
        </button>
      </div>

      {error && (
        <div className="select-exe-screen__error" role="alert">
          <p className="select-exe-screen__error-title">{t('selectExe.invalidTitle')}</p>
          <p className="select-exe-screen__error-body">{error}</p>
        </div>
      )}
    </div>
  )
}
