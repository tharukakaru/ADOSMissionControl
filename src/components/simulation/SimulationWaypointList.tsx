/**
 * @module SimulationWaypointList
 * @description Active waypoint card and waypoint progress list with leg
 * durations. Pure presentational; receives interpolated position state and
 * seek callback from the parent.
 *
 * VISUAL REDESIGN NOTE: Active waypoint card now shows ALTITUDE / TARGET
 * (top row) and SPEED / HEADING (bottom row) with a "WP n/total" badge in
 * the corner, matching SIMULATE.png. "TARGET" is mapped to the waypoint's
 * acceptance radius (wp.param2, MAVLink convention) since the redesign
 * doesn't label its unit — confirm this is the intended field with product/
 * design before shipping.
 *
 * The waypoint progress list now shows each waypoint's outgoing leg
 * duration (time to the next waypoint) instead of "ETA to reach this
 * waypoint": completed legs show their planned duration, the active leg
 * shows a live-ticking elapsed time, and legs not yet reached show "–" —
 * this matches the 00:30 / 00:30 / 00:18 / "–" pattern in the redesign.
 * @license GPL-3.0-only
 */

"use client";

import { useTranslations } from "next-intl";
import type { Waypoint } from "@/lib/types";
import type { InterpolatedPosition } from "@/lib/simulation-utils";
import { formatEta } from "@/lib/simulation-utils";
import { formatAlt } from "@/lib/telemetry-utils";
import { cn } from "@/lib/utils";

interface SimulationWaypointListProps {
  waypoints: Waypoint[];
  pos: InterpolatedPosition;
  elapsed: number;
  cumulativeTimes: number[];
  playbackState: string;
  onSeekToWaypoint: (wpIndex: number) => void;
}

export function SimulationWaypointList({
  waypoints,
  pos,
  elapsed,
  cumulativeTimes,
  playbackState,
  onSeekToWaypoint,
}: SimulationWaypointListProps) {
  const t = useTranslations("simulate");
  const currentWp = waypoints.length >= 2 ? waypoints[pos.currentWaypointIndex] : null;
  const targetRadius = currentWp?.param2 ?? 2.0;

  return (
    <>
      {/* Active waypoint card */}
      {currentWp && (
        <div className="px-3 py-2.5 border-b border-[var(--redesign-border)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">
              {t("activeWaypoint")}
            </h3>
            <span className="text-[9px] font-mono font-semibold text-[var(--redesign-yellow)] bg-[var(--redesign-yellow)]/12 px-1.5 py-0.5 rounded">
              WP {pos.currentWaypointIndex + 1} / {waypoints.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <div>
              <p className="text-sm font-mono font-semibold text-[var(--redesign-text-primary)]">{formatAlt(currentWp.alt)}</p>
              <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">{t("alt")}</span>
            </div>
            <div>
              <p className="text-sm font-mono font-semibold text-[var(--redesign-text-primary)]">{targetRadius.toFixed(2)}</p>
              <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">Target</span>
            </div>
            <div>
              <p className="text-sm font-mono font-semibold text-[var(--redesign-text-primary)]">{pos.speed.toFixed(1)} m/s</p>
              <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">{t("speedLabel")}</span>
            </div>
            <div>
              <p className="text-sm font-mono font-semibold text-[var(--redesign-text-primary)]">{Math.round(pos.heading)}&deg;</p>
              <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">{t("headingLabel")}</span>
            </div>
          </div>
          {playbackState !== "playing" && (
            <span className="mt-2 inline-block text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase">
              {playbackState}
            </span>
          )}
        </div>
      )}

      {/* Waypoint progress list with leg durations */}
      <div className="px-3 py-2.5 border-b border-[var(--redesign-border)]">
        <h3 className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mb-2">
          {t("waypointProgress")}
        </h3>
        <div className="space-y-0.5">
          {waypoints.map((wp, i) => {
            const isCurrent = i === pos.currentWaypointIndex;
            const isCompleted = i < pos.currentWaypointIndex;
            const legStart = i > 0 ? cumulativeTimes[i - 1] ?? 0 : 0;
            const legEnd = cumulativeTimes[i];
            const hasOutgoingLeg = legEnd !== undefined;

            let legLabel: string;
            if (!hasOutgoingLeg) {
              legLabel = "–";
            } else if (isCompleted) {
              legLabel = formatEta(legEnd - legStart);
            } else if (isCurrent) {
              legLabel = formatEta(Math.max(0, elapsed - legStart));
            } else {
              legLabel = "–";
            }

            return (
              <button
                key={wp.id}
                onClick={() => onSeekToWaypoint(i)}
                className={cn(
                  "w-full flex items-center gap-2 px-1.5 py-1.5 rounded text-left transition-colors cursor-pointer",
                  isCurrent ? "bg-[var(--redesign-yellow)]/12" : "hover:bg-white/5"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-semibold",
                    isCurrent
                      ? "bg-[var(--redesign-yellow)] text-[var(--redesign-bg-black)]"
                      : isCompleted
                        ? "bg-[var(--redesign-teal)] text-[var(--redesign-text-primary)]"
                        : "text-[var(--redesign-text-secondary)]"
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-mono text-[var(--redesign-text-primary)] flex-1">
                  WP {i + 1}
                </span>
                <span className="text-[10px] font-mono text-[var(--redesign-text-secondary)]">
                  {legLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
