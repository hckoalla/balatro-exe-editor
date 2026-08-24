export type NumericFieldKey = 'dollars' | 'joker_slot' | 'consumable_slot'

export interface NumericFieldLimit {
  key: NumericFieldKey
  labelKey: string
  safeLimit: number
}

// Limites testados empiricamente pelo usuário — ver backlog/README.md (contexto de domínio).
export const NUMERIC_FIELD_LIMITS: NumericFieldLimit[] = [
  { key: 'dollars', labelKey: 'numericFields.dollars', safeLimit: 230 },
  { key: 'joker_slot', labelKey: 'numericFields.jokerSlot', safeLimit: 145 },
  { key: 'consumable_slot', labelKey: 'numericFields.consumableSlot', safeLimit: 90 },
]
