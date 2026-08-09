import { useEffect, useState } from 'react'
import type { ParsedDeck } from '../shared/deck-schema'
import type { ConsumableCatalogEntry } from '../shared/consumable-catalog-schema'
import { NumericFieldsForm } from './NumericFieldsForm'
import { ConsumablesEditor } from './ConsumablesEditor'
import './DeckEditorScreen.css'

export interface DeckEditorScreenProps {
  deck: ParsedDeck
  exePath: string
  onBack: () => void
}

export function DeckEditorScreen({ deck, exePath, onBack }: DeckEditorScreenProps) {
  // Botão de salvar (bee5-salvar-alteracoes) se junta a esse estado na próxima história.
  const [config, setConfig] = useState(deck.config)
  const [catalog, setCatalog] = useState<ConsumableCatalogEntry[]>([])

  useEffect(() => {
    let cancelled = false
    window.balatro.getConsumableCatalog(exePath).then((result) => {
      if (!cancelled) setCatalog(result)
    })
    return () => {
      cancelled = true
    }
  }, [exePath])

  function handleConsumablesChange(consumables: string[]) {
    setConfig((prev) => {
      const next = { ...prev }
      if (consumables.length > 0) {
        next.consumables = consumables
      } else {
        delete next.consumables
      }
      return next
    })
  }

  return (
    <div className="deck-editor-screen">
      <button type="button" className="deck-editor-screen__back" onClick={onBack}>
        &#8592; Back
      </button>
      <h1 className="deck-editor-screen__title">{deck.name}</h1>

      <NumericFieldsForm config={config} onChange={setConfig} />

      <ConsumablesEditor
        catalog={catalog}
        originalConsumables={deck.config.consumables ?? []}
        consumables={config.consumables ?? []}
        onChange={handleConsumablesChange}
      />
    </div>
  )
}
