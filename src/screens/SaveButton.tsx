import { useState } from 'react'
import type { ParsedDeck, DeckConfig } from '../shared/deck-schema'
import './SaveButton.css'

export interface SaveButtonProps {
  exePath: string
  deck: ParsedDeck
  config: DeckConfig
}

type Status = 'idle' | 'confirming' | 'saving' | 'success' | 'error'

export function SaveButton({ exePath, deck, config }: SaveButtonProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleConfirm() {
    setStatus('saving')
    try {
      await window.balatro.saveDeck(exePath, { id: deck.id, name: deck.name, config })
      setStatus('success')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not save — try again.')
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
        Save
      </button>

      {status === 'confirming' && (
        <div className="save-button__confirm">
          <p className="save-button__confirm-body">
            This will write directly to your balatro.exe. Close Balatro before continuing.
          </p>
          <div className="save-button__confirm-actions">
            <button
              type="button"
              className="save-button__confirm-yes"
              onClick={handleConfirm}
            >
              Yes, save
            </button>
            <button
              type="button"
              className="save-button__confirm-cancel"
              onClick={() => setStatus('idle')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status === 'success' && <p className="save-button__success">Saved successfully.</p>}

      {status === 'error' && <div className="save-button__error">{errorMessage}</div>}
    </div>
  )
}
