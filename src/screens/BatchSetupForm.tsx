import { useTranslation } from 'react-i18next'
import { NUMERIC_FIELD_LIMITS, type NumericFieldKey } from '../shared/numeric-field-limits'
import './BatchSetupForm.css'

export type BatchDeckSetup = Partial<Record<NumericFieldKey, number>>

export interface BatchSetupFormProps {
  setup: BatchDeckSetup
  onChange: (setup: BatchDeckSetup) => void
}

export function BatchSetupForm({ setup, onChange }: BatchSetupFormProps) {
  const { t } = useTranslation()

  function handleFieldChange(key: NumericFieldKey, rawValue: string) {
    const next = { ...setup }
    if (rawValue.trim() === '') {
      delete next[key]
    } else {
      next[key] = Number(rawValue)
    }
    onChange(next)
  }

  const exceedingFields = NUMERIC_FIELD_LIMITS.filter((field) => {
    const value = setup[field.key]
    return value !== undefined && Math.abs(value) > field.safeLimit
  })

  return (
    <div className="batch-setup-form">
      {exceedingFields.length > 0 && (
        <div className="batch-setup-form__warnings">
          {exceedingFields.map((field) => (
            <div className="batch-setup-field__warning" key={field.key}>
              {t('numericFields.warning', { label: t(field.labelKey), limit: field.safeLimit })}
            </div>
          ))}
        </div>
      )}

      <div className="batch-setup-form__grid">
        {NUMERIC_FIELD_LIMITS.map((field) => (
          <div className="batch-setup-field" key={field.key}>
            <label className="batch-setup-field__label" htmlFor={`batch-setup-field-${field.key}`}>
              {t(field.labelKey)}
            </label>
            <input
              id={`batch-setup-field-${field.key}`}
              type="number"
              className="batch-setup-field__input"
              value={setup[field.key] ?? ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
