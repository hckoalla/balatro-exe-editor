import { useEffect, useState } from 'react'

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
    <div>
      <h1>Let&apos;s find your game</h1>
      <p>Point me to your balatro.exe and I&apos;ll take it from there.</p>

      {suggestedPath && (
        <button type="button" onClick={() => handleUseExe(suggestedPath)} disabled={isBusy}>
          Continue with {suggestedPath}
        </button>
      )}

      <button type="button" onClick={handleBrowse} disabled={isBusy}>
        Browse for balatro.exe
      </button>

      {error && (
        <div role="alert">
          <strong>Not a valid Balatro executable</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
