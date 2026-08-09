import { useEffect, useState } from 'react'
import './SelectExeScreen.css'

export interface SelectExeScreenProps {
  onExeSelected: (filePath: string) => void
}

export function SelectExeScreen({ onExeSelected }: SelectExeScreenProps) {
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
        setError(result.reason ?? 'This does not look like a valid balatro.exe.')
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

      <h1 className="select-exe-screen__title">Let&apos;s find your game</h1>
      <p className="select-exe-screen__subtitle">
        Point me to your balatro.exe and I&apos;ll take it from there.
      </p>

      <div className="select-exe-screen__actions">
        {suggestedPath && (
          <button
            type="button"
            className="select-exe-screen__button select-exe-screen__button--secondary"
            onClick={() => handleUseExe(suggestedPath)}
            disabled={isBusy}
          >
            Continue with {suggestedPath}
          </button>
        )}

        <button
          type="button"
          className="select-exe-screen__button select-exe-screen__button--primary"
          onClick={handleBrowse}
          disabled={isBusy}
        >
          Browse for balatro.exe
        </button>
      </div>

      {error && (
        <div className="select-exe-screen__error" role="alert">
          <p className="select-exe-screen__error-title">Not a valid Balatro executable</p>
          <p className="select-exe-screen__error-body">{error}</p>
        </div>
      )}
    </div>
  )
}
