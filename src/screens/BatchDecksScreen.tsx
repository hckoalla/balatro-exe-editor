import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParsedDeck } from '../shared/deck-schema'
import './BatchDecksScreen.css'

export interface BatchDecksScreenProps {
  exePath: string
  onContinue: (decks: ParsedDeck[]) => void
}

export function BatchDecksScreen({ exePath, onContinue }: BatchDecksScreenProps) {
  const { t } = useTranslation()
  const [decks, setDecks] = useState<ParsedDeck[] | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    window.balatro.getDecks(exePath).then(setDecks)
  }, [exePath])

  if (!decks) {
    return <p>{t('decks.loading')}</p>
  }

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleContinue() {
    onContinue(decks!.filter((deck) => selectedIds.has(deck.id)))
  }

  return (
    <div className="batch-decks-screen">
      <div className="batch-decks-screen__header">
        <h1 className="batch-decks-screen__title">{t('batchEdit.selectTitle')}</h1>
        <p className="batch-decks-screen__subtitle">{t('batchEdit.selectSubtitle')}</p>
      </div>

      <div className="batch-decks-screen__grid">
        {decks.map((deck) => {
          const checked = selectedIds.has(deck.id)
          return (
            <label
              key={deck.id}
              className={`batch-deck-card${checked ? ' batch-deck-card--selected' : ''}`}
            >
              <input
                type="checkbox"
                className="batch-deck-card__checkbox"
                checked={checked}
                onChange={() => toggle(deck.id)}
              />
              {deck.name}
            </label>
          )
        })}
      </div>

      <div className="batch-decks-screen__footer">
        <button
          type="button"
          className="batch-decks-screen__continue"
          disabled={selectedIds.size === 0}
          onClick={handleContinue}
        >
          {selectedIds.size > 0
            ? t('batchEdit.continueWithCount', { count: selectedIds.size })
            : t('batchEdit.continue')}
        </button>
      </div>
    </div>
  )
}
