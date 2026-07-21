# ARC OS · C2 — BATTLE MANAGEMENT (demo screen)

Flat set of React + TypeScript files that recreate the C2 battle-management
console. **Demo only**: dummy data, editable text fields, and clickable
controls — no backend, no real capability.

## Install the two runtime deps

```bash
npm i leaflet react-leaflet lucide-react
```

`react-leaflet` v5 targets React 19. Leaflet's stylesheet and this project's
stylesheet are imported at the top of `App.tsx`:

```ts
import "./arc.css";
import "leaflet/dist/leaflet.css";
```

## Files (all flat — no folders needed)

```
App.tsx           entry — composes the whole screen, holds shared "autonomy" state
arc.css           all styling (scoped under .arc) + CSS variables for the palette
types.ts          shared types
data.ts           dummy data: entities, COAs, data sources, map markers, paths

TopBar.tsx        ARC OS logo, C2 block, HYENA/SENTINEL tabs, LINK/AUTONOMY, user
IconRail.tsx      left icon strip
SoulChat.tsx      left "SOUL 001" chat column (editable query + intent inputs)
DecidePanel.tsx   center DECIDE/ALERTS/AUDIT panel, COA cards, autonomy selector
BattleMap.tsx     map region: battle overview tag, entities toggle, timeline overlay
map/MapWrapper.tsx   SSR-safe dynamic loader for the Leaflet map
map/InteractiveMap.tsx  satellite imagery map with affiliation markers (from uis-master)
EntitiesPanel.tsx right ENTITIES roster + Range-ring / Alerts / Terrain tools
TimelineBar.tsx   bottom timeline (play/pause, checkboxes, scrubber, legend)
```

## Map notes

- Uses **ArcGIS World Imagery** satellite tiles via `react-leaflet`
  (`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`),
  centred on Jaffna — ported from `uis-master`.
- Leaflet reads `window` at import, so `InteractiveMap` is loaded through
  `next/dynamic(..., { ssr: false })` inside `map/MapWrapper`. If you're **not** on
  Next.js, replace that dynamic import with your framework's client-only
  loader (or render `InteractiveMap` only after mount). Everything else is
  framework-agnostic React.
- Entity markers use affiliation-based shapes (hostile diamond, neutral circle,
  UAV triangle, friendly square) with popups for name, type, and confidence.

## What's interactive (demo)

Editable: the SOUL query field, the "type intent" field, and the timeline
search. Clickable with live state: DECIDE/ALERTS/AUDIT tabs, COA selection,
LEVEL OF AUTONOMY (syncs to the top bar), entity filters, 2D/3D toggle, map
zoom +/-, timeline Play/Pause and the Map layers / Tools / Data sources
checkboxes. The red **REVIEW & AUTHORISE** buttons call an `onAuthorise`
no-op hook in `App.tsx` — wire it to real logic there.

## Usage

Render `<App />` (default export of `App.tsx`) as a full-screen route. It
fills the viewport (`.arc` is `100vw × 100vh`).

Verified: strict `tsc` passes; layout checked against the reference via
server-side render + screenshot (map tiles load in-browser only).
