import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParsedDeck, DeckConfig } from '../shared/deck-schema'
import { Modal } from './Modal'
import './SaveButton.css'

export interface SaveButtonProps {
  exePath: string
  deck: ParsedDeck
  config: DeckConfig
}

type Status = 'idle' | 'confirming' | 'saving' | 'success' | 'error'

export function SaveButton({ exePath, deck, config }: SaveButtonProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [possiblyPreEdited, setPossiblyPreEdited] = useState(false)

  async function handleConfirm() {
    setStatus('saving')
    try {
      const result = await window.balatro.saveDeck(exePath, {
        id: deck.id,
        name: deck.name,
        config,
      })
      setPossiblyPreEdited(result.possiblyPreEdited)
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
        <Modal onClose={() => setStatus('idle')}>
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
        </Modal>
      )}

      {status === 'success' && (
        <>
          <p className="save-button__success">{t('save.success')}</p>
          {possiblyPreEdited && (
            <div className="save-button__notice">{t('save.possiblyPreEditedWarning')}</div>
          )}
        </>
      )}

      {status === 'error' && <div className="save-button__error">{errorMessage}</div>}
    </div>
  )
}
