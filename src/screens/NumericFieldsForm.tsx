import { useTranslation } from 'react-i18next'
import type { DeckConfig } from '../shared/deck-schema'
import './NumericFieldsForm.css'

export interface NumericFieldsFormProps {
  config: DeckConfig
  onChange: (config: DeckConfig) => void
}

type NumericKey = 'dollars' | 'joker_slot' | 'consumable_slot'

interface FieldDef {
  key: NumericKey
  labelKey: string
  safeLimit: number
}

// Limites testados empiricamente pelo usuário — ver backlog/README.md (contexto de domínio).
const FIELDS: FieldDef[] = [
  { key: 'dollars', labelKey: 'numericFields.dollars', safeLimit: 230 },
  { key: 'joker_slot', labelKey: 'numericFields.jokerSlot', safeLimit: 145 },
  { key: 'consumable_slot', labelKey: 'numericFields.consumableSlot', safeLimit: 90 },
]

export function NumericFieldsForm({ config, onChange }: NumericFieldsFormProps) {
  const { t } = useTranslation()

  function handleFieldChange(key: NumericKey, rawValue: string) {
    const next = { ...config }
    if (rawValue.trim() === '') {
      delete next[key]
    } else {
      next[key] = Number(rawValue)
    }
    onChange(next)
  }

  function handleReset(key: NumericKey) {
    const next = { ...config }
    delete next[key]
    onChange(next)
  }

  return (
    <div className="numeric-fields-form">
      {FIELDS.map((field) => {
        const value = config[field.key]
        const isSet = value !== undefined
        const exceedsSafeLimit = isSet && Math.abs(value) > field.safeLimit
        const label = t(field.labelKey)

        return (
          <div className="numeric-field" key={field.key}>
            <div className="numeric-field__header">
              <label className="numeric-field__label" htmlFor={`numeric-field-${field.key}`}>
                {label}
              </label>
              {isSet && (
                <button
                  type="button"
                  className="numeric-field__reset"
                  title={t('numericFields.resetField', { label })}
                  aria-label={t('numericFields.resetField', { label })}
                  onClick={() => handleReset(field.key)}
                >
                  &#8634;
                </button>
              )}
            </div>

            <div className="numeric-field__input-row">
              <div className="numeric-field__input-wrapper">
                {isSet && value >= 0 && <span className="numeric-field__input-prefix">+</span>}
                <input
                  id={`numeric-field-${field.key}`}
                  type="number"
                  className="numeric-field__input"
                  value={value ?? ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
              </div>
            </div>
            <p className="numeric-field__hint">{t('numericFields.addedToBase')}</p>

            {exceedsSafeLimit && (
              <div className="numeric-field__warning">
                {t('numericFields.warning', { limit: field.safeLimit })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
