const S = 64;
const C = S / 2;
const R = S / 2 - 4;

/** Compact heading rose; cyan pointer rotates to the given heading. */
export function AttitudeIndicator({ heading }: { heading: number }) {
  const ticks: number[] = [];
  for (let a = 0; a < 360; a += 30) ticks.push(a);

  return (
    <svg viewBox={`0 0 ${S} ${S}`}>
      <circle cx={C} cy={C} r={R} fill="#10160a" stroke="#2c3a1c" />
      {ticks.map((a) => {
        const rad = (a * Math.PI) / 180;
        const o = a % 90 === 0 ? 6 : 3;
        return (
          <line
            key={a}
            x1={C + R * Math.sin(rad)}
            y1={C - R * Math.cos(rad)}
            x2={C + (R - o) * Math.sin(rad)}
            y2={C - (R - o) * Math.cos(rad)}
            stroke="#3a4a22"
            strokeWidth=".8"
          />
        );
      })}
      <path
        d={`M${C} ${C - R + 5} L${C + 4} ${C} L${C} ${C + 4} L${C - 4} ${C} Z`}
        fill="#34d0ff"
        transform={`rotate(${heading} ${C} ${C})`}
      />
      <text x={C} y={C + 3} fill="#c7f53b" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="700">
        {heading}°
      </text>
    </svg>
  );
}
