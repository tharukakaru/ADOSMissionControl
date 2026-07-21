"use client";

import { Diamond } from "lucide-react";
import type { KillChainEntity } from "./killchain-data";

const STATUS_COLOR: Record<KillChainEntity["status"], string> = {
  hostile: "kc-dia--hostile",
  neutral: "kc-dia--neutral",
  friendly: "kc-dia--friendly",
};

export function EntityCard({ entity }: { entity: KillChainEntity }) {
  return (
    <article
      className={`kc-card${entity.selected ? " kc-card--selected" : ""}`}
      aria-current={entity.selected ? "true" : undefined}
    >
      <div className="kc-card-top">
        <span className={`kc-dia ${STATUS_COLOR[entity.status]}`} aria-hidden>
          <Diamond size={10} strokeWidth={2.5} />
        </span>
        <div className="kc-card-id">
          <span className="kc-card-code">{entity.id}</span>
          <span className="kc-card-sep">/</span>
          <span className="kc-card-type">{entity.label}</span>
        </div>
        <span className="kc-card-pct">{entity.pct}%</span>
      </div>

      <div className="kc-card-mid">
        <span className="kc-card-edited">Last edited {entity.edited}</span>
        <span className={`kc-pri kc-pri--${entity.priority.toLowerCase()}`}>{entity.priority}</span>
      </div>

      {entity.actor ? (
        <div className="kc-card-foot">
          <span className="kc-actor">ACTOR: {entity.actor}</span>
        </div>
      ) : null}
    </article>
  );
}
