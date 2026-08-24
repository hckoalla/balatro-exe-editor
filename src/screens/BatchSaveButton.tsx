import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParsedDeck } from '../shared/deck-schema'
import type { BatchDeckSetup } from './BatchSetupForm'
import './SaveButton.css'

export interface BatchSaveButtonProps {
  exePath: string
  decks: ParsedDeck[]
  setup: BatchDeckSetup
  consumables: string[]
}

type Status = 'idle' | 'confirming' | 'saving' | 'success' | 'error'

export function BatchSaveButton({ exePath, decks, setup, consumables }: BatchSaveButtonProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const count = decks.length

  async function handleConfirm() {
    setStatus('saving')
    try {
      const editedDecks: ParsedDeck[] = decks.map((deck) => ({
        id: deck.id,
        name: deck.name,
        config: { ...setup, consumables },
      }))
      await window.balatro.saveDecksBatch(exePath, editedDecks)
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
        {t('batchEdit.applyButton', { count })}
      </button>

      {status === 'confirming' && (
        <div className="save-button__confirm">
          <p className="save-button__confirm-body">{t('batchEdit.confirmBody', { count })}</p>
          <div className="save-button__confirm-actions">
            <button type="button" className="save-button__confirm-yes" onClick={handleConfirm}>
              {t('batchEdit.confirmYes', { count })}
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
