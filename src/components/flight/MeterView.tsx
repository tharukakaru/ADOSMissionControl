"use client";

/**
 * @module MeterView
 * @description 2x2 grid of round dial gauges (altitude, ground speed,
 * battery, heading) reading live telemetry — the "METER VIEW" panel.
 * Sits where the previous plain-number TelemetryReadout used to live;
 * the GPS/battery-bar/flight-mode status strip is preserved as-is below
 * the gauges so the deck controls and mode tooltip keep working exactly
 * as before.
 * @license GPL-3.0-only
 */

import { useState, useEffect, useRef } from "react";
import { useTelemetryLatest } from "@/hooks/use-telemetry-latest";
import { useDroneStore } from "@/stores/drone-store";
import { normalizeHeading } from "@/lib/telemetry-utils";
import { MODE_DESCRIPTIONS } from "@/components/fc/flight-modes/flight-mode-constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import type { UnifiedFlightMode } from "@/lib/protocol/types";
import { useTelemetryDeck } from "./telemetry-deck/TelemetryDeck";
import { RingGauge } from "./RingGauge";

const ALTITUDE_MAX = 120; // meters — matches the standard low-altitude operating ceiling
const SPEED_MAX = 40; // m/s
const ALTITUDE_DANGER_FRACTION = 0.1; // top 10% of the dial reads as redline
const SPEED_DANGER_FRACTION = 0.1;

function gpsFixColor(fixType: number): string {
  if (fixType >= 3) return "text-status-success";
  if (fixType === 2) return "text-status-warning";
  return "text-status-error";
}

function batteryBarColor(pct: number): string {
  if (pct <= 25) return "bg-status-error";
  if (pct <= 50) return "bg-status-warning";
  return "bg-status-success";
}

export function MeterView() {
  const pos = useTelemetryLatest("position");
  const vfr = useTelemetryLatest("vfr");
  const bat = useTelemetryLatest("battery");
  const gps = useTelemetryLatest("gps");
  const mode = useDroneStore((s) => s.flightMode);
  const { controls: deckControls, panel: deckPanel } = useTelemetryDeck();

  const alt = pos?.alt ?? vfr?.alt ?? 0;
  const speedMps = vfr?.groundspeed ?? pos?.groundSpeed ?? 0;
  const heading = normalizeHeading(pos?.heading ?? vfr?.heading ?? 0);
  const batteryPct = bat?.remaining ?? 0;
  const satellites = gps?.satellites ?? 0;
  const fixType = gps?.fixType ?? 0;

  return (
    <div className="bg-bg-secondary border-y border-border-default">
      {/* Meter view — 2x2 round dial gauges */}
      <div className="px-3 pt-2.5 pb-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
          Meter View
        </h3>
        <div className="grid grid-cols-2 gap-y-3">
          <RingGauge
            value={alt}
            min={0}
            max={ALTITUDE_MAX}
            unit="M"
            label="Altitude"
            dangerZoneFraction={ALTITUDE_DANGER_FRACTION}
          />
          <RingGauge
            value={speedMps}
            min={0}
            max={SPEED_MAX}
            unit="M/S"
            label="Gnd Speed"
            dangerZoneFraction={SPEED_DANGER_FRACTION}
          />
          <RingGauge
            value={batteryPct}
            min={0}
            max={100}
            unit="PCT"
            label="Battery"
            formatValue={(v) => Math.round(v).toString()}
          />
          <RingGauge
            value={heading}
            min={0}
            max={360}
            unit="DEG"
            label="Heading"
            formatValue={(v) => Math.round(v).toString()}
          />
        </div>
      </div>

      {/* Status bar — GPS, battery, mode, deck controls (unchanged from
          the previous text-grid readout) */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-t border-border-default text-[10px] font-mono">
        {/* GPS */}
        <div className="flex items-center gap-1">
          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", fixType >= 3 ? "bg-status-success" : fixType === 2 ? "bg-status-warning" : "bg-status-error")} />
          <span className={cn("tabular-nums", gpsFixColor(fixType))}>{satellites}</span>
          <span className="text-text-tertiary">SAT</span>
        </div>

        {/* Battery bar inline */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", batteryBarColor(batteryPct))}
              style={{ width: `${Math.max(batteryPct, 2)}%` }}
            />
          </div>
          <span className={cn("tabular-nums", batteryPct <= 25 ? "text-status-error" : batteryPct <= 50 ? "text-status-warning" : "text-text-secondary")}>
            {Math.round(batteryPct)}%
          </span>
        </div>

        {/* Flight mode + deck controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ModeLabel mode={mode} />
          {deckControls}
        </div>
      </div>

      {/* Expandable telemetry deck — full width below status bar */}
      {deckPanel}
    </div>
  );
}

function ModeLabel({ mode }: { mode: string }) {
  const [show, setShow] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const prevModeRef = useRef(mode);
  const { toast } = useToast();
  const desc = MODE_DESCRIPTIONS[mode as UnifiedFlightMode];

  useEffect(() => {
    if (prevModeRef.current !== mode && prevModeRef.current !== "") {
      setHighlight(true);
      toast(`Mode changed: ${prevModeRef.current} -> ${mode}`, "info");
      const timer = setTimeout(() => setHighlight(false), 1500);
      prevModeRef.current = mode;
      return () => clearTimeout(timer);
    }
    prevModeRef.current = mode;
  }, [mode, toast]);

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span
        className={cn(
          "font-semibold uppercase cursor-default transition-colors duration-300",
          highlight ? "text-status-success" : "text-text-secondary",
        )}
        style={highlight ? {
          animation: "mode-pulse 1.5s ease-out",
          textShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
        } : undefined}
      >
        {mode}
      </span>
      {show && desc && (
        <div className="absolute right-0 bottom-full mb-1 z-50 bg-bg-tertiary border border-border-default px-2 py-1.5 text-[10px] text-text-secondary whitespace-nowrap">
          {desc}
        </div>
      )}
    </div>
  );
}
