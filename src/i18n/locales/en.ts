// Forma de `en`, mas com folhas `string` genéricas — outros idiomas não devem ter o MESMO texto
// literal do inglês (`typeof en` com `as const` forçaria isso), só a mesma estrutura de chaves.
export type Messages<T = typeof en> = { [K in keyof T]: T[K] extends string ? string : Messages<T[K]> }

export const en = {
  selectExe: {
    title: "Let's find your game",
    subtitle: "Point me to your balatro.exe and I'll take it from there.",
    continueWith: 'Continue with {{path}}',
    browse: 'Browse for balatro.exe',
    invalidTitle: 'Not a valid Balatro executable',
    genericInvalid: 'This does not look like a valid balatro.exe.',
  },
  decks: {
    loading: 'Loading decks…',
    title: 'Choose a deck',
    subtitle: 'Pick a deck to customize its starting rules.',
    customized: 'Customized',
    default: 'Default',
  },
  deckEditor: {
    back: 'Back',
  },
  numericFields: {
    dollars: 'Starting Money',
    jokerSlot: 'Joker Slots',
    consumableSlot: 'Consumable Slots',
    addedToBase: 'Added to the base game value.',
    resetField: 'Reset {{label}}',
    warning:
      "{{label}}: this value hasn't been tested (safe range up to ±{{limit}}) and could make the game stop working.",
  },
  consumables: {
    label: 'Starting Consumables',
    searchPlaceholder: 'Search Tarots, Planets, Spectrals…',
    resetLabel: 'Reset Starting Consumables',
    removeLabel: 'Remove {{name}}',
    warning:
      "This list hasn't been tested past {{limit}} items and could make the game stop working.",
  },
  save: {
    button: 'Save',
    confirmBody: 'This will write directly to your balatro.exe. Close Balatro before continuing.',
    confirmYes: 'Yes, save',
    cancel: 'Cancel',
    success: 'Saved successfully.',
    genericError: 'Could not save — try again.',
    possiblyPreEditedWarning:
      "Heads up: this file already had non-default values before this app's first backup — the backup may not reflect the game's original defaults.",
  },
  restore: {
    button: 'Restore Default',
    confirmBody:
      'This will undo every customization on this game — all decks go back to their default values. Close Balatro before continuing.',
    confirmYes: 'Yes, restore',
    cancel: 'Cancel',
  },
  settings: {
    button: 'Settings',
    language: 'Language',
  },
  footer: {
    credit: 'Made by hckoalla',
  },
} as const
