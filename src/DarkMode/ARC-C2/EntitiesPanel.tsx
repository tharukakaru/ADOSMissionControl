"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Circle, Bell, Triangle,
} from "lucide-react";
import { ENTITIES, ENT_FILTERS } from "./data";
import type { Entity } from "./types";
import rangeRingHead from "./images/RangeRing.png";
import intervisibilityImage from "./images/Intervisibility.png";
import ballisticImage from "./images/Ballistic.png";
import terrainHead from "./images/Terrain.png";
import slopeImage from "./images/Slope.png";
import terrainLandCover from "./images/LandCover.png";
import terrainPathways from "./images/Pathways.png";
import terrainProjection from "./images/Projection.png";
import terrainVector from "./images/Vector.png";

const TONE_COLOR: Record<Entity["tone"], string> = {
  hy: "var(--friendly)",
  sent: "var(--friendly)",
  host: "var(--hostile)",
  frnd: "var(--friendly)",
  neut: "var(--neutral)",
};

const FILTER_MATCH: Record<string, (e: Entity) => boolean> = {
  ALL: () => true,
  FRND: (e) => e.tone === "hy" || e.tone === "sent" || e.tone === "frnd",
  HOST: (e) => e.tone === "host" && !/unknown/i.test(e.sub),
  UNK: (e) => /unknown/i.test(e.sub),
  NEUT: (e) => e.tone === "neut",
};

function confidenceClass(pct: number): string {
  if (pct >= 90) return "epct-hi";
  if (pct >= 50) return "epct-mid";
  return "epct-lo";
}

function Glyph({ tone }: { tone: Entity["tone"] }) {
  const c = TONE_COLOR[tone];
  if (tone === "host") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        <rect x="4" y="4" width="8" height="8" transform="rotate(45 8 8)" fill="none" stroke={c} strokeWidth="1.6" />
      </svg>
    );
  }
  if (tone === "hy") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        <path d="M8 3 L13 12 L8 10 L3 12 Z" fill="none" stroke={c} strokeWidth="1.5" />
      </svg>
    );
  }
  if (tone === "neut") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        <circle cx="8" cy="8" r="4.5" fill="none" stroke={c} strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect x="3.5" y="3.5" width="9" height="9" rx="1.5" fill="none" stroke={c} strokeWidth="1.6" />
    </svg>
  );
}

const RANGE_CHIPS = ["range", "intervisibility", "ballistic"] as const;
const ALERT_CHIPS = ["geofence", "proximity"] as const;
const TERRAIN_CHIP_IDS = ["slope", "landcover", "pathways", "projection", "vector"] as const;

const RANGE_LABELED_CHIPS = [
  { id: "range", label: "Range ring", accent: "var(--neutral)", image: rangeRingHead },
  { id: "intervisibility", label: "Intervisibility", accent: "var(--neutral)", image: intervisibilityImage },
  { id: "ballistic", label: "Ballistic", accent: "var(--caution)", image: ballisticImage },
] as const satisfies ReadonlyArray<{
  id: typeof RANGE_CHIPS[number];
  label: string;
  accent: string;
  image: { src: string };
}>;

const TERRAIN_LABELED_CHIPS = [
  { id: "slope", label: "Slope", accent: "var(--neutral)", image: slopeImage },
  { id: "landcover", label: "Land cover", accent: "var(--friendly)", image: terrainLandCover },
  { id: "pathways", label: "Pathways", accent: "var(--caution)", image: terrainPathways },
  { id: "projection", label: "Projection", accent: "var(--neutral)", image: terrainProjection },
] as const satisfies ReadonlyArray<{
  id: Exclude<typeof TERRAIN_CHIP_IDS[number], "vector">;
  label: string;
  accent: string;
  image: { src: string };
}>;

type ChipKey = typeof RANGE_CHIPS[number] | typeof ALERT_CHIPS[number] | typeof TERRAIN_CHIP_IDS[number];

function Chip({
  id, label, icon, accent, on, onToggle, iconOnly, ariaLabel,
}: {
  id: ChipKey;
  label: string;
  icon: ReactNode;
  accent: string;
  on: boolean;
  onToggle: (id: ChipKey) => void;
  iconOnly?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      className={`topt${iconOnly ? " topt--icon-only" : ""}${on ? " on" : ""}`}
      style={{ "--chip-accent": accent } as CSSProperties}
      onClick={() => onToggle(id)}
      aria-label={iconOnly ? ariaLabel : undefined}
    >
      <span className="oi">{icon}</span>
      {!iconOnly && label}
    </button>
  );
}

