# Design system

Package: `packages/design-system` (`@cuddles/design-system`). Imported as source by the desktop app.

## Direction
Restrained, warm and quiet. Dark by default (warm graphite, not cold grey) with a light-orange accent and
a serif display face for headings. Light theme uses warm cream with the same accent. Selected by
`data-theme="dark|light"` on `<html>`; `useThemePreference` also supports "system".

## Rules
- All colours, sizes, radii, durations and z-indexes come from `src/tokens.css`. No raw values in components.
- Tailwind is used for layout utilities only, never for colour or type decisions.
- Fonts are bundled offline (Inter for UI, Source Serif 4 for display/headings, JetBrains Mono for code).
- Icons are curated in `src/icons.ts` (Lucide underneath) and rendered through `Icon` at a fixed stroke width.
- Motion goes through `src/motion.ts` (GSAP). Components never call GSAP directly. Reduced motion is respected in
  both CSS (durations become 0) and JS.
- Icon-only controls require an accessible `label`.

## Primitives (Phase 1.3)
Text, Stack, Surface, Divider, Button, IconButton, Kbd, Badge, Icon.
Menus, tooltips, dialogs, the command palette and the resizable split system arrive with the app shell.