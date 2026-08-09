import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SelectExeScreen } from './screens/SelectExeScreen'
import { DecksScreen } from './screens/DecksScreen'
import { DeckEditorScreen } from './screens/DeckEditorScreen'
import { Footer } from './screens/Footer'
import type { ParsedDeck } from './shared/deck-schema'
import { applyPersistedLanguage } from './i18n/apply-persisted-language'
import './App.css'

function App() {
  const { i18n } = useTranslation()
  const [exePath, setExePath] = useState<string | null>(null)
  const [selectedDeck, setSelectedDeck] = useState<ParsedDeck | null>(null)

  useEffect(() => {
    applyPersistedLanguage(window.balatro.getSettings, i18n.changeLanguage.bind(i18n))
  }, [i18n])

  let screen
  if (!exePath) {
    screen = <SelectExeScreen onExeSelected={setExePath} />
  } else if (selectedDeck) {
    screen = (
      <DeckEditorScreen deck={selectedDeck} exePath={exePath} onBack={() => setSelectedDeck(null)} />
    )
  } else {
    screen = <DecksScreen exePath={exePath} onSelectDeck={setSelectedDeck} />
  }

  return (
    <div className="app-shell">
      <div className="app-shell__content">{screen}</div>
      <Footer />
    </div>
  )
}

export default App
