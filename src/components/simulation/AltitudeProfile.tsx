/**
 * @module AltitudeProfile
 * @description SVG-based mini altitude chart for the simulation panel.
 * Shows the flight path altitude profile and a moving position indicator
 * driven by playback elapsed time.
 *
 * VISUAL REDESIGN NOTE: restyled to a minimal yellow (#e3e41b) line with a
 * soft fill gradient underneath, no axis labels/dots, to match SIMULATE.png.
 * The old terrain-fill overlay was removed from this chart — terrain now
 * has its own mini sparkline, see SimulationStatsGrid.tsx.
 *
 * The line is now drawn as a smoothed curve (Catmull-Rom → cubic Bézier)
 * instead of a straight-segment polyline, matching the smooth hill shape
 * in SIMULATE.png instead of sharp joints between waypoints.
 *
 * IMPORTANT — if this still looks like a flat filled bar instead of a
 * curve for a given mission: that's very likely correct, not a bug. An
 * area chart with a flat line (because every waypoint has the same
 * altitude — common for survey/mapping missions flown at a fixed AGL
 * altitude) draws as a solid rectangle, which looks identical to "a plain
 * yellow bar". Check the ALT value per waypoint in the Plan tab — if
 * they're all the same number, the chart is accurately reporting that,
 * not malfunctioning. Load/draw a mission with varying per-waypoint
 * altitude to see the curve.
 * @license GPL-3.0-only
 */

"use client";

import { useMemo, useId } from "react";
import type { Waypoint } from "@/lib/types";
import type { FlightPlan } from "@/lib/simulation-utils";
import { useThrottledElapsed } from "@/hooks/use-throttled-elapsed";
import { useSimulationStore } from "@/stores/simulation-store";
import { smoothPath } from "@/lib/chart-smoothing";

interface AltitudeProfileProps {
  waypoints: Waypoint[];
  flightPlan: FlightPlan;
}

const CHART_HEIGHT = 56;
const PAD_X = 2;
const PAD_TOP = 6;
const PAD_BOTTOM = 6;

export function AltitudeProfile({ waypoints, flightPlan }: AltitudeProfileProps) {
  const elapsed = useThrottledElapsed();
  const totalDuration = useSimulationStore((s) => s.totalDuration);
  const gradientId = useId();

  // Compute cumulative distances at each waypoint
  const cumulativeDistances = useMemo(() => {
    const dists = [0];
    for (const seg of flightPlan.segments) {
      dists.push(dists[dists.length - 1] + seg.distance);
    }
    return dists;
  }, [flightPlan]);

  // Altitude range with padding
  const { minAlt, maxAlt } = useMemo(() => {
    if (waypoints.length === 0) return { minAlt: 0, maxAlt: 100 };
    const alts = waypoints.map((wp) => wp.alt);
    const min = Math.min(...alts);
    const max = Math.max(...alts);
    const pad = Math.max((max - min) * 0.15, 5);
    return { minAlt: Math.max(0, min - pad), maxAlt: max + pad };
  }, [waypoints]);

  const totalDist = flightPlan.totalDistance;

  if (waypoints.length < 2 || totalDist <= 0) return null;

  // SVG inner area (viewBox is 0-100 wide so the chart scales with the panel)
  const innerW = 100 - PAD_X * 2;
  const innerH = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;

  const toX = (d: number) => PAD_X + (d / totalDist) * innerW;
  const toY = (a: number) => PAD_TOP + (1 - (a - minAlt) / (maxAlt - minAlt)) * innerH;

  // Flight path points, smoothed into a curved path (was a straight-segment
  // polyline — see VISUAL REDESIGN NOTE above)
  const points = waypoints.map((wp, i) => ({
    x: toX(cumulativeDistances[i]),
    y: toY(wp.alt),
  }));
  const linePath = smoothPath(points);

  // Filled area under the curve (same curve, closed down to the baseline)
  const bottom = PAD_TOP + innerH;
  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  const areaPath = `${linePath} L ${lastX.toFixed(2)} ${bottom} L ${firstX.toFixed(2)} ${bottom} Z`;

  // Current position along X axis (progress-based)
  const progress = totalDuration > 0 ? Math.min(elapsed / totalDuration, 1) : 0;
  const currentDist = progress * totalDist;
  const posX = toX(currentDist);

  return (
    <svg
      viewBox={`0 0 100 ${CHART_HEIGHT}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: CHART_HEIGHT }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3e41b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e3e41b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Fill under the flight path */}
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />

      {/* Flight path line */}
      <path
        d={linePath}
        fill="none"
        stroke="#e3e41b"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Current position indicator */}
      {totalDuration > 0 && (
        <line
          x1={posX}
          y1={PAD_TOP}
          x2={posX}
          y2={PAD_TOP + innerH}
          stroke="#ecf1f5"
          strokeOpacity={0.4}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          strokeDasharray="3 2"
        />
      )}
    </svg>
  );
}
