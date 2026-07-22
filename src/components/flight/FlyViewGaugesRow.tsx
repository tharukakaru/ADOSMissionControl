"use client";

/**
 * @module FlyViewGaugesRow
 * @description Floating instrument cluster overlaying the bottom of the Fly view
 * feed (ARC OS HYENA target). Laid out as three non-wrapping zones so the cards
 * never collide: LEFT (minimap, compass, altitude, voltage), CENTER (large
 * ground-speed gauge), RIGHT (next-waypoint card, battery, signal/telemetry).
 * Transparent background + a soft bottom gradient so it reads over the feed.
 * @license GPL-3.0-only
 */

import { ArrowUp, WifiOff } from "lucide-react";
import { useTelemetryLatest } from "@/hooks/use-telemetry-latest";
import { useDroneStore } from "@/stores/drone-store";
import { useMissionStore } from "@/stores/mission-store";
import { useConnectionQuality } from "@/hooks/use-connection-quality";
import { normalizeHeading } from "@/lib/telemetry-utils";
import { cn } from "@/lib/utils";
import { RingGauge } from "./RingGauge";

const ALTITUDE_MAX = 120;
const SPEED_MAX = 40;
const VOLTAGE_MAX = 17;

function Compass({ heading }: { heading: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-[88px] h-[88px] shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-status-success/60" strokeWidth="1.5" />
          {["N", "E", "S", "W"].map((label, i) => {
            const angle = i * 90;
            const rad = (angle * Math.PI) / 180;
            const x = 50 + 36 * Math.sin(rad);
            const y = 50 - 36 * Math.cos(rad);
            return (
              <text key={label} x={x} y={y} fontSize="9" fontWeight="700" textAnchor="middle" dominantBaseline="middle" fill="currentColor"
                className={label === "N" ? "text-status-error font-mono" : "text-text-secondary font-mono"}>
                {label}
              </text>
            );
          })}
          <g transform={`rotate(${heading} 50 50)`}>
            <polygon points="50,12 46,50 50,44 54,50" fill="currentColor" className="text-brand-arc" />
          </g>
        </svg>
      </div>
      <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">Compass</span>
      <span className="text-xs font-mono text-text-primary">{Math.round(heading)}°</span>
    </div>
  );
}

function MiniMap() {
  return (
    <div className="w-44 h-28 rounded-lg border border-border-default bg-bg-tertiary/30 overflow-hidden relative shadow-lg">
      <img src="/c2/thermal-bg.png" alt="" className="w-full h-full object-cover opacity-70" />
      <div className="absolute bottom-3 left-3">
        <div className="w-3 h-3 border-2 border-brand-arc rotate-45" />
      </div>
    </div>
  );
}

