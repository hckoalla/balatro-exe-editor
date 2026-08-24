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
    detectSteam: 'Detect automatically (Steam)',
    steamNotFound: "Could not find Balatro through Steam — try browsing for it manually.",
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
    challengeDeckDollarsNote:
      "The Luxury Tax challenge shrinks your hand size as this money adds up — a high value here can make that challenge unplayable.",
    challengeDeckJokerSlotNote:
      'Some challenges (Blast Off, Five-Card Draw, Cruelty, Jokerless, Typecast) force their own joker slot count and ignore this value.',
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
  tabs: {
    deckEditor: 'Deck Editor',
    batchEdit: 'Batch Deck Editor',
    pokerHands: 'Poker Hand Editor',
  },
  batchEdit: {
    selectTitle: 'Select decks to edit',
    selectSubtitle: 'Choose one or more decks to apply the same setup to.',
    continue: 'Continue',
    continueWithCount: 'Continue ({{count}} selected)',
    setupTitle: 'Set up the values to apply',
    setupSubtitle:
      'These values will be applied to all {{count}} selected decks, replacing whatever they already have — including Starting Consumables, which is replaced as a whole list.',
    applyButton: 'Apply to {{count}} decks',
    confirmBody:
      "This overwrites Starting Money, Joker Slots, Consumable Slots and Starting Consumables on {{count}} decks, replacing their current values. This writes directly to your balatro.exe. Close Balatro before continuing.",
    confirmYes: 'Yes, apply to {{count}} decks',
  },
  pokerHands: {
    title: 'Poker hand levels',
    subtitle: 'Edit the base chips/mult and per-level growth of each poker hand.',
    sMult: 'Base Mult',
    sChips: 'Base Chips',
    lMult: 'Mult per Level',
    lChips: 'Chips per Level',
    warning:
      "This ±{{limit}} range hasn't been confirmed by testing yet — a provisional guess, and going further could make the game stop working.",
  },
} as const
