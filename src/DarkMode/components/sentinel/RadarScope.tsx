import { Search, Activity, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BLIPS, SCOPE_STATS } from "../../data/dummyData";
import type { BlipSpec } from "../../types";

const C = 250;
const CX = C / 2;
const CY = C / 2;
const R = C / 2 - 6;

const BLIP_COLOR: Record<BlipSpec["color"], string> = {
  red: "#e0506a",
  amber: "#d8a93a",
  cyan: "#34d0ff",
};

const STAT_ICON: Record<string, LucideIcon> = {
  detect: Search,
  react: Activity,
  cue: Zap,
};

function pos(deg: number, fr: number): [number, number] {
  const r = (deg * Math.PI) / 180;
  return [CX + R * fr * Math.sin(r), CY - R * fr * Math.cos(r)];
}

function RadarSvg() {
  const rings = [1, 0.75, 0.5, 0.25];

  const spokes: number[] = [];
  for (let a = 0; a < 360; a += 30) spokes.push(a);

  const bearings: Array<[string, number, number]> = [
    ["000", CX, 12],
    ["090", C - 14, CY + 3],
    ["180", CX, C - 6],
    ["270", 14, CY + 3],
  ];

  // sweep wedge (~ near vertical, pointing up)
  const ang0 = (-14 * Math.PI) / 180;
  const ang1 = (18 * Math.PI) / 180;
  const wedgePath = `M${CX} ${CY} L${CX + R * Math.sin(ang0)} ${CY - R * Math.cos(ang0)} A${R} ${R} 0 0 1 ${CX + R * Math.sin(ang1)} ${CY - R * Math.cos(ang1)} Z`;
  const sweepEdge: [number, number] = [CX + R * Math.sin(ang1), CY - R * Math.cos(ang1)];

  return (
    <svg viewBox={`0 0 ${C} ${C}`}>
      <defs>
        <radialGradient id="arc-sg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c7f53b" stopOpacity="0" />
          <stop offset="85%" stopColor="#c7f53b" stopOpacity=".22" />
          <stop offset="100%" stopColor="#c7f53b" stopOpacity=".05" />
        </radialGradient>
        <radialGradient id="arc-glow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#3a4a1e" stopOpacity=".55" />
          <stop offset="100%" stopColor="#101509" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CX} cy={CY} r={R} fill="#141c0c" />
      <circle cx={CX} cy={CY} r={R} fill="url(#arc-glow)" />

      {/* sweep */}
      <path d={wedgePath} fill="url(#arc-sg)" />
      <line x1={CX} y1={CY} x2={sweepEdge[0]} y2={sweepEdge[1]} stroke="#c7f53b" strokeWidth="1" opacity=".8" />

      {/* range rings */}
      {rings.map((k) => (
        <circle key={k} cx={CX} cy={CY} r={R * k} fill="none" stroke="#2c3a1c" strokeWidth=".6" />
      ))}

      {/* spokes */}
      {spokes.map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={CX}
            y1={CY}
            x2={CX + R * Math.sin(r)}
            y2={CY - R * Math.cos(r)}
            stroke="#243016"
            strokeWidth=".5"
          />
        );
      })}

      {/* bearing labels */}
      {bearings.map(([t, x, y]) => (
        <text key={t} x={x} y={y} fill="#5a6a3e" fontSize="8" textAnchor="middle" fontFamily="monospace" letterSpacing="1">
          {t}
        </text>
      ))}

      {/* blips */}
      {BLIPS.map((b) => {
        const [x, y] = pos(b.bearing, b.rangeFraction);
        const color = BLIP_COLOR[b.color];
        return (
          <g key={b.id}>
            <path d={`M${x} ${y - 5} L${x + 4.5} ${y + 3.5} L${x - 4.5} ${y + 3.5} Z`} fill="none" stroke={color} strokeWidth="1.3" />
            <circle cx={x} cy={y} r="9" fill="none" stroke={color} strokeWidth=".7" opacity=".5" />
            <text x={x + 11} y={y + 3} fill={color} fontSize="8" fontFamily="monospace">
              {b.id}
            </text>
          </g>
        );
      })}

      {/* center (own-ship) */}
      <circle cx={CX} cy={CY} r="3.2" fill="#34d0ff" />
      <circle cx={CX} cy={CY} r="7" fill="none" stroke="#34d0ff" strokeWidth=".7" opacity=".5" />

      <text x={C - 8} y={C - 22} fill="#5a6a3e" fontSize="7.5" textAnchor="end" fontFamily="monospace" letterSpacing="1">
        RANGE 400KM
      </text>

      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#3a4a22" strokeWidth="1" />
    </svg>
  );
}

export function RadarScope() {
  return (
    <div className="card">
      <div className="ch">
        <span className="bar" />
        <span className="ct up">Early-Warning Scope</span>
        <span className="tag tag-act up">Active</span>
      </div>
      <div className="scopewrap">
        <div className="scopetop">
          <span>PPI · AN/TPY-2</span>
          <span />
        </div>
        <div className="scope">
          <RadarSvg />
        </div>
        <div className="scopestats">
          {SCOPE_STATS.map((s) => {
            const Icon = STAT_ICON[s.key];
            return (
              <div className="sbox" key={s.key}>
                <div className="l up">
                  <Icon />
                  {s.label}
                </div>
                <div className="v mono">{s.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
