"use client";

import { EVENTS } from "../data/dummyData";
import type { EventSource } from "../types";

const SRC_CLASS: Record<EventSource, string> = {
  SENTINEL: "s-sentinel",
  FUSION: "s-fusion",
  C2: "s-c2",
};

const SRC_DOT: Record<EventSource, string> = {
  SENTINEL: "var(--arc-red)",
  FUSION: "var(--arc-amber)",
  C2: "var(--arc-cyan)",
};

export function EventLog() {
  return (
    <div className="elog">
      <div className="eh">
        <span className="bar" style={{ height: 9 }} />
        <span className="ttl up">Event Log</span>
        <span className="live up">LIVE</span>
      </div>
      <div className="evs">
        {EVENTS.map((e) => (
          <div className="ev" key={`${e.time}-${e.source}`}>
            <span className="tm mono">{e.time}</span>
            <div className="bd">
              <span className="dot" style={{ background: SRC_DOT[e.source], marginRight: 6 }} />
              <span className={`src ${SRC_CLASS[e.source]}`}>{e.source}</span> {e.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
