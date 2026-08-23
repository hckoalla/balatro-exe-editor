Balatro EXE Editor is a lightweight desktop tool that lets you customize the starting rules of
every deck in Balatro — no manual file hacking, no 7-Zip, no text editor. Just point it at your
`balatro.exe`, pick a deck, tweak the values, and save. It edits the game executable directly,
with an automatic backup taken before your first change and a one-click "Restore Default" button
if you ever want to go back to vanilla.

*A single portable `.exe` — download and run, no installer, nothing added to your system.*

## Installation

1. Download `Balatro EXE Editor x.x.x.exe` and run it directly from wherever you saved it — no
   install step, no admin permissions needed.
2. Point it to your `balatro.exe` (usually inside your Balatro install folder), or let it detect
   a Steam install automatically.
3. Pick a deck, edit its values, hit Save.

No files are copied into your Balatro folder — the app edits your existing `balatro.exe` in
place, so keep it pointed at the real install.

## Main features

- Edit all 16 decks individually (all playable decks + the Challenge deck) — not a single global
  value.
- Customize starting money, joker slots, and consumable slots per deck.
- Choose exactly which consumables (Tarots, Planets, Spectrals) each deck starts with — with the
  real in-game artwork for each one, and a hover tooltip showing a bigger image, name, and what
  it does.
- Automatically detect your Balatro install via Steam, or point it to the `.exe` manually.
- Automatic backup before your very first edit, plus a one-click restore to the game's original
  defaults.
- Soft warnings when you push a value past the safe, tested range — you're told, never blocked.
- Available in English, Portuguese (BR), and Spanish.

## Requirements

- Windows only.
- Close Balatro (and Steam's file lock on it) before saving changes — the app can't write to the
  `.exe` while it's open.
- Nothing else to install — no dependencies, no Lua/LÖVE2D tooling required on your end.
- The app isn't code-signed (solo/fan project) — Windows SmartScreen may show a warning on first
  run ("Windows protected your PC"). Click "More info" → "Run anyway" — normal for small
  unsigned tools, not a sign of anything malicious.
- Heads-up: Steam's "Verify integrity of game files" can silently revert your edited `.exe` back
  to the original. Re-apply your changes if that happens.

This is a fan-made tool, not affiliated with LocalThunk or Playstack.

Source code: https://github.com/hckoalla/balatro-exe-editor

Mod by hckoalla
