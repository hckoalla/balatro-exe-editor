import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import './RestoreDefaultButton.css'

export interface RestoreButtonProps {
  exePath: string
  onRestored: () => void
  restore: (exePath: string) => Promise<void>
  labelKey: string
  confirmBodyKey: string
  confirmYesKey: string
}

/**
 * Base compartilhada pelos 3 botões de restaurar (geral, só baralhos, só mãos de pôquer) — o que
 * muda entre eles é só qual função de IPC chamar e os textos, não o fluxo (mesma checagem de
 * `hasBackup`, mesma confirmação antes de restaurar).
 */
export function RestoreButton({
  exePath,
  onRestored,
  restore,
  labelKey,
  confirmBodyKey,
  confirmYesKey,
}: RestoreButtonProps) {
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
    await restore(exePath)
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
        {t(labelKey)}
      </button>

      {confirming && (
        <Modal onClose={() => setConfirming(false)}>
          <p className="restore-default-button__confirm-body">{t(confirmBodyKey)}</p>
          <div className="restore-default-button__confirm-actions">
            <button
              type="button"
              className="restore-default-button__confirm-yes"
              onClick={handleConfirm}
            >
              {t(confirmYesKey)}
            </button>
            <button
              type="button"
              className="restore-default-button__confirm-cancel"
              onClick={() => setConfirming(false)}
            >
              {t('restore.cancel')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
