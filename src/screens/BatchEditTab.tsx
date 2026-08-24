import { useState } from 'react'
import type { ParsedDeck } from '../shared/deck-schema'
import { BatchDecksScreen } from './BatchDecksScreen'
import { BatchEditorScreen } from './BatchEditorScreen'

export interface BatchEditTabProps {
  exePath: string
}

export function BatchEditTab({ exePath }: BatchEditTabProps) {
  const [selectedDecks, setSelectedDecks] = useState<ParsedDeck[] | null>(null)

  if (selectedDecks) {
    return (
      <BatchEditorScreen decks={selectedDecks} exePath={exePath} onBack={() => setSelectedDecks(null)} />
    )
  }

  return <BatchDecksScreen exePath={exePath} onContinue={setSelectedDecks} />
}
