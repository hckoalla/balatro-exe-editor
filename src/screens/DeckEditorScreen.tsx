import { useState } from 'react'
import type { ParsedDeck } from '../shared/deck-schema'
import { NumericFieldsForm } from './NumericFieldsForm'
import './DeckEditorScreen.css'

export interface DeckEditorScreenProps {
  deck: ParsedDeck
  onBack: () => void
}

export function DeckEditorScreen({ deck, onBack }: DeckEditorScreenProps) {
  // Editor de consumíveis (bee5-editor-consumiveis-iniciais) e o botão de salvar
  // (bee5-salvar-alteracoes) se juntam a esse estado nas próximas histórias.
  const [config, setConfig] = useState(deck.config)

  return (
    <div className="deck-editor-screen">
      <button type="button" className="deck-editor-screen__back" onClick={onBack}>
        &#8592; Back
      </button>
      <h1 className="deck-editor-screen__title">{deck.name}</h1>

      <NumericFieldsForm config={config} onChange={setConfig} />
    </div>
  )
}
