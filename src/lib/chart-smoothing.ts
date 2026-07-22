/**
 * @module chart-smoothing
 * @description Turns a small set of data points into a smooth SVG path
 * (Catmull-Rom spline converted to cubic Béziers) instead of a straight-
 * segment polyline. Used by the redesigned mini charts (AltitudeProfile,
 * TerrainMiniProfile) so a handful of waypoints/samples reads as a smooth
 * hill shape — matching SIMULATE.png — instead of sharp joints at every
 * data point.
 * @license GPL-3.0-only
 */

export interface ChartPoint {
  x: number;
  y: number;
}

/**
 * Builds an SVG path `d` string that smoothly interpolates through every
 * point. Falls back to a straight line for 0-2 points (nothing to smooth).
 */
export function smoothPath(points: ChartPoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} L ${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`;
  }

  const p = points;
  let d = `M ${p[0].x.toFixed(2)} ${p[0].y.toFixed(2)}`;

  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;

    // Catmull-Rom to cubic Bézier control points (standard 1/6 tangent scale)
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}
