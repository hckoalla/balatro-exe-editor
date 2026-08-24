import { useState } from 'react'
import type { ParsedDeck } from '../shared/deck-schema'
import { DecksScreen } from './DecksScreen'
import { DeckEditorScreen } from './DeckEditorScreen'

export interface DeckEditorTabProps {
  exePath: string
}

export function DeckEditorTab({ exePath }: DeckEditorTabProps) {
  const [selectedDeck, setSelectedDeck] = useState<ParsedDeck | null>(null)

  if (selectedDeck) {
    return (
      <DeckEditorScreen deck={selectedDeck} exePath={exePath} onBack={() => setSelectedDeck(null)} />
    )
  }

  return <DecksScreen exePath={exePath} onSelectDeck={setSelectedDeck} />
}
