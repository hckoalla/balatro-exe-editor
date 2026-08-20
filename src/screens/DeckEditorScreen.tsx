import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParsedDeck } from '../shared/deck-schema'
import type { ConsumableCatalogEntry } from '../shared/consumable-catalog-schema'
import { NumericFieldsForm } from './NumericFieldsForm'
import { ConsumablesEditor } from './ConsumablesEditor'
import { SaveButton } from './SaveButton'
import './DeckEditorScreen.css'

export interface DeckEditorScreenProps {
  deck: ParsedDeck
  exePath: string
  onBack: () => void
}

export function DeckEditorScreen({ deck, exePath, onBack }: DeckEditorScreenProps) {
  const { t, i18n } = useTranslation()
  const [config, setConfig] = useState(deck.config)
  const [catalog, setCatalog] = useState<ConsumableCatalogEntry[]>([])
  const [atlas, setAtlas] = useState<string | null>(null)
  const [descriptions, setDescriptions] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    let cancelled = false
    window.balatro.getConsumableCatalog(exePath).then((result) => {
      if (!cancelled) setCatalog(result)
    })
    window.balatro.getConsumableAtlas(exePath).then((result) => {
      if (!cancelled) setAtlas(result)
    })
    window.balatro.getConsumableDescriptions(exePath, i18n.language).then((result) => {
      if (!cancelled) setDescriptions(result)
    })
    return () => {
      cancelled = true
    }
  }, [exePath, i18n.language])

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
        &#8592; {t('deckEditor.back')}
      </button>
      <h1 className="deck-editor-screen__title">{deck.name}</h1>

      <NumericFieldsForm config={config} onChange={setConfig} />

      <ConsumablesEditor
        catalog={catalog}
        atlas={atlas}
        descriptions={descriptions}
        originalConsumables={deck.config.consumables ?? []}
        consumables={config.consumables ?? []}
        onChange={handleConsumablesChange}
      />

      <SaveButton exePath={exePath} deck={deck} config={config} />
    </div>
  )
}
