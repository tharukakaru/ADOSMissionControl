"use client";

/**
 * @module C2HealthPanel
 * @description Floating glass health/loadout stack shown at the top-left of the
 * Fly view, matching the ARC OS HYENA target. Rendered as THREE separate
 * translucent layers with a small gap between them, as in the mockup:
 *   1. HEALTH  — sensor-dot grid
 *   2. STATS   — HEALTH / VOLTAGE / GPS SATS / FIX TYPE as a grouped 2×2 grid
 *   3. LOADOUT — loadout line with edit
 * Values come from the Fly view's live telemetry; everything has a static
 * fallback so the stack renders even before first frame.
 *
 * Redesign note: three separate stacked cards with gaps between the layers.
 * The HEALTH and LOADOUT headers each have a thin gray divider line beneath
 * them; the four stats are grouped inside a single card (not boxed squares).
 * @license GPL-3.0-only
 */

interface SensorDot {
  label: string;
  ok?: boolean;
}

interface C2HealthPanelProps {
  health?: number; // 0-100
  voltage?: number; // volts
  gpsSats?: number;
  fixType?: string; // e.g. "3D"
  loadout?: string; // e.g. "2× ISR · 1× EO/IR pod"
  sensors?: SensorDot[];
  onEditLoadout?: () => void;
}

const DEFAULT_SENSORS: SensorDot[] = [
  { label: "Gyro", ok: true },
  { label: "Accel", ok: true },
  { label: "Compass", ok: true },
  { label: "Baro", ok: true },
  { label: "GPS", ok: true },
  { label: "Motors", ok: true },
  { label: "RC", ok: true },
  { label: "BARS", ok: true },
];

// Shared card shell for each layer.
const LAYER =
  "rounded-md border border-[var(--redesign-border)] bg-[var(--redesign-bg-black)]/85 backdrop-blur-sm shadow-lg overflow-hidden";

// Thin gray divider under a section header.
const HEADER_DIVIDER =
  "pb-1.5 mb-1.5 border-b border-[var(--redesign-border)]/60";

function StatCell({
  value,
  unit,
  label,
  className = "",
}: {
  value: string;
  unit?: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={"px-3 py-2 " + className}>
      <div className="text-sm font-mono font-semibold text-[var(--redesign-text-primary)] leading-none tabular-nums">
        {value}
        {unit && <span className="text-[10px] text-[var(--redesign-text-secondary)] ml-0.5">{unit}</span>}
      </div>
      <div className="text-[9px] uppercase tracking-wider text-[var(--redesign-text-secondary)] mt-1">{label}</div>
    </div>
  );
}

export function C2HealthPanel({
  health = 95,
  voltage = 10.4,
  gpsSats = 18,
  fixType = "3D",
  loadout = "2× ISR · 1× EO/IR pod",
  sensors = DEFAULT_SENSORS,
  onEditLoadout,
}: C2HealthPanelProps) {
  const hair = "border-[var(--redesign-border)]/60";
  return (
    <div className="pointer-events-auto w-[200px] flex flex-col gap-1.5">
      {/* Layer 1 — HEALTH header + sensor dot grid */}
      <div className={LAYER + " px-3 pt-2.5 pb-2"}>
        <div
          className={
            "text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--redesign-text-secondary)] " +
            HEADER_DIVIDER
          }
        >
          Health
        </div>
        <div className="grid grid-cols-3 gap-x-1 gap-y-1 text-[9px] font-mono">
          {sensors.map((s) => (
            <span
              key={s.label}
              className="flex items-center gap-1 text-[var(--redesign-text-secondary)] whitespace-nowrap"
            >
              <span
                className={
                  "inline-block w-1.5 h-1.5 rounded-full shrink-0 " +
                  (s.ok ? "bg-status-success" : "bg-status-error")
                }
              />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Layer 2 — grouped stats (2×2, hairline-divided, no separate boxes) */}
      <div className={LAYER}>
        <div className="grid grid-cols-2">
          <StatCell value={`${Math.round(health)}%`} label="Health" className={"border-b border-r " + hair} />
          <StatCell value={voltage.toFixed(1)} unit="v" label="Voltage" className={"border-b " + hair} />
          <StatCell value={`${gpsSats}`} label="GPS Sats" className={"border-r " + hair} />
          <StatCell value={fixType} label="Fix Type" />
        </div>
      </div>

      {/* Layer 3 — LOADOUT */}
      <div className={LAYER + " px-3 py-2"}>
        <div className={"flex items-center justify-between " + HEADER_DIVIDER}>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--redesign-text-secondary)]">
            Loadout
          </span>
          <button
            type="button"
            onClick={onEditLoadout}
            className="text-[9px] text-[var(--redesign-yellow)] hover:opacity-80 transition-opacity"
          >
            edit·
          </button>
        </div>
        <div className="text-[10px] font-mono text-[var(--redesign-text-secondary)]">{loadout}</div>
      </div>
    </div>
  );
}
