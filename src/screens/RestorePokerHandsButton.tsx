import { RestoreButton } from './RestoreButton'

export interface RestorePokerHandsButtonProps {
  exePath: string
  onRestored: () => void
}

export function RestorePokerHandsButton({ exePath, onRestored }: RestorePokerHandsButtonProps) {
  return (
    <RestoreButton
      exePath={exePath}
      onRestored={onRestored}
      restore={window.balatro.restorePokerHandsDefault}
      labelKey="restore.pokerHandsButton"
      confirmBodyKey="restore.pokerHandsConfirmBody"
      confirmYesKey="restore.pokerHandsConfirmYes"
    />
  )
}
