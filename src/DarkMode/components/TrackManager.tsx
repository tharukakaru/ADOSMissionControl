"use client";

import { ArrowUpDown, Filter, Plane, Ship, Bot, Anchor } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useArcStore } from "../store/useArcStore";
import { TRACKS, FILTERS } from "../data/dummyData";
import type { TrackIcon, Classification } from "../types";

const TRACK_ICON: Record<TrackIcon, LucideIcon> = {
  plane: Plane,
  ship: Ship,
  drone: Bot,
  sub: Anchor,
};

const CLS_CLASS: Record<Classification, string> = {
  FRIENDLY: "c-friendly",
  HOSTILE: "c-hostile",
  UNKNOWN: "c-unknown",
  NEUTRAL: "c-neutral",
  PENDING: "c-pending",
};

export function TrackManager() {
  const selectedTrackId = useArcStore((s) => s.selectedTrackId);
  const selectTrack = useArcStore((s) => s.selectTrack);
  const trackFilter = useArcStore((s) => s.trackFilter);
  const setFilter = useArcStore((s) => s.setFilter);

  return (
    <>
      <div className="phead">
        <span className="ttl up">Track Manager</span>
        <span className="cnt">18</span>
        <div className="actions">
          <ArrowUpDown />
          <Filter />
        </div>
      </div>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`fb up${f === trackFilter ? " on" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="tracks">
        {TRACKS.map((t) => {
          const Icon = TRACK_ICON[t.icon];
          const selected = t.id === selectedTrackId;
          return (
            <div
              key={t.id}
              className={`trk${selected ? " sel" : ""}`}
              onClick={() => selectTrack(t.id)}
            >
              <div className="tk-ic">
                <Icon />
              </div>
              <div className="tk-main">
                <div className="tk-r1">
                  <span className="tk-nm">{t.callsign}</span>
                  <span className="tk-id">{t.id}</span>
                </div>
                <div className="tk-sub">{t.platform}</div>
              </div>
              <div className="tk-right">
                <div className={`tk-cls ${CLS_CLASS[t.classification]} up`}>
                  {t.classification}
                </div>
                <div className="tk-thr up">THR {t.threat}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
