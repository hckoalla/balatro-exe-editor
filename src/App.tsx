import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SelectExeScreen } from './screens/SelectExeScreen'
import { MainTabs } from './screens/MainTabs'
import { Footer } from './screens/Footer'
import { applyPersistedLanguage } from './i18n/apply-persisted-language'
import './App.css'

function App() {
  const { i18n } = useTranslation()
  const [exePath, setExePath] = useState<string | null>(null)

  useEffect(() => {
    applyPersistedLanguage(window.balatro.getSettings, i18n.changeLanguage.bind(i18n))
  }, [i18n])

  const screen = exePath ? (
    <MainTabs exePath={exePath} />
  ) : (
    <SelectExeScreen onExeSelected={setExePath} />
  )

  return (
    <div className="app-shell">
      <div className="app-shell__content">{screen}</div>
      <Footer />
    </div>
  )
}

export default App
