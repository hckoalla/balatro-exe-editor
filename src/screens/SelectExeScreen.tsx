import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import bannerUrl from '../../logo/banner_v1.png'
import './SelectExeScreen.css'

export interface SelectExeScreenProps {
  onExeSelected: (filePath: string) => void
}

export function SelectExeScreen({ onExeSelected }: SelectExeScreenProps) {
  const { t } = useTranslation()
  const [suggestedPath, setSuggestedPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [steamNotFound, setSteamNotFound] = useState(false)
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
    setSteamNotFound(false)
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

  async function handleDetectSteam() {
    setIsBusy(true)
    setError(null)
    setSteamNotFound(false)
    try {
      const detectedPath = await window.balatro.detectExeViaSteam()
      if (!detectedPath) {
        setSteamNotFound(true)
        return
      }
      await handleUseExe(detectedPath)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="select-exe-screen">
      <img className="select-exe-screen__banner" src={bannerUrl} alt="Balatro EXE Editor" />

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

        <button
          type="button"
          className="select-exe-screen__button select-exe-screen__button--secondary"
          onClick={handleDetectSteam}
          disabled={isBusy}
        >
          {t('selectExe.detectSteam')}
        </button>
      </div>

      {error && (
        <div className="select-exe-screen__error" role="alert">
          <p className="select-exe-screen__error-title">{t('selectExe.invalidTitle')}</p>
          <p className="select-exe-screen__error-body">{error}</p>
        </div>
      )}

      {steamNotFound && (
        <div className="select-exe-screen__notice" role="status">
          <p className="select-exe-screen__notice-body">{t('selectExe.steamNotFound')}</p>
        </div>
      )}
    </div>
  )
}
