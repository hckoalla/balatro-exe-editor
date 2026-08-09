import { useEffect, useState } from 'react'
import './RestoreDefaultButton.css'

export interface RestoreDefaultButtonProps {
  exePath: string
  onRestored: () => void
}

export function RestoreDefaultButton({ exePath, onRestored }: RestoreDefaultButtonProps) {
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
        Restore Default
      </button>

      {confirming && (
        <div className="restore-default-button__confirm">
          <p className="restore-default-button__confirm-body">
            This will undo every customization on this game — all decks go back to their default
            values. Close Balatro before continuing.
          </p>
          <div className="restore-default-button__confirm-actions">
            <button
              type="button"
              className="restore-default-button__confirm-yes"
              onClick={handleConfirm}
            >
              Yes, restore
            </button>
            <button
              type="button"
              className="restore-default-button__confirm-cancel"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
