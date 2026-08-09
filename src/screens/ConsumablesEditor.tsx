import { useMemo, useState } from 'react'
import type { ConsumableCatalogEntry } from '../shared/consumable-catalog-schema'
import './ConsumablesEditor.css'

export interface ConsumablesEditorProps {
  catalog: ConsumableCatalogEntry[]
  originalConsumables: string[]
  consumables: string[]
  onChange: (consumables: string[]) => void
}

const SAFE_LIMIT = 30

export function ConsumablesEditor({
  catalog,
  originalConsumables,
  consumables,
  onChange,
}: ConsumablesEditorProps) {
  const [search, setSearch] = useState('')

  const nameById = useMemo(() => new Map(catalog.map((c) => [c.id, c.name])), [catalog])

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
        <span className="consumables-editor__label">Starting Consumables</span>
        {hasChanged && (
          <button
            type="button"
            className="consumables-editor__reset"
            title="Reset Starting Consumables"
            aria-label="Reset Starting Consumables"
            onClick={handleReset}
          >
            &#8634;
          </button>
        )}
      </div>

      <input
        type="text"
        className="consumables-editor__search"
        placeholder="Search Tarots, Planets, Spectrals…"
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
              {entry.name}
            </li>
          ))}
        </ul>
      )}

      <div className="consumables-editor__chips">
        {consumables.map((id, index) => {
          const name = nameById.get(id) ?? id
          return (
            <span className="consumables-editor__chip" key={`${id}-${index}`}>
              {name}
              <button
                type="button"
                className="consumables-editor__chip-remove"
                aria-label={`Remove ${name}`}
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
          This list hasn&apos;t been tested past {SAFE_LIMIT} items and could make the game stop
          working.
        </div>
      )}
    </div>
  )
}
