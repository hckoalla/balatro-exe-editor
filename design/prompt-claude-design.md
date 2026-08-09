Design a desktop app prototype called **"Balatro EXE Editor"**.

## What the app does

Balatro is a poker roguelike deckbuilder game. On Windows it ships as a single fused `.exe` file
that bundles the game's Lua source code inside it. Players who want to tweak starting-deck rules
(house rules / personal mods) currently have to open the `.exe` in a ZIP tool, extract a source
file, hand-edit it in a plain text editor, and re-inject it — a fiddly, error-prone, very
"power user" workflow.

This app replaces that whole manual process with a friendly desktop GUI: pick your `balatro.exe`,
pick a deck, adjust a few numeric fields and a list of starting items through normal form
controls, hit Save, and the app writes the change back into the `.exe` for you. It also keeps an
automatic backup of the untouched original so the user can always restore the game to its
out-of-the-box state with one click.

This is a fan-made utility, not part of the game itself and not affiliated with the game's
developer — but it should feel like it belongs on the same desk as the game, like an official
companion tool.

## Visual identity — inspired by Balatro, not a copy

Balatro's own aesthetic: a dark, moody casino/card-table backdrop; poker chips and playing cards
as the core motifs; a saturated, playful color accent (reds, golds, blues) popping against near-
black backgrounds; chunky, slightly retro/arcade display typography for headers and titles,
paired with a clean, highly legible sans-serif for body text and form labels; lots of rounded
card-shaped panels with subtle drop shadows, like cards laid on felt.

Take inspiration from that mood and materials — dark felt-table backgrounds, card/chip shapes,
a confident accent color, playful-but-readable type contrast — without reproducing or tracing any
of the game's actual artwork, fonts, or logos. This should read as "a tool a Balatro fan built,"
not as a reskin of the game's UI.

The interface language is **English**. Keep copy short, clear, and a little playful in tone
(matching the game's irreverent voice) without sacrificing clarity — this app makes permanent
edits to a user's game files, so critical actions and warnings must never be ambiguous.

## Screens to design

1. **Select Game File** — entry screen. A clear call-to-action to browse for `balatro.exe`. Shows
   an error state (with a helpful message) if the chosen file isn't a valid Balatro executable.
   Once a valid file is picked, the path is remembered and shown for future sessions.

2. **Deck Selection** — a grid or list of all 16 decks (the 15 playable decks: Red, Blue, Yellow,
   Green, Black, Magic, Nebula, Ghost, Abandoned, Checkered, Zodiac, Painted, Anaglyph, Plasma,
   Erratic — plus the special Challenge deck). Each deck card should visually indicate whether it
   has been customized (has any non-default value) versus untouched. Selecting a deck opens its
   editor.

3. **Deck Editor** — the core screen, for one deck at a time:
   - Three numeric stepper/input fields: **Starting Money**, **Joker Slots**, **Consumable
     Slots**. Every one of these is a *bonus added on top of the game's base value*, not an
     absolute number — the UI must make that framing obvious (e.g. shown as "+10" rather than
     "10", with a small caption like "added to the base amount").
   - Each numeric field has a known safe-tested ceiling (Starting Money +230, Joker Slots +145,
     Consumable Slots +90). Going over it should NOT be blocked — instead show an inline
     **soft-warning** (distinct visual treatment: warning color/icon, not an error color) noting
     the value exceeds what's been tested and could make the game stop working.
   - A **Starting Consumables** list editor: a searchable picker (by name, e.g. "The Fool",
     "Jupiter") to add Tarot/Planet/Spectral cards the deck starts with, shown as removable chips/
     tags in an ordered list; duplicates are allowed. A similar soft-warning appears past ~30
     items.
   - Every one of the fields above (the three numeric fields, and the consumables list as a
     whole) has a small **per-field reset/rollback icon button** next to it, which only appears
     once that field has been changed away from the deck's default value. Clicking it reverts
     just that one field, leaving the rest of the deck's edits untouched. This is a light,
     inline affordance (small icon button), not a dialog — it doesn't need a confirmation step,
     unlike Save or Restore Backup below.
   - A prominent **Save** button that, on click, opens a confirmation dialog before writing to the
     real `.exe` (irreversible-feeling action on the user's actual game install), reminding the
     user to close the game first. After saving, show clear success or error feedback (including
     a specific "file is in use — close Balatro first" error state).

4. **Restore Backup** — accessible from settings or the deck list. Explains that the app keeps an
   automatic backup of the untouched original `game.lua`, and offers a "Restore Default" action
   that reverts ALL customizations at once. This is a destructive action on the user's current
   edits, so it needs its own explicit confirmation dialog, visually distinct (more alarming) than
   the Save confirmation.

5. **Settings** — a simple panel with a language switcher (English / Português / Español) and the
   currently selected game file path (with an option to change it).

## States to design explicitly

- Soft-warning state (numeric field and list, both) — visually distinct from a hard error.
- Per-field reset icon — hidden when the field is at its default, visible (and clickable) once
  changed.
- Two tiers of confirmation dialog: a "normal" confirm (Save) and a "destructive" confirm (Restore
  Backup) — they should not look equally alarming.
- Success and error toasts/banners, including the specific "file in use, close the game" error.
- Empty/default state for a deck that has no customizations yet.

## Deliverable

Please produce this as an interactive HTML prototype (`.dc.html`) covering all five screens above
and their key states, in the same format used for this team's other Claude Design prototypes.
