import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParsedDeck } from '../shared/deck-schema'
import { isDeckCustomized } from '../shared/known-default-decks'
import { RestoreDecksButton } from './RestoreDecksButton'
import './DecksScreen.css'

export interface DecksScreenProps {
  exePath: string
  onSelectDeck: (deck: ParsedDeck) => void
}

export function DecksScreen({ exePath, onSelectDeck }: DecksScreenProps) {
  const { t } = useTranslation()
  const [decks, setDecks] = useState<ParsedDeck[] | null>(null)

  const loadDecks = useCallback(() => {
    window.balatro.getDecks(exePath).then(setDecks)
  }, [exePath])

  useEffect(() => {
    loadDecks()
  }, [loadDecks])

  if (!decks) {
    return <p>{t('decks.loading')}</p>
  }

  return (
    <div className="decks-screen">
      <div className="decks-screen__header">
        <div>
          <h1 className="decks-screen__title">{t('decks.title')}</h1>
          <p className="decks-screen__subtitle">{t('decks.subtitle')}</p>
        </div>
        <div className="decks-screen__header-actions">
          <RestoreDecksButton exePath={exePath} onRestored={loadDecks} />
        </div>
      </div>

      <div className="decks-screen__grid">
        {decks.map((deck) => {
          const isCustomized = isDeckCustomized(deck)
          return (
            <button
              key={deck.id}
              type="button"
              data-testid={`deck-card-${deck.id}`}
              className={`deck-card${isCustomized ? ' deck-card--customized' : ''}`}
              onClick={() => onSelectDeck(deck)}
            >
              <div className="deck-card__accent" />
              <div className="deck-card__body">
                <div className="deck-card__name">{deck.name}</div>
                <div className="deck-card__badge">
                  {isCustomized ? t('decks.customized') : t('decks.default')}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
