import type { BalatroApi } from './shared/ipc-contract'

declare global {
  interface Window {
    balatro: BalatroApi
  }
}

export {}
