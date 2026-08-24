import { RestoreButton } from './RestoreButton'

export interface RestoreDecksButtonProps {
  exePath: string
  onRestored: () => void
}

export function RestoreDecksButton({ exePath, onRestored }: RestoreDecksButtonProps) {
  return (
    <RestoreButton
      exePath={exePath}
      onRestored={onRestored}
      restore={window.balatro.restoreDecksDefault}
      labelKey="restore.decksButton"
      confirmBodyKey="restore.decksConfirmBody"
      confirmYesKey="restore.decksConfirmYes"
    />
  )
}
