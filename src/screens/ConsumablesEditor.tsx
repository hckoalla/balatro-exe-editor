import { useMemo, useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import type { ConsumableCatalogEntry } from '../shared/consumable-catalog-schema'
import './ConsumablesEditor.css'

export interface ConsumablesEditorProps {
  catalog: ConsumableCatalogEntry[]
  atlas?: string | null
  originalConsumables: string[]
  consumables: string[]
  onChange: (consumables: string[]) => void
}

const SAFE_LIMIT = 30

// Grid do atlas real (textures/1x/Tarots.png, 710x570px) — ver bee5-imagens-consumiveis.
const ATLAS_CELL_WIDTH = 71
const ATLAS_CELL_HEIGHT = 95
// Tamanho de exibição na UI (precisa bater com .consumables-editor__sprite no CSS) — o atlas é
// recortado nesse tamanho por CSS background-position, então a escala precisa ser aplicada em
// background-size E background-position juntos.
const SPRITE_DISPLAY_WIDTH = 28
const SPRITE_SCALE = SPRITE_DISPLAY_WIDTH / ATLAS_CELL_WIDTH
const ATLAS_WIDTH = 710
const ATLAS_HEIGHT = 570

export function ConsumablesEditor({
  catalog,
  atlas,
  originalConsumables,
  consumables,
  onChange,
}: ConsumablesEditorProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const nameById = useMemo(() => new Map(catalog.map((c) => [c.id, c.name])), [catalog])
  const posById = useMemo(() => new Map(catalog.map((c) => [c.id, c.pos])), [catalog])

  function spriteStyle(pos: { x: number; y: number }): CSSProperties | undefined {
    if (!atlas) return undefined
    return {
      backgroundImage: `url(${atlas})`,
      backgroundSize: `${ATLAS_WIDTH * SPRITE_SCALE}px ${ATLAS_HEIGHT * SPRITE_SCALE}px`,
      backgroundPosition: `-${pos.x * ATLAS_CELL_WIDTH * SPRITE_SCALE}px -${pos.y * ATLAS_CELL_HEIGHT * SPRITE_SCALE}px`,
    }
  }

  const results = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return catalog.filter((c) => c.name.toLowerCase().includes(query))
  }, [catalog, search])

  const hasChanged = JSON.stringify(consumables) !== JSON.stringify(originalConsumables)
  const exceedsSafeLimit = consumables.length > SAFE_LIMIT

  function handleAdd(id: string) {
    onChange([...consumables, id])
  }

  function handleRemoveAt(index: number) {
    onChange(consumables.filter((_, i) => i !== index))
  }

  function handleReset() {
    onChange([...originalConsumables])
  }

  return (
    <div className="consumables-editor">
      <div className="consumables-editor__header">
        <span className="consumables-editor__label">{t('consumables.label')}</span>
        {hasChanged && (
          <button
            type="button"
            className="consumables-editor__reset"
            title={t('consumables.resetLabel')}
            aria-label={t('consumables.resetLabel')}
            onClick={handleReset}
          >
            &#8634;
          </button>
        )}
      </div>

      <input
        type="text"
        className="consumables-editor__search"
        placeholder={t('consumables.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {results.length > 0 && (
        <ul className="consumables-editor__results" role="listbox">
          {results.map((entry) => (
            <li
              key={entry.id}
              role="option"
              aria-selected={false}
              className="consumables-editor__result"
              onClick={() => handleAdd(entry.id)}
            >
              <span
                className="consumables-editor__sprite"
                style={spriteStyle(entry.pos)}
                aria-hidden="true"
              />
              {entry.name}
            </li>
          ))}
        </ul>
      )}

      <div className="consumables-editor__chips">
        {consumables.map((id, index) => {
          const name = nameById.get(id) ?? id
          const pos = posById.get(id)
          return (
            <span className="consumables-editor__chip" key={`${id}-${index}`}>
              {pos && (
                <span
                  className="consumables-editor__sprite"
                  style={spriteStyle(pos)}
                  aria-hidden="true"
                />
              )}
              {name}
              <button
                type="button"
                className="consumables-editor__chip-remove"
                aria-label={t('consumables.removeLabel', { name })}
                onClick={() => handleRemoveAt(index)}
              >
                &#10005;
              </button>
            </span>
          )
        })}
      </div>

      {exceedsSafeLimit && (
        <div className="consumables-editor__warning">
          {t('consumables.warning', { limit: SAFE_LIMIT })}
        </div>
      )}
    </div>
  )
}
