# ARC OS · SENTINEL — Dark Mode screen

Drop-in recreation of the SENTINEL battle-management screen as separate
React 19 / TypeScript 5 components. All data is **dummy** and lives in
`data/dummyData.ts`; UI state is in a Zustand store. No real capability —
this is a visual interface only.

## Where it goes

Copy this whole folder into:

```
D:\AA absolx\ADOSMissionControl\src\DarkMode\
```

`hhh.tsx` is the screen. It already merges with your existing `components`
folder (new files are namespaced under `components/sentinel`,
`components/telemetry`, `components/hyena`, `components/ui`).

## File map

```
hhh.tsx                         screen — composes everything
arc.css                         theme vars (--arc-*) + all component classes (scoped under .arc-root)
types.ts                        domain types
data/dummyData.ts               tracks, TEWA, batteries, sensors, gauges, blips, etc.
store/useArcStore.ts            Zustand store (activeTab, selectedTrackId, hyenaOpen, isPlaying…)
components/
  TopBar.tsx
  IconRail.tsx
  TrackManager.tsx              track list + filters (selection driven by the store)
  EventLog.tsx
  ReplayBar.tsx
  sentinel/
    SentinelPanel.tsx           center module wrapper
    RadarScope.tsx              PPI radar (inline SVG)
    TewaTable.tsx
    InterceptorBatteries.tsx
    SensorGridHealth.tsx
  telemetry/
    TelemetryPanel.tsx
    Gauge.tsx                   270° radial gauge (inline SVG)
    AttitudeIndicator.tsx       heading rose (inline SVG)
  hyena/
    HyenaPanel.tsx              floating decision-support overlay
  ui/
    Tag.tsx, ProgressBar.tsx    small shared primitives
```

## Setup notes

1. **Styles** — import the theme once. Either add `@import "./arc.css";` to
   `app/globals.css`, or rely on the `import "./arc.css"` already in
   `hhh.tsx`. All bespoke classes are scoped under `.arc-root` (the screen's
   outer wrapper) so they won't leak into the rest of the app. Colors are
   plain CSS variables (`--arc-lime`, `--arc-cyan`, …); an optional `@theme`
   bridge for Tailwind v4 utilities is commented at the top of `arc.css`.

2. **Icons** — uses `lucide-react`. `npm i lucide-react` if you don't have it.

3. **State** — `useArcStore` is a self-contained Zustand 5 store. In the wider
   app this is one of your ~70 feature stores; tab switching, track selection,
   the HYENA open/close toggle, and replay play/pause are all wired to it.

4. **next-intl** — copy is currently inline (English). Migrating to
   `locales/*.json` is straightforward: lift the visible strings into a
   namespace and swap them for `t("…")` calls. Left inline so the screen drops
   in and renders without extra wiring.

5. **HYENA overlay** — by design it floats over the TEWA / interceptor cards
   (`right:296px; width:372px`), exactly as in the reference. Close it via the
   X (calls `toggleHyena`); set `hyenaOpen:false` in the store for the default
   to start collapsed.

Rendering verified against the reference screenshot via server-side render +
headless screenshot; strict `tsc` passes clean.
