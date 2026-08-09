import { useEffect, useState } from 'react'
import type { ParsedDeck } from '../shared/deck-schema'
import './DecksScreen.css'

export interface DecksScreenProps {
  exePath: string
  onSelectDeck: (deck: ParsedDeck) => void
}

export function DecksScreen({ exePath, onSelectDeck }: DecksScreenProps) {
  const [decks, setDecks] = useState<ParsedDeck[] | null>(null)

  useEffect(() => {
    let cancelled = false
    window.balatro.getDecks(exePath).then((result) => {
      if (!cancelled) setDecks(result)
    })
    return () => {
      cancelled = true
    }
  }, [exePath])

  if (!decks) {
    return <p>Loading decks…</p>
  }

  return (
    <div className="decks-screen">
      <div className="decks-screen__header">
        <div>
          <h1 className="decks-screen__title">Choose a deck</h1>
          <p className="decks-screen__subtitle">Pick a deck to customize its starting rules.</p>
        </div>
      </div>

      <div className="decks-screen__grid">
        {decks.map((deck) => {
          const isCustomized = Object.keys(deck.config).length > 0
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
                <div className="deck-card__badge">{isCustomized ? 'Customized' : 'Default'}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
