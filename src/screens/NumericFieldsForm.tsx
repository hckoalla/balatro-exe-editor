import { useTranslation } from 'react-i18next'
import type { DeckConfig } from '../shared/deck-schema'
import { NUMERIC_FIELD_LIMITS, type NumericFieldKey } from '../shared/numeric-field-limits'
import './NumericFieldsForm.css'

export interface NumericFieldsFormProps {
  config: DeckConfig
  deckId: string
  onChange: (config: DeckConfig) => void
}

type NumericKey = NumericFieldKey

const FIELDS = NUMERIC_FIELD_LIMITS

export function NumericFieldsForm({ config, deckId, onChange }: NumericFieldsFormProps) {
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

  const exceedingFields = FIELDS.filter((field) => {
    const value = config[field.key]
    return value !== undefined && Math.abs(value) > field.safeLimit
  })

  return (
    <div className="numeric-fields-form">
      {exceedingFields.length > 0 && (
        <div className="numeric-fields-form__warnings">
          {exceedingFields.map((field) => (
            <div className="numeric-field__warning" key={field.key}>
              {t('numericFields.warning', { label: t(field.labelKey), limit: field.safeLimit })}
            </div>
          ))}
        </div>
      )}

      <div className="numeric-fields-form__grid">
        {FIELDS.map((field) => {
          const value = config[field.key]
          const isSet = value !== undefined
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
              {field.key === 'dollars' && deckId === 'b_challenge' && (
                <p className="numeric-field__note">{t('numericFields.challengeDeckDollarsNote')}</p>
              )}
              {field.key === 'joker_slot' && deckId === 'b_challenge' && (
                <p className="numeric-field__note">
                  {t('numericFields.challengeDeckJokerSlotNote')}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
