import { RestoreButton } from './RestoreButton'

export interface RestoreDefaultButtonProps {
  exePath: string
  onRestored: () => void
}

export function RestoreDefaultButton({ exePath, onRestored }: RestoreDefaultButtonProps) {
  return (
    <RestoreButton
      exePath={exePath}
      onRestored={onRestored}
      restore={window.balatro.restoreDefault}
      labelKey="restore.button"
      confirmBodyKey="restore.confirmBody"
      confirmYesKey="restore.confirmYes"
    />
  )
}
