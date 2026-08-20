export type ConsumableCategory = 'Tarot' | 'Planet' | 'Spectral'

export interface AtlasPosition {
  x: number
  y: number
}

export interface ConsumableCatalogEntry {
  id: string
  name: string
  category: ConsumableCategory
  pos: AtlasPosition
}
