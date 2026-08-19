Design a **logo** and a **banner** for a desktop app called **"Balatro EXE Editor"**.

## What the app does

Balatro is a poker roguelike deckbuilder game. On Windows it ships as a single fused `.exe` file
that bundles the game's Lua source code inside it. This app lets players tweak starting-deck
rules (starting money, joker slots, consumable slots, starting consumables) through a friendly
desktop GUI instead of manually hex-editing the `.exe`.

This is a fan-made utility, not part of the game itself and not affiliated with the game's
developer or publisher — but it should feel like it belongs on the same desk as the game, like an
official companion tool. **It must not reproduce or trace the game's actual logo, artwork, or
brand marks** — this is original work inspired by the game's mood, not a copy of it.

## Visual identity — match what's already built, don't invent a new one

The app's UI already has a settled visual identity (a Claude Design prototype was applied to it
earlier). The logo and banner need to slot into that identity, not introduce a new one:

- **Background / panels**: near-black, slightly purple-tinted dark (`#0a0710` base, panels from
  `#16111c` to `#211a29`) — a dark casino/card-table mood, not pure black.
- **Accent color**: a warm gold/amber (`#f3b542`, hover `#ffc766`) — this is the app's single
  signature color, used sparingly for emphasis (like a chip or a spotlight), not as a background
  wash.
- **Text**: warm off-white (`#f4eee2`) on the dark backgrounds.
- **Display/headline typography**: **Bungee** — a chunky, bold, slightly retro/arcade display
  face. Use this feeling (bold, blocky, playful) for any wordmark/lettering in the logo or banner,
  without necessarily using the literal font (a custom lettermark inspired by that same chunky
  arcade energy is welcome).
- **Body typography**: **Manrope** — clean, modern sans-serif. Not relevant to the logo itself,
  but keep any supporting text in the banner in that register (no ornate/script fonts).
- **Motifs**: poker chips, playing cards, card-table felt textures, subtle rounded card shapes
  with soft drop shadows — the same materials the rest of the UI already leans on.

Reference the mood, materials and exact palette above — dark felt-table background, a confident
single gold accent, chunky playful display type, card/chip iconography — without reproducing any
of Balatro's actual artwork, logo, or fonts.

## Deliverable 1 — Logo (app icon)

Replaces the default Electron icon: window icon, taskbar icon, and the Windows installer icon.

- **Square** composition, self-contained (no long wordmark baked in — a mark/symbol, optionally
  paired with a very short lettermark like "BEE" if it reads cleanly at small sizes).
- Must stay legible and recognizable at **very small sizes** (16×16 and 32×32, taskbar/window
  scale) as well as large (256×256 and above, installer/store scale) — bold, simple silhouette
  over fine detail.
- Deliver a **high-resolution source** (at least 1024×1024, transparent background) — smaller
  `.ico`-ready sizes get generated from this source afterward, not designed separately.
- Suggested concept direction: something built from the same card/chip/gold-accent language as
  the app itself — e.g. a stylized card or chip with an edit/pencil motif, or a monogram built
  from the chunky display-type energy of "BEE" (Balatro EXE Editor). Open to other concepts that
  fit the same mood.

## Deliverable 2 — Banner

Shown in two places in the app, so it needs **two variants**, not one image stretched two ways:

- **Hero banner** — wide format (roughly 3:1 to 4:1), shown at the top of the app's first screen
  (where the user picks their `balatro.exe`). Can carry the full logo mark plus a wordmark
  ("Balatro EXE Editor") and a bit of atmosphere (felt texture, a few scattered chips/cards) —
  this is the one place in the app that can feel like a title/splash moment.
- **Condensed banner** — a compact, short-height version (roughly 8:1 or wider, low height) shown
  repeated at the top of every other screen, as part of the navigation chrome. Should read at a
  glance without competing with the screen's actual content below it — mark + wordmark, minimal
  extra decoration, sits comfortably against the app's dark background.

Both variants should share the same mark/wordmark treatment as the logo, so a user recognizes them
as the same app across every screen.

## Format notes

- Flat image assets (PNG, transparent background where the design calls for it) — this isn't an
  interactive prototype, just the source artwork to drop into the app and into the Windows
  installer.
- Keep the three deliverables (icon, hero banner, condensed banner) visually as one family —
  same palette, same mark, same weight of line/shape — not three unrelated designs.
