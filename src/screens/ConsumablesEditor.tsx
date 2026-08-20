import { useMemo, useState, type CSSProperties, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ConsumableCatalogEntry } from '../shared/consumable-catalog-schema'
import './ConsumablesEditor.css'

export interface ConsumablesEditorProps {
  catalog: ConsumableCatalogEntry[]
  atlas?: string | null
  descriptions?: Record<string, string> | null
  originalConsumables: string[]
  consumables: string[]
  onChange: (consumables: string[]) => void
}

const SAFE_LIMIT = 30

// Grid do atlas real (resources/textures/1x/Tarots.png, 710x570px) — ver bee5-imagens-consumiveis.
const ATLAS_CELL_WIDTH = 71
const ATLAS_CELL_HEIGHT = 95
// Tamanho de exibição do ícone pequeno (precisa bater com .consumables-editor__sprite no CSS) —
// o atlas é recortado nesse tamanho por CSS background-position, então a escala precisa ser
// aplicada em background-size E background-position juntos.
const SPRITE_DISPLAY_WIDTH = 28
const SPRITE_SCALE = SPRITE_DISPLAY_WIDTH / ATLAS_CELL_WIDTH
// Tooltip mostra o recorte em tamanho nativo (ver bee5-tooltip-consumiveis) — sem escala.
const TOOLTIP_SPRITE_SCALE = 1
const ATLAS_WIDTH = 710
const ATLAS_HEIGHT = 570

interface HoverTarget {
  id: string
  x: number
  y: number
}

export function ConsumablesEditor({
  catalog,
  atlas,
  descriptions,
  originalConsumables,
  consumables,
  onChange,
}: ConsumablesEditorProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [hover, setHover] = useState<HoverTarget | null>(null)

  const nameById = useMemo(() => new Map(catalog.map((c) => [c.id, c.name])), [catalog])
  const posById = useMemo(() => new Map(catalog.map((c) => [c.id, c.pos])), [catalog])
  const hoveredEntry = hover ? catalog.find((c) => c.id === hover.id) : undefined

  function spriteStyle(
    pos: { x: number; y: number },
    scale: number = SPRITE_SCALE,
  ): CSSProperties | undefined {
    if (!atlas) return undefined
    return {
      backgroundImage: `url(${atlas})`,
      backgroundSize: `${ATLAS_WIDTH * scale}px ${ATLAS_HEIGHT * scale}px`,
      backgroundPosition: `-${pos.x * ATLAS_CELL_WIDTH * scale}px -${pos.y * ATLAS_CELL_HEIGHT * scale}px`,
    }
  }

  function handleSpriteEnter(id: string, event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    setHover({ id, x: rect.right + 8, y: rect.top })
  }

  function handleSpriteLeave() {
    setHover(null)
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
                onMouseEnter={(e) => handleSpriteEnter(entry.id, e)}
                onMouseLeave={handleSpriteLeave}
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
                  onMouseEnter={(e) => handleSpriteEnter(id, e)}
                  onMouseLeave={handleSpriteLeave}
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

      {hover && hoveredEntry && (
        <div
          className="consumables-editor__tooltip"
          role="tooltip"
          style={{ left: hover.x, top: hover.y }}
        >
          <span
            className="consumables-editor__tooltip-sprite"
            style={spriteStyle(hoveredEntry.pos, TOOLTIP_SPRITE_SCALE)}
          />
          <div className="consumables-editor__tooltip-body">
            <p className="consumables-editor__tooltip-name">{hoveredEntry.name}</p>
            {descriptions?.[hoveredEntry.id] && (
              <p className="consumables-editor__tooltip-description">
                {descriptions[hoveredEntry.id]}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
