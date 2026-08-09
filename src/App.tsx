import { useState } from 'react'
import { SelectExeScreen } from './screens/SelectExeScreen'
import { DecksScreen } from './screens/DecksScreen'
import { DeckEditorScreen } from './screens/DeckEditorScreen'
import type { ParsedDeck } from './shared/deck-schema'

function App() {
  const [exePath, setExePath] = useState<string | null>(null)
  const [selectedDeck, setSelectedDeck] = useState<ParsedDeck | null>(null)

  if (!exePath) {
    return <SelectExeScreen onExeSelected={setExePath} />
  }

  if (selectedDeck) {
    return (
      <DeckEditorScreen
        deck={selectedDeck}
        exePath={exePath}
        onBack={() => setSelectedDeck(null)}
      />
    )
  }

  return <DecksScreen exePath={exePath} onSelectDeck={setSelectedDeck} />
}

export default App
