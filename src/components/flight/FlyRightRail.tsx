"use client";

/**
 * @module FlyRightRail
 * @description The right-hand telemetry + control rail of the Fly view (ARC OS
 * HYENA target). Stacks, top to bottom: status chips, NO-SIGNAL + large
 * ground-speed gauge, the DISTANCE/AIR-TIME/HOME/ETA row, a 2x2 gauge grid
 * (altitude/battery/voltage/compass), next-waypoint + telemetry + loadout cards,
 * a GPS/HEALTH/VOLTAGE/FIX row, the action buttons, and the Flight Logs panel.
 * Reuses RingGauge, ActionDialogs and DroneLogsPanel so behaviour matches the
 * rest of the app.
 * @license GPL-3.0-only
 */

import { useState } from "react";
import { Home, ArrowDownToLine, ArrowUpFromLine, Power, ArrowUp, ArrowDownLeft } from "lucide-react";
import { useTelemetryLatest } from "@/hooks/use-telemetry-latest";
import { useDroneStore } from "@/stores/drone-store";
import { useDroneManager } from "@/stores/drone-manager";
import { useMissionStore } from "@/stores/mission-store";
import { useUiStore } from "@/stores/ui-store";
import { useConnectionQuality } from "@/hooks/use-connection-quality";
import { normalizeHeading } from "@/lib/telemetry-utils";
import { cn } from "@/lib/utils";
import { RingGauge } from "./RingGauge";
import { ActionDialogs } from "./action-dialogs";
import { FlightModeSelector } from "@/components/shared/flight-mode-selector";
import { DroneLogsPanel } from "@/components/drone-detail/DroneLogsPanel";
import type { FleetDrone } from "@/lib/types";

const ALTITUDE_MAX = 120;
const SPEED_MAX = 40;
const VOLTAGE_MAX = 17;

function Chip({ label, dotClass = "bg-status-success", textClass = "text-[var(--redesign-text-secondary)]" }: { label: string; dotClass?: string; textClass?: string }) {
  return (
    <span className={cn("flex items-center gap-1.5 text-[10px] font-mono", textClass)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dotClass)} />
      {label}
    </span>
  );
}

function Stat({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-mono font-bold text-[var(--redesign-text-primary)] tabular-nums leading-none">
        {value}{unit && <span className="text-[10px] text-[var(--redesign-text-secondary)] ml-0.5">{unit}</span>}
      </div>
      <div className="text-[8px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function CompassDial({ heading }: { heading: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[102px] h-[102px]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-status-success/70" strokeWidth="2" />
          {["N", "E", "S", "W"].map((l, i) => {
            const a = (i * 90 * Math.PI) / 180;
            return (
              <text key={l} x={50 + 34 * Math.sin(a)} y={50 - 34 * Math.cos(a)} fontSize="9" fontWeight="700"
                textAnchor="middle" dominantBaseline="middle" fill="currentColor"
                className={l === "N" ? "text-status-error font-mono" : "text-[var(--redesign-text-secondary)] font-mono"}>{l}</text>
            );
          })}
          <g transform={`rotate(${heading} 50 50)`}>
            <polygon points="50,14 46,50 50,45 54,50" fill="currentColor" className="text-[var(--redesign-yellow)]" />
          </g>
        </svg>
      </div>
      <span className="text-[10px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">Compass</span>
      <span className="text-xs font-mono text-[var(--redesign-text-primary)]">{Math.round(heading)}°</span>
    </div>
  );
}