export function EntitiesPanel() {
  const [filter, setFilter] = useState("ALL");
  const [chips, setChips] = useState<Record<ChipKey, boolean>>({
    range: false, intervisibility: false, ballistic: false,
    geofence: false, proximity: false,
    slope: false, landcover: false, pathways: false, projection: false, vector: false,
  });

  const visible = useMemo(() => {
    const match = FILTER_MATCH[filter] ?? FILTER_MATCH.ALL;
    return ENTITIES.filter(match);
  }, [filter]);

  const toggleChip = (id: ChipKey) => setChips((c) => ({ ...c, [id]: !c[id] }));

  return (
    <aside className="ent">
      <div className="ent-head">
        <span className="t up">Entities</span>
        <span className="n" data-count={`${ENTITIES.length}`}>{ENTITIES.length} tracked</span>
      </div>

      <div className="ent-filters">
        {ENT_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`efb${filter === f.key ? " on" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            <span className="fl up">{f.key}</span>
            <sup className="fn">{f.n}</sup>
          </button>
        ))}
      </div>

      <div className="ent-list">
        {visible.map((e) => (
          <div className="erow" key={e.id}>
            <span
              className="eg"
              style={{ "--eg-accent": TONE_COLOR[e.tone] } as CSSProperties}
            >
              <Glyph tone={e.tone} />
            </span>
            <div className="em">
              <div className="e1">
                <span className="enm">{e.name}</span>
                {e.badge && <span className="ecl">{e.badge}</span>}
              </div>
              <div className="esub">{e.sub}</div>
            </div>
            <div className="er">
              <span className="dot" style={{ background: TONE_COLOR[e.tone] }} />
              <span className={`epct mono ${confidenceClass(e.confidence)}`}>{e.confidence}%</span>
            </div>
          </div>
        ))}
        <div className="ent-fusion">
          <span className="fusion-bar" aria-hidden />
          FUSION · NOMINAL
          <span className="r mono">&lt; 200 ms</span>
        </div>
      </div>

      <div className="tools">
        <div className="tsec">
          <div className="tsec-h"><Circle size={14} /><span className="t up">Range ring</span></div>
          <div className="d">Calculate the distance between any given point and an object or target</div>
          <div className="topts">
            {RANGE_LABELED_CHIPS.map((c) => (
              <Chip
                key={c.id}
                id={c.id}
                label={c.label}
                accent={c.accent}
                on={chips[c.id]}
                onToggle={toggleChip}
                icon={
                  <img
                    src={c.image.src}
                    alt=""
                    className="terrain-icon"
                    aria-hidden
                  />
                }
              />
            ))}
          </div>
        </div>

        <div className="tsec">
          <div className="tsec-h"><Bell size={14} /><span className="t up">Alerts</span></div>
          <div className="d">Get alerted when entities enter a designated region based on your selections and alert conditions</div>
          <div className="topts">
            <Chip id="geofence" label="Geofence" accent="var(--hostile)" on={chips.geofence} onToggle={toggleChip}
              icon={<Triangle size={16} />} />
            <Chip id="proximity" label="Proximity" accent="var(--caution)" on={chips.proximity} onToggle={toggleChip}
              icon={<Circle size={16} />} />
          </div>
        </div>

        <div className="tsec">
          <div className="tsec-h">
            <img src={terrainHead.src} alt="" className="terrain-head-icon" aria-hidden />
            <span className="t up">Terrain</span>
          </div>
          <div className="d">Analyze terrain and land cover in an area to inform movement</div>
          <div className="gw">Guided workflow →</div>
          <div className="topts">
            {TERRAIN_LABELED_CHIPS.map((c) => (
              <Chip
                key={c.id}
                id={c.id}
                label={c.label}
                accent={c.accent}
                on={chips[c.id]}
                onToggle={toggleChip}
                icon={
                  <img
                    src={c.image.src}
                    alt=""
                    className="terrain-icon"
                    aria-hidden
                  />
                }
              />
            ))}
            <Chip
              id="vector"
              label=""
              accent="var(--neutral)"
              iconOnly
              ariaLabel="Vector"
              on={chips.vector}
              onToggle={toggleChip}
              icon={
                <img
                  src={terrainVector.src}
                  alt=""
                  className="terrain-icon"
                  aria-hidden
                />
              }
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
