"use client";

import { EntityCard } from "./EntityCard";
import { KILL_CHAIN_COLUMNS } from "./killchain-data";

export function KillChainBoard() {
  return (
    <div className="kc-board" role="region" aria-label="Kill chain board">
      {KILL_CHAIN_COLUMNS.map((col) => (
        <section
          key={col.id}
          className={`kc-col kc-col--${col.accent}`}
          aria-labelledby={`kc-col-${col.id}`}
        >
          <header className="kc-col-head">
            <div className="kc-col-line" aria-hidden />
            <div className="kc-col-titles">
              <h2 id={`kc-col-${col.id}`} className="kc-col-title">
                {col.title}
              </h2>
              <span className="kc-col-sub">{col.subtitle}</span>
            </div>
          </header>

          <div className="kc-col-body">
            {col.entities.map((entity) => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
