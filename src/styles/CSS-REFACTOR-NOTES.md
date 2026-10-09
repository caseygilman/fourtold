# FOURTOLD CSS consolidation

## Central controls
- `tokens.css`: shared design values, including `--app-max-width`, `--app-gutter`, `--header-height`, `--page-top`, `--page-bottom`, `--page-fade-duration`, and `--editorial-content-width`.
- `layout.css`: one page-container rule for `.home-page`, `.pillar-page`, and `.journal-page`, plus the app shell, scrolling region, and nav region. Existing JSX works unchanged.
- `animations.css`: the single reduced-motion fallback.

## Removed duplication
- Deleted separate page container declarations from `home.css`, `pillars.css`, and `journal.css`.
- Removed `.today-page` width override (52rem), duplicate Today heading declarations, and tablet `.pillar-page` layout override.
- Removed duplicate page-specific reduced-motion blocks.
- Replaced hardcoded legacy bronze colors in `journal.css` with palette tokens. `--bronze-rgb` is the same color as `--bronze` and supports alpha transparency.
- Header height and main content offset now share a token.

## Intentional exceptions
- Home content stays narrower for editorial readability but aligns to the same left edge.
- Desktop Today's Walk title keeps its larger display style, a typographic exception rather than a container override.
- Feature styles remain scoped to their components; unrelated navigation and onboarding behavior is unchanged.

## Apply and verify
1. Back up your existing `src/styles` directory.
2. Replace its CSS files with the contents of this archive. `index.css` import order is preserved.
3. Run `npm run build` and inspect Home, Faith, Fitness, Finance, Family, Today, and Journal at mobile and desktop widths.
4. Confirm scrolling, bottom navigation, onboarding bubbles, fade/reduced-motion, and Journal save/edit.
5. Do not deploy until those checks pass.

Note: Only CSS files were supplied; this refactor has not been compiled against the full React project. No minified files or new CSS build tooling are introduced.
