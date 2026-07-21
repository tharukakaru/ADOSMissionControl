"use client";

import type { SoulCodeBlockSpec } from "../types";

export function SoulCodeBlock({ block }: { block: SoulCodeBlockSpec }) {
  if (block.variant === "danger" && block.dangerRows) {
    return (
      <div className="code danger mono">
        {block.dangerRows.map((row, index) => (
          <div key={index} className="code-row">
            {row.key ? <span className="k">{row.key}</span> : null}
            {row.pairs?.map((pair) => (
              <span key={pair.label} className="pair">
                {pair.label}<span className="v">{pair.value}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!block.lines?.length) return null;

  return (
    <div className="code mono">
      {block.lines.map((line, index) => (
        <div key={index}>
          {line.key ? (
            <>
              <span className="k">{line.key}</span>{" "}
            </>
          ) : null}
          {line.dim ? <span className="dim">{line.dim}</span> : null}
          {line.value ? <span className="v">{line.value}</span> : null}
          {line.region ? <span className="v-region">{line.region}</span> : null}
        </div>
      ))}
    </div>
  );
}
