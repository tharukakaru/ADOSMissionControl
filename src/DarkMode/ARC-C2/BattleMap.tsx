"use client";

import { Crosshair, PanelRight } from "lucide-react";
import { MapWrapper } from "./map/MapWrapper";
import { TimelineBar } from "./TimelineBar";

export function BattleMap({
  entitiesOpen,
  onToggleEntities,
}: {
  entitiesOpen: boolean;
  onToggleEntities: () => void;
}) {
  return (
    <div className="map">
      <MapWrapper />

      <div className="map-ov battle-tag">
        <Crosshair size={14} />
        <span className="t up">Battle overview</span>
      </div>

      <div className="map-ov map-tr">
        <button
          type="button"
          className={`map-icobtn ent-toggle${entitiesOpen ? " on" : ""}`}
          aria-label="Toggle entities panel"
          aria-expanded={entitiesOpen}
          onClick={onToggleEntities}
        >
          <PanelRight size={16} />
        </button>
      </div>

      <div className="map-bottom">
        <TimelineBar />
      </div>
    </div>
  );
}
