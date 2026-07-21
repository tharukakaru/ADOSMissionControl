"use client";

import type { Coa } from "../types";
import { CoaId } from "./CoaId";

export function CoaCard({
  coa,
  selected,
  onSelect,
}: {
  coa: Coa;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`coa${selected ? " on" : ""}${coa.dim ? " dim" : ""}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="r1">
        <CoaId id={coa.id} selected={selected} />
        {coa.rec ? <span className="rec">REC</span> : null}
        <span className="time">{coa.time}</span>
      </div>
      <div className="name">{coa.name}</div>
      <div className="desc">{coa.desc}</div>
      <div className="meter">
        <div className={`bar${coa.dim ? " dim" : ""}`}>
          <i style={{ width: `${coa.pct}%` }} />
        </div>
        <span className="pct">{coa.pct}%</span>
      </div>
    </div>
  );
}