export function FlyViewGaugesRow() {
  const pos = useTelemetryLatest("position");
  const vfr = useTelemetryLatest("vfr");
  const bat = useTelemetryLatest("battery");
  const wind = useTelemetryLatest("wind");
  const navController = useTelemetryLatest("navController");
  const armState = useDroneStore((s) => s.armState);
  const flightMode = useDroneStore((s) => s.flightMode);
  const currentWp = useMissionStore((s) => s.currentWaypoint);
  const totalWp = useMissionStore((s) => s.waypoints.length);
  const { quality } = useConnectionQuality();

  const alt = pos?.alt ?? vfr?.alt ?? 0;
  const speedMps = vfr?.groundspeed ?? pos?.groundSpeed ?? 0;
  const heading = normalizeHeading(pos?.heading ?? vfr?.heading ?? 0);
  const voltage = bat?.voltage ?? 0;
  const batteryPct = bat?.remaining ?? 0;
  const airspeed = vfr?.airspeed ?? 0;
  const windSpeed = wind?.speed ?? 0;
  const wpDist = navController?.wpDist ?? 0;
  const wpBearing = navController?.targetBearing ?? heading;
  const hasSignal = quality !== "lost" && quality !== "unknown";

  return (
    <div className="relative w-full pt-20 bg-gradient-to-t from-[#05080f]/85 via-[#05080f]/35 to-transparent">
      {/* ARMED · MODE · WP — centered, above the gauges */}
      <div className="flex items-center justify-center pb-10">
        <div className={cn(
          "flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#0a0c10]/70 backdrop-blur-sm text-[10px] font-mono font-bold uppercase tracking-wider",
          armState === "armed" ? "text-status-success" : "text-text-tertiary",
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full", armState === "armed" ? "bg-status-success" : "bg-text-tertiary")} />
          {armState} · {flightMode}
          <span className="text-text-tertiary ml-2">WP {currentWp} / {totalWp || 11}</span>
        </div>
      </div>

      {/* Three non-wrapping zones */}
      <div className="flex items-end justify-between gap-6 px-8 pb-4 flex-nowrap">
        {/* LEFT */}
        <div className="flex items-end gap-6 shrink-0">
          <MiniMap />
          <Compass heading={heading} />
          <RingGauge value={alt} min={0} max={ALTITUDE_MAX} unit="m" label="Altitude" colorClass="text-sky-400" />
          <RingGauge value={voltage} min={0} max={VOLTAGE_MAX} unit="V" label="Voltage" formatValue={(v) => v.toFixed(1)} colorClass="text-status-success" />
        </div>

        {/* CENTER — large ground-speed gauge in a reserved-height box */}
        <div className="shrink-0 h-[180px] w-[180px] flex items-end justify-center mx-2">
          <div className="origin-bottom scale-[1.55]">
            <RingGauge value={speedMps} min={0} max={SPEED_MAX} unit="m/s" label="Ground Speed" dangerZoneFraction={0.1} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-end gap-6 shrink-0">
          <RingGauge value={batteryPct} min={0} max={100} unit="%" label="Battery" formatValue={(v) => Math.round(v).toString()} dangerZoneFraction={0.25} colorClass="text-orange-400" />

          {/* Next waypoint card */}
          <div className="border border-border-default bg-[#0a0c10]/75 backdrop-blur-sm rounded-md px-4 py-3 flex flex-col items-center gap-1 mb-2">
            <ArrowUp size={18} className="text-brand-arc" style={{ transform: `rotate(${wpBearing}deg)` }} />
            <div className="text-2xl font-mono font-bold text-text-primary leading-none">
              {Math.round(wpDist)}<span className="text-xs text-text-tertiary ml-0.5">m</span>
            </div>
            <div className="text-[10px] text-text-tertiary">Next waypoint</div>
            <div className="text-[10px] text-brand-arc font-mono">HDG {Math.round(wpBearing)}°</div>
          </div>

          {/* Signal + telemetry */}
          <div className="flex flex-col items-start gap-2 mb-2">
            {!hasSignal ? (
              <div className="flex items-center gap-2 text-status-error">
                <WifiOff size={18} />
                <div>
                  <div className="text-xl font-bold uppercase leading-none">No</div>
                  <div className="text-xl font-bold uppercase leading-none">Signal</div>
                </div>
              </div>
            ) : (
              <div className="text-[10px] font-mono text-status-success">● LINKED</div>
            )}
            <div className="border border-border-default bg-[#0a0c10]/75 backdrop-blur-sm rounded-md px-3 py-2 w-44">
              <div className="text-[9px] font-mono text-text-tertiary uppercase tracking-wider mb-1.5">Telemetry</div>
              <div className="flex flex-col gap-1 text-[10px] font-mono">
                <TelRow label="Ground distance" value="1.76 km" />
                <TelRow label="Wind speed" value={`${windSpeed.toFixed(1)} m/s`} />
                <TelRow label="Air speed" value={`${airspeed.toFixed(1)} m/s`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-text-tertiary">{label}</span>
      <span className="text-text-primary font-semibold">{value}</span>
    </div>
  );
}
