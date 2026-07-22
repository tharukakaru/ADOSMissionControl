"use client";

/**
 * @module MapHudCard
 * @description Floating mini telemetry card shown at the bottom-left of the
 * Map view. Rebuilt to match the reference crop exactly: a camera-preview
 * thumbnail with a proper target-reticle mini HUD (was a bare two-line
 * placeholder before — the missing "target" the reference called out), a
 * 4-up ALT/SPD/HDG/VS readout, and neutral (not color-coded) RTH/LAND/PAUSE
 * buttons with icon + label. Pure presentational — telemetry passed in from
 * the parent.
 * @license GPL-3.0-only
 */

import { Home, ArrowDownToLine, Pause, Play, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MapHudCardProps {
  sats?: number;
  linked?: boolean;
  mode?: string;
  alt?: number;
  speed?: number;
  heading?: number;
  vspeed?: number;
  paused?: boolean;
  onRth?: () => void;
  onLand?: () => void;
  onTogglePause?: () => void;
  /** Called when the expand icon on the camera-preview thumbnail is
   * clicked — switches the main view back to the video feed (Fly mode)
   * while staying on the map. */
  onExpand?: () => void;
}

function Cell({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-mono font-bold text-[var(--redesign-text-primary)] tabular-nums leading-none">{value}</div>
      <div className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

/**
 * Mini target-reticle HUD: heading readout, pitch-ladder-style side rails,
 * corner brackets, and a center crosshair/target — this is the piece that
 * was missing before (was just two short lines and a dot).
 */
function MiniTargetReticle({ heading }: { heading: number }) {
  return (
    <svg viewBox="0 0 160 90" className="absolute inset-0 w-full h-full">
      {/* Heading readout */}
      <text x="80" y="16" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#e3e41b">
        {String(Math.round(heading)).padStart(3, "0")}°
      </text>
      {/* Heading caret */}
      <path d="M 80 20 L 76 26 L 84 26 Z" fill="#e3e41b" />
      {/* Pitch-ladder side rails */}
      <line x1="30" y1="45" x2="60" y2="45" stroke="#3ddc84" strokeWidth="1" />
      <line x1="100" y1="45" x2="130" y2="45" stroke="#3ddc84" strokeWidth="1" />
      <line x1="30" y1="45" x2="30" y2="40" stroke="#3ddc84" strokeWidth="1" />
      <line x1="130" y1="45" x2="130" y2="40" stroke="#3ddc84" strokeWidth="1" />
      {/* Corner brackets framing the target */}
      <path d="M 62 36 L 58 36 L 58 40" fill="none" stroke="#3ddc84" strokeWidth="1" />
      <path d="M 98 36 L 102 36 L 102 40" fill="none" stroke="#3ddc84" strokeWidth="1" />
      <path d="M 62 54 L 58 54 L 58 50" fill="none" stroke="#3ddc84" strokeWidth="1" />
      <path d="M 98 54 L 102 54 L 102 50" fill="none" stroke="#3ddc84" strokeWidth="1" />
      {/* Center target/crosshair */}
      <circle cx="80" cy="45" r="4" fill="none" stroke="#3ddc84" strokeWidth="1" />
      <line x1="80" y1="41" x2="80" y2="43" stroke="#3ddc84" strokeWidth="1" />
      <line x1="80" y1="47" x2="80" y2="49" stroke="#3ddc84" strokeWidth="1" />
      <line x1="76" y1="45" x2="78" y2="45" stroke="#3ddc84" strokeWidth="1" />
      <line x1="82" y1="45" x2="84" y2="45" stroke="#3ddc84" strokeWidth="1" />
    </svg>
  );
}

export function MapHudCard({
  sats = 0,
  linked = true,
  mode = "AUTO",
  alt = 0,
  speed = 0,
  heading = 0,
  vspeed = 0,
  paused = false,
  onRth,
  onLand,
  onTogglePause,
  onExpand,
}: MapHudCardProps) {
  return (
    <div className="pointer-events-auto w-[210px] rounded-lg border border-[var(--redesign-border)] bg-[var(--redesign-bg-black)]/90 backdrop-blur-sm shadow-lg overflow-hidden">
      {/* Camera-preview thumbnail with target-reticle mini HUD */}
      <button
        onClick={onExpand}
        className="relative block w-full h-[90px] border-b border-[var(--redesign-border)] overflow-hidden cursor-pointer group"
        title="Switch to camera view"
      >
        <img src="/c2/thermal-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-opacity" draggable={false} />
        <div className="absolute inset-0 bg-[var(--redesign-bg-black)]/40" />
        <MiniTargetReticle heading={heading} />
        <span className="absolute top-1.5 left-2 text-[9px] font-mono text-[var(--redesign-text-secondary)]">1280×720</span>
        <CornerDownLeft size={12} className="absolute top-1.5 right-2 text-[var(--redesign-yellow)]" />
      </button>

      {/* Status strip */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-[var(--redesign-border)] text-[10px] font-mono text-[var(--redesign-text-secondary)]">
        <span className={cn("w-1.5 h-1.5 rounded-full", linked ? "bg-status-success" : "bg-status-error")} />
        <span>{sats} SAT</span>
        <span className="text-[var(--redesign-yellow)]">●</span>
        <span className="uppercase">{mode}</span>
        <span className="ml-auto tabular-nums">00:00</span>
      </div>

      {/* ALT / SPD / HDG / VS */}
      <div className="grid grid-cols-4 gap-1 px-2.5 py-2.5">
        <Cell value={alt.toFixed(1)} label="Alt" />
        <Cell value={speed.toFixed(1)} label="Spd" />
        <Cell value={`${Math.round(heading)}°`} label="Hdg" />
        <Cell value={vspeed.toFixed(1)} label="VS" />
      </div>

      {/* Quick actions — neutral/uniform styling per the reference, not
          color-coded like the right-rail Abort/Kill/Land buttons */}
      <div className="grid grid-cols-3 gap-1.5 px-2.5 pb-2.5">
        <button
          onClick={onRth}
          className="flex items-center justify-center gap-1 px-1.5 py-1.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider bg-[var(--redesign-border)]/40 text-[var(--redesign-text-primary)] hover:bg-[var(--redesign-border)]/60 transition-colors"
        >
          <Home size={11} /> RTH
        </button>
        <button
          onClick={onLand}
          className="flex items-center justify-center gap-1 px-1.5 py-1.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider bg-[var(--redesign-border)]/40 text-[var(--redesign-text-primary)] hover:bg-[var(--redesign-border)]/60 transition-colors"
        >
          <ArrowDownToLine size={11} /> Land
        </button>
        <button
          onClick={onTogglePause}
          className="flex items-center justify-center gap-1 px-1.5 py-1.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider bg-[var(--redesign-border)]/40 text-[var(--redesign-text-primary)] hover:bg-[var(--redesign-border)]/60 transition-colors"
        >
          {paused ? <Play size={11} /> : <Pause size={11} />} {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
