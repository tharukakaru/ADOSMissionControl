"use client";

/**
 * FlyViewDroneCard — FLEET sidebar card (ARC OS redesign).
 * Status LABEL is driven purely by drone.status (not arm state), so
 * in-mission drones read "IN MISSION", not "READY/ARMED".
 */

import { cn } from "@/lib/utils";
import type { FleetDrone, DroneStatus } from "@/lib/types";

// Label TEXT — status only (uppercased by CSS).
const statusLabel: Record<DroneStatus, string> = {
  online: "Ready/Armed",
  in_mission: "In Mission",
  idle: "Standby",
  returning: "RTL/Returning",
  maintenance: "Maintenance",
  offline: "Offline",
};

// State COLOR — shared by the dot and the label.
function stateColor(status: DroneStatus): string {
  switch (status) {
    case "in_mission":
      return "var(--redesign-cyan)";
    case "online":
      return "var(--redesign-green)";
    case "returning":
      return "#f9ae27"; // amber
    case "maintenance":
      return "var(--redesign-red)";
    default:
      return "var(--redesign-text-secondary)"; // idle / offline
  }
}

// Battery COLOR — bar fill + percent.
function batteryColor(pct: number): string {
  const c = Math.max(0, Math.min(100, pct));
  if (c > 50) return "var(--redesign-green)";
  if (c > 25) return "var(--redesign-yellow)";
  return "var(--redesign-red)";
}

interface FlyViewDroneCardProps {
  drone: FleetDrone;
  selected?: boolean;
  onClick?: (id: string) => void;
}

export function FlyViewDroneCard({ drone, selected, onClick }: FlyViewDroneCardProps) {
  const displayName = drone.name;
  const battery = Math.max(0, Math.min(100, drone.battery?.remaining ?? 0));

  const statusLine = drone.suiteName
    ? `${drone.suiteName}`
    : `${drone.flightMode} · ${statusLabel[drone.status]}`;

  const color = stateColor(drone.status);
  const barColor = batteryColor(battery);

  return (
    <button
      type="button"
      onClick={() => onClick?.(drone.id)}
      className={cn(
        "w-full text-left px-2.5 py-2 border-t border-r border-b transition-colors cursor-pointer",
        selected
          ? "border-l-4 border-l-[var(--redesign-yellow)] border-t-[var(--redesign-yellow)]/40 border-r-[var(--redesign-yellow)]/40 border-b-[var(--redesign-yellow)]/40 bg-[var(--redesign-yellow)]/10"
          : "border-l-4 border-l-transparent border-[var(--redesign-border)] bg-[var(--redesign-bg-panel)] hover:bg-[var(--redesign-border)]/30",
      )}
    >
      {/* status dot + name */}
      <div className="flex items-center gap-1.5 mb-1 min-w-0">
        <span
          className="inline-block w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          title={statusLabel[drone.status]}
        />
        <span
          className={cn(
            "font-display font-medium text-[13px] leading-tight uppercase tracking-[0.22em] whitespace-nowrap",
            selected ? "text-[var(--redesign-yellow)]" : "text-[var(--redesign-text-primary)]",
          )}
        >
          {displayName}
        </span>
      </div>

      {/* status label (same color as the dot) */}
      <div className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color }}>
        {statusLabel[drone.status]}
      </div>

      {/* progress bar */}
      <div className="h-[3px] w-full bg-[var(--redesign-border)] mb-1.5 overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${battery}%`, backgroundColor: barColor }} />
      </div>

      {/* mission line + percent */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-[var(--redesign-text-secondary)] truncate">{statusLine}</span>
        <span className="text-[10px] font-mono font-semibold tabular-nums shrink-0" style={{ color: barColor }}>
          {Math.round(battery)}%
        </span>
      </div>
    </button>
  );
}
