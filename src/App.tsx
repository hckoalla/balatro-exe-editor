import { useState } from 'react'
import { SelectExeScreen } from './screens/SelectExeScreen'
import { DecksScreen } from './screens/DecksScreen'
import type { ParsedDeck } from './shared/deck-schema'

function App() {
  const [exePath, setExePath] = useState<string | null>(null)
  const [selectedDeck, setSelectedDeck] = useState<ParsedDeck | null>(null)

  if (!exePath) {
    return <SelectExeScreen onExeSelected={setExePath} />
  }

  if (selectedDeck) {
    // Editor de verdade (campos numéricos + consumíveis) chega em
    // bee5-formulario-valores-numericos / bee5-editor-consumiveis-iniciais.
    return (
      <main>
        <p>Editing: {selectedDeck.name}</p>
      </main>
    )
  }

  return <DecksScreen exePath={exePath} onSelectDeck={setSelectedDeck} />
}

export default App