function ActBtn({ label, icon, variant, onClick }: { label: string; icon?: React.ReactNode; variant: "red" | "red-solid" | "yellow" | "green"; onClick: () => void }) {
  const map = {
    // VISUAL REDESIGN NOTE: per your reference crop, ABORT/KILL are the
    // tinted-outline style, while LAND/TAKEOFF/RTH are solid filled (same
    // treatment DISARM already got). That's a real distinction in the
    // source image, not a mistake — rare/rarely-needed destructive actions
    // (Abort, Kill) stay understated; the common flight-control actions
    // (Land, Disarm, Takeoff, RTH) are the bold solid buttons.
    red: "border-status-error/50 bg-status-error/10 text-status-error hover:bg-status-error/20",
    "red-solid": "border-transparent bg-status-error text-white font-extrabold hover:opacity-90",
    yellow: "border-transparent bg-[var(--redesign-yellow)] text-[var(--redesign-bg-black)] font-extrabold hover:opacity-90",
    green: "border-transparent bg-status-success text-[var(--redesign-bg-black)] font-extrabold hover:opacity-90",
  };
  return (
    <button onClick={onClick} className={cn("flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border transition-colors", map[variant])}>
      {icon} {label}
    </button>
  );
}

export function FlyRightRail({ drone }: { drone: FleetDrone }) {
  const pos = useTelemetryLatest("position");
  const vfr = useTelemetryLatest("vfr");
  const bat = useTelemetryLatest("battery");
  const gps = useTelemetryLatest("gps");
  const wind = useTelemetryLatest("wind");
  const navController = useTelemetryLatest("navController");
  const armState = useDroneStore((s) => s.armState);
  const flightMode = useDroneStore((s) => s.flightMode);
  const setFlightMode = useDroneStore((s) => s.setFlightMode);
  const getProtocol = useDroneManager((s) => s.getSelectedProtocol);
  const currentWp = useMissionStore((s) => s.currentWaypoint);
  const totalWp = useMissionStore((s) => s.waypoints.length);
  const { quality, latencyMs } = useConnectionQuality();
  const immersiveMode = useUiStore((s) => s.immersiveMode);
  const enterImmersiveMode = useUiStore((s) => s.enterImmersiveMode);
  const exitImmersiveMode = useUiStore((s) => s.exitImmersiveMode);

  const protocol = getProtocol();
  const isArmed = armState === "armed";

  const alt = pos?.alt ?? vfr?.alt ?? 0;
  const speedMps = vfr?.groundspeed ?? pos?.groundSpeed ?? 0;
  const heading = normalizeHeading(pos?.heading ?? vfr?.heading ?? 0);
  const voltage = bat?.voltage ?? 0;
  const batteryPct = bat?.remaining ?? 0;
  const airspeed = vfr?.airspeed ?? 0;
  const windSpeed = wind?.speed ?? 0;
  const sats = gps?.satellites ?? 0;
  const wpDist = navController?.wpDist ?? 0;
  const wpBearing = navController?.targetBearing ?? heading;
  const hasSignal = quality !== "lost" && quality !== "unknown";

  const [showArmConfirm, setShowArmConfirm] = useState(false);
  const [showDisarmConfirm, setShowDisarmConfirm] = useState(false);
  const [showRthConfirm, setShowRthConfirm] = useState(false);
  const [showTakeoffConfirm, setShowTakeoffConfirm] = useState(false);
  const [showLandConfirm, setShowLandConfirm] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [showKillConfirm, setShowKillConfirm] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  return (
    <div className="w-[420px] shrink-0 flex flex-col h-full overflow-y-auto bg-[var(--redesign-bg-panel)] border-l border-[var(--redesign-border)]">
      {/* Status chips */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--redesign-border)] flex-wrap">
        <Chip label={`${sats} SAT`} />
        <Chip label={`${armState} · ${flightMode}`.toUpperCase()} dotClass={isArmed ? "bg-status-success" : "bg-text-tertiary"} />
        <Chip label={`LINK ${Math.round(latencyMs)}ms`} />
        <span className="text-[10px] font-mono text-[var(--redesign-text-secondary)] ml-auto">WP {currentWp} / {totalWp || 11}</span>
      </div>

      {/* NO SIGNAL / LINKED + big centered ground speed gauge.
          VISUAL REDESIGN NOTE: the signal status used to be a flex sibling
          of the gauge with justify-between, which pushed the gauge to the
          far right edge instead of the row center, and used a CSS
          transform:scale(1.05) to fake a "bigger" gauge (barely visible,
          and transforms don't reflow layout). Fixed: signal status is now
          an absolutely-positioned label over the gauge's own container
          (matches the redesign, where it reads as an inset corner label,
          not a competing flex item), and the gauge uses RingGauge's new
          `size` prop for a real, meaningfully bigger primary gauge. */}
      <div className="relative flex justify-center px-4 pt-2">
        <div className="absolute left-4 top-2">
          {!hasSignal ? (
            <div className="flex items-start gap-2 text-status-error">
              <span className="text-[10px]">◣</span>
              <div className="text-2xl font-bold uppercase leading-tight">No<br />Signal</div>
            </div>
          ) : (
            <div className="text-[11px] font-mono text-status-success">● LINKED</div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <RingGauge value={speedMps} min={0} max={SPEED_MAX} unit="m/s" label="" size={150} dangerZoneFraction={0.12} />
          <span className="text-[11px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mt-0.5">Ground Speed</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-1 px-4 py-2 border-b border-[var(--redesign-border)]">
        <Stat value="1.204" label="Distance · km" />
        <Stat value="38:24" label="Air time · mm:ss" />
        <Stat value="0.1" label="Home · km" />
        <Stat value="00:25" label="ETA · mm:ss" />
      </div>

      {/* 2x2 gauge grid */}
      <div className="grid grid-cols-2 gap-y-1 justify-items-center px-4 py-2">
        <RingGauge value={alt} min={0} max={ALTITUDE_MAX} unit="m" label="Altitude" colorClass="text-sky-400" />
        <RingGauge value={batteryPct} min={0} max={100} unit="%" label="Battery" formatValue={(v) => Math.round(v).toString()} dangerZoneFraction={0.25} colorClass="text-orange-400" />
        <RingGauge value={voltage} min={0} max={VOLTAGE_MAX} unit="v" label="Voltage" formatValue={(v) => v.toFixed(1)} colorClass="text-status-success" />
        <CompassDial heading={heading} />
      </div>

      {/* Cards: next waypoint / telemetry / loadout */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-2">
        <div className="border border-[var(--redesign-border)] bg-[var(--redesign-bg-panel)] rounded-md px-3 py-2 flex flex-col items-center justify-center">
          <ArrowUp size={16} className="text-[var(--redesign-yellow)]" style={{ transform: `rotate(${wpBearing}deg)` }} />
          <div className="text-xl font-mono font-bold text-[var(--redesign-text-primary)] leading-none mt-1">
            {Math.round(wpDist)}<span className="text-[10px] text-[var(--redesign-text-secondary)]">m</span>
          </div>
          <div className="text-[9px] text-[var(--redesign-text-secondary)] mt-0.5">Next waypoint</div>
          <div className="text-[9px] text-[var(--redesign-yellow)] font-mono">HDG {Math.round(wpBearing)}°</div>
        </div>

        <div className="border border-[var(--redesign-border)] bg-[var(--redesign-bg-panel)] rounded-md px-3 py-2">
          <div className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mb-1.5">Telemetry</div>
          <TelRow label="Ground distance" value="1.76 km" />
          <TelRow label="Wind speed" value={`${windSpeed.toFixed(1)} m/s`} />
          <TelRow label="Air speed" value={`${airspeed.toFixed(1)} m/s`} />
        </div>

        <div className="border border-[var(--redesign-border)] bg-[var(--redesign-bg-panel)] rounded-md px-3 py-2 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">Loadout</span>
            <span className="text-[9px] text-[var(--redesign-yellow)]">edit·</span>
          </div>
          <div className="text-[10px] font-mono text-[var(--redesign-text-secondary)] mt-1">2× ISR · 1× EO/IR pod</div>
          <div className="mt-auto pt-2 flex items-center gap-1 text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">
            Flight Mode
            <FlightModeSelector
              value={flightMode}
              onChange={(m) => (protocol ? protocol.setFlightMode(m) : setFlightMode(m))}
              className="h-6 text-[10px] min-w-[56px]"
            />
          </div>
        </div>
      </div>

      {/* GPS / HEALTH / VOLTAGE / FIX row */}
      <div className="grid grid-cols-4 gap-1 px-4 py-1.5 border-y border-[var(--redesign-border)]">
        <Stat value={`${sats}`} label="GPS Sats" />
        <Stat value={`${drone.healthScore ?? 95}%`} label="Health" />
        <Stat value={voltage.toFixed(1)} unit="v" label="Voltage" />
        <Stat value="3D" label="Fix Type" />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-6 gap-1.5 px-4 py-2">
        <ActBtn label="Abort" variant="red" onClick={() => setShowAbortConfirm(true)} />
        <ActBtn label="Kill" variant="red" onClick={() => setShowKillConfirm(true)} />
        <ActBtn label="Land" icon={<ArrowDownToLine size={11} />} variant="red-solid" onClick={() => setShowLandConfirm(true)} />
        <ActBtn label="Disarm" variant="yellow" onClick={() => isArmed ? setShowDisarmConfirm(true) : setShowArmConfirm(true)} />
        <ActBtn label="Takeoff" icon={<ArrowUpFromLine size={11} />} variant="green" onClick={() => setShowTakeoffConfirm(true)} />
        <ActBtn label="RTH" icon={<Home size={11} />} variant="green" onClick={() => setShowRthConfirm(true)} />
      </div>

      {/* Flight logs */}
      <div className="flex-1 min-h-[140px] flex flex-col border-t border-[var(--redesign-border)]">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--redesign-border)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--redesign-text-secondary)]">Flight Logs</span>
          <span className="ml-auto text-[9px] font-mono text-status-success">✓ Pre-Flt 0/10</span>
          <span className="flex items-center gap-1 text-[9px] font-mono font-semibold uppercase text-status-error">
            <span className="w-1.5 h-1.5 rounded-full bg-status-error animate-pulse" /> REC
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <DroneLogsPanel droneId={drone.id} />
        </div>
      </div>

      {/* Follow Me / Immersive */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--redesign-border)]">
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--redesign-text-secondary)]">
          <span className="w-6 h-3 rounded-full bg-[var(--redesign-border)] border border-[var(--redesign-border)] relative">
            <span className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-text-tertiary" />
          </span>
          Follow Me
        </span>
        <button onClick={() => (immersiveMode ? exitImmersiveMode() : enterImmersiveMode())}
          className={cn("flex items-center gap-1.5 text-[10px] font-mono", immersiveMode ? "text-[var(--redesign-yellow)]" : "text-[var(--redesign-text-secondary)]")}>
          <span className={cn("w-6 h-3 rounded-full border relative", immersiveMode ? "bg-[var(--redesign-yellow)]/30 border-[var(--redesign-yellow)]" : "bg-[var(--redesign-border)] border-[var(--redesign-border)]")}>
            <span className={cn("absolute top-0.5 w-2 h-2 rounded-full transition-all", immersiveMode ? "right-0.5 bg-[var(--redesign-yellow)]" : "left-0.5 bg-text-tertiary")} />
          </span>
          Immersive
        </button>
      </div>

      <ActionDialogs
        showArmConfirm={showArmConfirm} setShowArmConfirm={setShowArmConfirm}
        showDisarmConfirm={showDisarmConfirm} setShowDisarmConfirm={setShowDisarmConfirm}
        showRthConfirm={showRthConfirm} setShowRthConfirm={setShowRthConfirm}
        showTakeoffConfirm={showTakeoffConfirm} setShowTakeoffConfirm={setShowTakeoffConfirm}
        showLandConfirm={showLandConfirm} setShowLandConfirm={setShowLandConfirm}
        showAbortConfirm={showAbortConfirm} setShowAbortConfirm={setShowAbortConfirm}
        showKillConfirm={showKillConfirm} setShowKillConfirm={setShowKillConfirm}
        showChecklist={showChecklist} setShowChecklist={setShowChecklist}
        checklistReady={false}
        takeoffAlt="10"
      />
    </div>
  );
}

function TelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
      <span className="text-[var(--redesign-text-secondary)]">{label}</span>
      <span className="text-[var(--redesign-text-primary)] font-semibold">{value}</span>
    </div>
  );
}
