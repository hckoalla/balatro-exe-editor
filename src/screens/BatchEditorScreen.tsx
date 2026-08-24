import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParsedDeck } from '../shared/deck-schema'
import type { ConsumableCatalogEntry } from '../shared/consumable-catalog-schema'
import { BatchSetupForm, type BatchDeckSetup } from './BatchSetupForm'
import { ConsumablesEditor } from './ConsumablesEditor'
import { BatchSaveButton } from './BatchSaveButton'
import './DeckEditorScreen.css'

export interface BatchEditorScreenProps {
  decks: ParsedDeck[]
  exePath: string
  onBack: () => void
}

export function BatchEditorScreen({ decks, exePath, onBack }: BatchEditorScreenProps) {
  const { t, i18n } = useTranslation()
  const [setup, setSetup] = useState<BatchDeckSetup>({})
  const [consumables, setConsumables] = useState<string[]>([])
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

  return (
    <div className="deck-editor-screen">
      <button type="button" className="deck-editor-screen__back" onClick={onBack}>
        &#8592; {t('deckEditor.back')}
      </button>
      <h1 className="deck-editor-screen__title">{t('batchEdit.setupTitle')}</h1>
      <p>{t('batchEdit.setupSubtitle', { count: decks.length })}</p>
      <p className="batch-editor-screen__deck-list">
        {decks.map((deck) => deck.name).join(', ')}
      </p>

      <BatchSetupForm setup={setup} onChange={setSetup} />

      <ConsumablesEditor
        catalog={catalog}
        atlas={atlas}
        descriptions={descriptions}
        originalConsumables={consumables}
        consumables={consumables}
        onChange={setConsumables}
      />

      <BatchSaveButton exePath={exePath} decks={decks} setup={setup} consumables={consumables} />
    </div>
  )
}
