# Changelog

All notable changes to this project are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.2] - 2026-08-23

_(`v1.1.1` shipped the itch.io publish step below, but it referenced a GitHub Action that doesn't
exist — the release workflow failed before ever reaching itch.io. Fixed here; no other changes.)_

### Added

- Releases are now also published to [itch.io](https://storydevgames.itch.io/balatro-exe-editor)
  automatically, alongside GitHub Releases, on every version tag.
- A banner now appears at the top of the README.

### Fixed

- The itch.io publish step referenced a GitHub Action (`itchio/setup-butler`) that doesn't
  exist, so it failed immediately — switched to `remarkablegames/setup-butler`, the one itch.io's
  own documentation actually references.

## [1.1.0] - 2026-08-20

### Added

- Automatic Steam install detection: an explicit "detect automatically" button on the first
  screen locates Balatro through the Windows registry, Steam's library folders, and the app
  manifest — an alternative to browsing for the `.exe` manually, not a replacement for it.
- Consumable artwork in the deck editor: each Tarot/Planet/Spectral now shows its real in-game
  sprite (cropped from the game's own texture atlas, extracted from the user's own `.exe` — no
  game assets are bundled with the app) in the search results and as chips, instead of just a
  name.
- Hover tooltip on consumables: a larger image, the name, and an effect description pulled from
  the game's own localization files, in whichever of the 3 supported languages (English,
  Portuguese, Spanish) is currently active.
- App icon (window, taskbar, and the packaged executable) and a banner on the home screen,
  generated from an original design prompt — not a reproduction of the game's own artwork.
- Investigated whether decks can start with specific Jokers (a frequently-requested idea) —
  confirmed that mechanic only exists for Challenges in the real game, never for a regular deck.
  A Challenge-scoped Jokers editor has been fully technically mapped out, but is deliberately
  left for later.

### Changed

- Release packaging switched from an NSIS installer to a single portable `.exe` — no install
  step, no Windows registration, just download and run.
- The `.exe`/ZIP read engine was generalized to extract any file by path from the embedded ZIP
  (not just `game.lua`), which is what makes the consumable artwork and description features
  possible without bundling proprietary game files.

### Fixed

- Consumable images failed to load silently (falling back to name-only) due to an incorrect
  path used to locate the sprite atlas inside the `.exe`'s embedded ZIP.

## [1.0.1] - 2026-08-19

_(`v1.0.2` points to the same commit as `v1.0.1` — no separate changes.)_

### Added

- A native splash window (a separate, frameless, always-on-top window) is now shown while the
  app boots, replacing the previous in-window loading bar. The main window stays hidden until
  its content is fully ready, so there's no longer a moment where an empty window is visible.

### Changed

- Rewrote the README in English, with a full architecture section covering the IPC contract, the
  ZIP-locating trick, the deck-block parser, backup/pre-existing-edit detection, and the
  dependency-injection approach used for testability.

## [1.0.0] - 2026-08-09

Initial release. The full MVP:

- Locate and edit the `game.lua` embedded inside a fused `balatro.exe`, writing changes back
  without touching the rest of the file.
- Per-deck editing (starting money, joker slots, consumable slots, starting consumables) for all
  16 decks (15 playable + Challenge), with soft warnings past the tested-safe range.
- Automatic backup of the original `game.lua` before the first edit, with detection of files
  that may have already been customized outside the app, and a one-click restore to default.
- English (default), Portuguese (BR), and Spanish, with a language selector in the UI.
