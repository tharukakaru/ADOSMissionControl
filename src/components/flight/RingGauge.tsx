"use client";

/**
 * @module RingGauge
 * @description A single circular dial gauge: dark track arc, a filled
 * progress arc (yellow, with an optional red "danger zone" segment at the
 * high end), a needle tick at the current value, a big centered readout,
 * and min/max scale labels. Used by MeterView to render the four primary
 * flight metrics (altitude, ground speed, battery, heading) as round dials
 * instead of a plain number grid.
 *
 * Pure presentational component — no telemetry imports here, so it stays
 * reusable and easy to visually test in isolation.
 *
 * @license GPL-3.0-only
 */

import { cn } from "@/lib/utils";

// Gauge sweeps 270° starting at 135° (bottom-left) clockwise to 45°
// (bottom-right), leaving a 90° gap at the bottom — matches the standard
// "speedometer" layout used in the mockup.
const START_ANGLE = 135;
const SWEEP = 270;
const DEFAULT_SIZE = 102;
const STROKE = 9;
const CENTER_OF = (size: number) => size / 2;
const RADIUS_OF = (size: number) => (size - STROKE) / 2;

function polarToXY(angleDeg: number, radius: number, center: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(rad),
    y: center + radius * Math.sin(rad),
  };
}

/** SVG arc path for a sweep starting at START_ANGLE, covering `fraction` of SWEEP. */
function arcPath(fraction: number, radius: number, center: number): string {
  const clamped = Math.max(0, Math.min(1, fraction));
  if (clamped <= 0) return "";
  const endAngle = START_ANGLE + SWEEP * clamped;
  const start = polarToXY(START_ANGLE, radius, center);
  const end = polarToXY(endAngle, radius, center);
  const largeArc = SWEEP * clamped > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export interface RingGaugeProps {
  /** Current value, in the same unit as min/max. */
  value: number;
  min: number;
  max: number;
  /** Short unit label shown under the number, e.g. "M", "M/S", "PCT", "DEG". */
  unit: string;
  /** Label shown below the gauge, e.g. "ALTITUDE". */
  label: string;
  /** How the centered number is formatted. Defaults to one decimal place. */
  formatValue?: (value: number) => string;
  /** Tailwind text-* colour class for the progress arc + unit label.
   * Defaults to the brand yellow. Used to give each meter its own colour
   * (blue altitude, green voltage, yellow speed, orange battery). */
  colorClass?: string;
  /** Fraction (0-1) of the scale, from the top end, painted as a red danger
   * zone. 0 (default) disables it — used for altitude/speed redlines, not
   * for battery or heading which have no "too high" danger zone. */
  dangerZoneFraction?: number;
  /** Pixel diameter of the gauge. Defaults to 102 (the small 2x2-grid
   * gauges). The redesign's primary Ground Speed gauge is meaningfully
   * bigger than the others — pass e.g. 150 for that one instead of
   * faking size with a CSS transform: scale (which doesn't reflow layout
   * and only visually fudges a few percent). */
  size?: number;
  className?: string;
}

export function RingGauge({
  value,
  min,
  max,
  unit: _unit,
  label,
  formatValue,
  dangerZoneFraction = 0,
  colorClass = "text-[var(--redesign-yellow)]",
  size = DEFAULT_SIZE,
  className,
}: RingGaugeProps) {
  const center = CENTER_OF(size);
  const radius = RADIUS_OF(size);
  const range = max - min;
  const fraction = range > 0 ? (value - min) / range : 0;
  const clampedFraction = Math.max(0, Math.min(1, fraction));
  const needleAngle = START_ANGLE + SWEEP * clampedFraction;
  const needleInner = polarToXY(needleAngle, radius - STROKE / 2 - 3, center);
  const needleOuter = polarToXY(needleAngle, radius + STROKE / 2 + 3, center);

  const displayValue = formatValue ? formatValue(value) : value.toFixed(1);

  const trackPath = arcPath(1, radius, center);
  const progressPath = arcPath(clampedFraction, radius, center);
  const dangerStartFraction = Math.max(0, 1 - dangerZoneFraction);
  const dangerPath =
    dangerZoneFraction > 0
      ? (() => {
          const start = polarToXY(START_ANGLE + SWEEP * dangerStartFraction, radius, center);
          const end = polarToXY(START_ANGLE + SWEEP, radius, center);
          const largeArc = SWEEP * dangerZoneFraction > 180 ? 1 : 0;
          return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
        })()
      : "";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Dark background track */}
          <path
            d={trackPath}
            fill="none"
            stroke="currentColor"
            className="text-bg-tertiary"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {/* Red danger zone at the high end (optional) */}
          {dangerPath && (
            <path
              d={dangerPath}
              fill="none"
              stroke="currentColor"
              className="text-status-error/70"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          )}
          {/* Progress fill (per-meter colour) */}
          {progressPath && (
            <path
              d={progressPath}
              fill="none"
              stroke="currentColor"
              className={colorClass}
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          )}
          {/* Needle tick at current value */}
          <line
            x1={needleInner.x}
            y1={needleInner.y}
            x2={needleOuter.x}
            y2={needleOuter.y}
            stroke="currentColor"
            className="text-[var(--redesign-text-primary)]"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
        {/* Centered readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-bold tabular-nums text-[var(--redesign-text-primary)] leading-none"
            style={{ fontSize: size >= 140 ? "1.75rem" : "1.25rem" }}
          >
            {displayValue}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--redesign-text-secondary)] mt-1">
          {label}
        </span>
      )}
    </div>
  );
}
