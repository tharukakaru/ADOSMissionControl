/**
 * @module SimulationStatsGrid
 * @description Mission overview stats row plus altitude and terrain profile
 * mini-charts for the simulation panel. Pure presentational; receives all
 * data from the parent.
 *
 * VISUAL REDESIGN NOTE: stats row reduced from 6 cells (2x3) to 3 cells
 * (duration / distance / speed) to match the redesign. Heading and waypoint
 * count moved into the active-waypoint card (see SimulationWaypointList).
 * The terrain profile is now a compact always-visible sparkline instead of
 * a collapsible section using the full TerrainProfileChart — that heavier
 * component (async terrain fetch + relative/AGL toggle) is intentionally
 * left untouched and still lives at src/components/planner/TerrainProfileChart.tsx
 * for use elsewhere (e.g. the Plan screen).
 * @license GPL-3.0-only
 */

"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Waypoint } from "@/lib/types";
import type { FlightPlan } from "@/lib/simulation-utils";
import { formatEta } from "@/lib/simulation-utils";
import { AltitudeProfile } from "./AltitudeProfile";
import { smoothPath } from "@/lib/chart-smoothing";

interface SimulationStatsGridProps {
  waypoints: Waypoint[];
  flightPlan: FlightPlan;
  totalDuration: number;
  speed: number;
}

const TERRAIN_CHART_HEIGHT = 44;
const TERRAIN_PAD_X = 2;
const TERRAIN_PAD_Y = 4;

/** Compact always-on terrain sparkline (green) to match the redesign. */
function TerrainMiniProfile({ waypoints, flightPlan }: { waypoints: Waypoint[]; flightPlan: FlightPlan }) {
  const pathD = useMemo(() => {
    if (waypoints.length < 2) return null;
    const elevations = waypoints.map((wp) => wp.groundElevation ?? wp.alt * 0.3);
    const min = Math.min(...elevations);
    const max = Math.max(...elevations);
    const range = Math.max(max - min, 1);

    const cumulativeDistances = [0];
    for (const seg of flightPlan.segments) {
      cumulativeDistances.push(cumulativeDistances[cumulativeDistances.length - 1] + seg.distance);
    }
    const totalDist = Math.max(flightPlan.totalDistance, 1);

    const innerW = 100 - TERRAIN_PAD_X * 2;
    const innerH = TERRAIN_CHART_HEIGHT - TERRAIN_PAD_Y * 2;
    const toX = (d: number) => TERRAIN_PAD_X + (d / totalDist) * innerW;
    const toY = (e: number) => TERRAIN_PAD_Y + (1 - (e - min) / range) * innerH;

    const points = elevations.map((e, i) => ({ x: toX(cumulativeDistances[i]), y: toY(e) }));
    return smoothPath(points);
  }, [waypoints, flightPlan]);

  if (!pathD) return null;

  return (
    <svg
      viewBox={`0 0 100 ${TERRAIN_CHART_HEIGHT}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: TERRAIN_CHART_HEIGHT }}
    >
      <path
        d={pathD}
        fill="none"
        stroke="#3ddc84"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function SimulationStatsGrid({
  waypoints,
  flightPlan,
  totalDuration,
  speed,
}: SimulationStatsGridProps) {
  const t = useTranslations("simulate");

  return (
    <>
      {/* Mission overview stats row (duration / distance / speed) */}
      <div className="px-3 py-3 border-b border-[var(--redesign-border)] grid grid-cols-3">
        <div>
          <p className="text-sm font-mono font-semibold text-[var(--redesign-text-primary)]">{formatEta(totalDuration)}</p>
          <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">{t("duration")}</span>
        </div>
        <div>
          <p className="text-sm font-mono font-semibold text-[var(--redesign-text-primary)]">
            {flightPlan.totalDistance >= 1000
              ? `${(flightPlan.totalDistance / 1000).toFixed(2)} km`
              : `${Math.round(flightPlan.totalDistance)} m`}
          </p>
          <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">{t("distance")}</span>
        </div>
        <div>
          <p className="text-sm font-mono font-semibold text-[var(--redesign-text-primary)]">{speed.toFixed(1)} m/s</p>
          <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">{t("speed")}</span>
        </div>
      </div>

      {/* Altitude profile */}
      <div className="px-3 py-2.5 border-b border-[var(--redesign-border)]">
        <h3 className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mb-1.5">
          {t("altitudeProfile")}
        </h3>
        <AltitudeProfile waypoints={waypoints} flightPlan={flightPlan} />
      </div>

      {/* Terrain profile (always visible mini sparkline) */}
      {waypoints.length >= 2 && (
        <div className="px-3 py-2.5 border-b border-[var(--redesign-border)]">
          <h3 className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mb-1.5">
            {t("terrainProfile")}
          </h3>
          <TerrainMiniProfile waypoints={waypoints} flightPlan={flightPlan} />
        </div>
      )}
    </>
  );
}
