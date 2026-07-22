"use client";

/**
 * @module FlyViewInstrumentStrip
 * @description The compact telemetry header shown on the Fly/Map row of the
 * drone Overview tab, matching the ARC OS HYENA target: mission state, clock,
 * link latency, RTH distance, a P(osition-hold) lock badge, mode, params,
 * satellites, heading, and horizontal altitude + battery bars.
 *
 * Live fields (mode, link ms, sats, heading, altitude, battery) come from the
 * telemetry hooks. Clock, RTH distance and PARAMS are display placeholders that
 * match the target mock — wire them to your own sources when ready (see the
 * CLOCK_DEMO / RTH_DEMO / PARAMS_DEMO consts below).
 * @license GPL-3.0-only
 */

import { Plane, Lock, Pause } from "lucide-react";
import { useTelemetryLatest } from "@/hooks/use-telemetry-latest";
import { useDroneStore } from "@/stores/drone-store";
import { useConnectionQuality } from "@/hooks/use-connection-quality";
import { normalizeHeading } from "@/lib/telemetry-utils";

const ALTITUDE_MAX = 120; // metres, full-scale for the altitude bar
const CLOCK_DEMO = "T+00:00";
const RTH_DEMO = "0.1 km";
const PARAMS_DEMO = "Quad+SITL";

function Field({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col leading-none">
      <span className="text-[8px] uppercase tracking-wider text-[var(--redesign-text-secondary)]">{label}</span>
      <span className={"text-[11px] font-mono font-semibold mt-0.5 " + (valueClass ?? "text-[var(--redesign-text-primary)]")}>
        {value}
      </span>
    </div>
  );
}

function Bar({ label, pct, value, barClass }: { label: string; pct: number; value: string; barClass: string }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <span className="text-[8px] uppercase tracking-wider text-[var(--redesign-text-secondary)] shrink-0">{label}</span>
      <div className="relative flex-1 h-1.5 rounded-full bg-[var(--redesign-border)]/50 overflow-hidden min-w-[60px]">
        <div className={"absolute inset-y-0 left-0 rounded-full " + barClass} style={{ width: `${clamped}%` }} />
      </div>
      <span className="text-[11px] font-mono font-semibold text-[var(--redesign-text-primary)] tabular-nums shrink-0">{value}</span>
    </div>
  );
}

export function FlyViewInstrumentStrip() {
  const pos = useTelemetryLatest("position");
  const vfr = useTelemetryLatest("vfr");
  const gps = useTelemetryLatest("gps");
  const bat = useTelemetryLatest("battery");
  const flightMode = useDroneStore((s) => s.flightMode);
  const { latencyMs } = useConnectionQuality();

  const heading = normalizeHeading(pos?.heading ?? vfr?.heading ?? 0);
  const sats = gps?.satellites ?? 0;
  const alt = pos?.alt ?? vfr?.alt ?? 0;
  const batteryPct = bat?.remaining ?? 0;

  return (
    <div className="flex items-center gap-3 min-w-0 flex-1 overflow-x-auto pr-2 scrollbar-none">
      {/* Mission state */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Plane size={13} className="text-[var(--redesign-yellow)]" />
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-status-success">
          In Mission
        </span>
      </div>

      <div className="h-5 w-px bg-border-default shrink-0" />

      <div className="flex items-center gap-3 shrink-0">
        <Field label="Clock" value={CLOCK_DEMO} />
        <Field label="Link" value={`${Math.round(latencyMs)} ms`} />
        <Field label="RTH" value={RTH_DEMO} />
        {/* Lock + Position-hold (P) + Pause trio, like the target */}
        <div className="flex items-center gap-1 shrink-0">
          <Lock size={12} className="text-[var(--redesign-text-secondary)]" />
          <span className="flex items-center justify-center w-5 h-5 rounded bg-[var(--redesign-yellow)] text-[var(--redesign-bg-black)] text-[10px] font-mono font-bold">
            P
          </span>
          <Pause size={12} className="text-[var(--redesign-text-secondary)]" />
        </div>
        <Field label="Mode" value={flightMode} />
        <Field label="Params" value={PARAMS_DEMO} valueClass="text-[var(--redesign-yellow)]" />
        <Field label="Satellites" value={`${sats} SAT`} />
        <Field label="Heading" value={`${heading.toString().padStart(3, "0")}°`} />
      </div>

      <div className="h-5 w-px bg-border-default shrink-0" />

      {/* Bars take the remaining width */}
      <div className="flex items-center gap-4 flex-1 min-w-[200px]">
        <Bar label="Altitude" pct={(alt / ALTITUDE_MAX) * 100} value={alt.toFixed(1)} barClass="bg-[var(--redesign-yellow)]" />
        <Bar
          label="Battery"
          pct={batteryPct}
          value={`${Math.round(batteryPct)}%`}
          barClass={batteryPct <= 25 ? "bg-status-error" : "bg-status-success"}
        />
      </div>
    </div>
  );
}
