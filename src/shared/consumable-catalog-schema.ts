export type ConsumableCategory = 'Tarot' | 'Planet' | 'Spectral'

export interface ConsumableCatalogEntry {
  id: string
  name: string
  category: ConsumableCategory
}
