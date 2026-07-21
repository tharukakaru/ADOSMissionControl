import type { Gauge as GaugeData } from "../../types";

const S = 66;
const C = S / 2;
const R = 24;
const START = 135;
const SWEEP = 270;

const COLOR: Record<GaugeData["color"], string> = {
  lime: "#c7f53b",
  cyan: "#34d0ff",
  green: "#41c47e",
  amber: "#d8a93a",
};

function pt(ang: number): [number, number] {
  const a = ((ang - 90) * Math.PI) / 180;
  return [C + R * Math.cos(a), C + R * Math.sin(a)];
}

function arc(a0: number, a1: number): string {
  const [x0, y0] = pt(a0);
  const [x1, y1] = pt(a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
}

/** Single radial gauge (270° sweep) with centered value. */
export function Gauge({ gauge }: { gauge: GaugeData }) {
  const color = COLOR[gauge.color];
  const frac = Math.min(gauge.value / gauge.max, 1);
  const bg = arc(START, START + SWEEP);
  const fg = arc(START, START + SWEEP * frac);

  return (
    <div className="gz">
      <svg viewBox={`0 0 ${S} ${S}`}>
        <path d={bg} fill="none" stroke="#222a18" strokeWidth="3.5" strokeLinecap="round" />
        <path d={fg} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <text x={C} y={C + 4} fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="700">
          {gauge.display}
        </text>
      </svg>
      <div className="gl up">{gauge.label}</div>
    </div>
  );
}
