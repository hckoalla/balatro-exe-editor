import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParsedPokerHand } from '../shared/poker-hand-schema'
import './SaveButton.css'

export interface PokerHandsSaveButtonProps {
  exePath: string
  hands: ParsedPokerHand[]
}

type Status = 'idle' | 'confirming' | 'saving' | 'success' | 'error'

export function PokerHandsSaveButton({ exePath, hands }: PokerHandsSaveButtonProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleConfirm() {
    setStatus('saving')
    try {
      await window.balatro.savePokerHands(exePath, hands)
      setStatus('success')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('save.genericError'))
      setStatus('error')
    }
  }

  return (
    <div>
      <button
        type="button"
        className="save-button__trigger"
        onClick={() => setStatus('confirming')}
        disabled={status === 'saving'}
      >
        {t('save.button')}
      </button>

      {status === 'confirming' && (
        <div className="save-button__confirm">
          <p className="save-button__confirm-body">{t('save.confirmBody')}</p>
          <div className="save-button__confirm-actions">
            <button type="button" className="save-button__confirm-yes" onClick={handleConfirm}>
              {t('save.confirmYes')}
            </button>
            <button
              type="button"
              className="save-button__confirm-cancel"
              onClick={() => setStatus('idle')}
            >
              {t('save.cancel')}
            </button>
          </div>
        </div>
      )}

      {status === 'success' && <p className="save-button__success">{t('save.success')}</p>}

      {status === 'error' && <div className="save-button__error">{errorMessage}</div>}
    </div>
  )
}
