import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './RestoreDefaultButton.css'

export interface RestoreDefaultButtonProps {
  exePath: string
  onRestored: () => void
}

export function RestoreDefaultButton({ exePath, onRestored }: RestoreDefaultButtonProps) {
  const { t } = useTranslation()
  const [hasBackup, setHasBackup] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    let cancelled = false
    window.balatro.hasBackup(exePath).then((result) => {
      if (!cancelled) setHasBackup(result)
    })
    return () => {
      cancelled = true
    }
  }, [exePath])

  if (!hasBackup) return null

  async function handleConfirm() {
    await window.balatro.restoreDefault(exePath)
    setConfirming(false)
    onRestored()
  }

  return (
    <div>
      <button
        type="button"
        className="restore-default-button__trigger"
        onClick={() => setConfirming(true)}
      >
        {t('restore.button')}
      </button>

      {confirming && (
        <div className="restore-default-button__confirm">
          <p className="restore-default-button__confirm-body">{t('restore.confirmBody')}</p>
          <div className="restore-default-button__confirm-actions">
            <button
              type="button"
              className="restore-default-button__confirm-yes"
              onClick={handleConfirm}
            >
              {t('restore.confirmYes')}
            </button>
            <button
              type="button"
              className="restore-default-button__confirm-cancel"
              onClick={() => setConfirming(false)}
            >
              {t('restore.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
