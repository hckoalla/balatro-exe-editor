import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SelectExeScreen } from './screens/SelectExeScreen'
import { DecksScreen } from './screens/DecksScreen'
import { DeckEditorScreen } from './screens/DeckEditorScreen'
import type { ParsedDeck } from './shared/deck-schema'
import { applyPersistedLanguage } from './i18n/apply-persisted-language'

function App() {
  const { i18n } = useTranslation()
  const [exePath, setExePath] = useState<string | null>(null)
  const [selectedDeck, setSelectedDeck] = useState<ParsedDeck | null>(null)

  useEffect(() => {
    applyPersistedLanguage(window.balatro.getSettings, i18n.changeLanguage.bind(i18n))
  }, [i18n])

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
