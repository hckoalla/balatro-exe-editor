import { useState } from 'react'
import { SelectExeScreen } from './screens/SelectExeScreen'

function App() {
  const [exePath, setExePath] = useState<string | null>(null)

  if (!exePath) {
    return <SelectExeScreen onExeSelected={setExePath} />
  }

  // Próxima tela real (seleção de baralho) chega em BEE-5 — por enquanto só confirma o caminho.
  return (
    <main>
      <p>Using: {exePath}</p>
    </main>
  )
}

export default App
