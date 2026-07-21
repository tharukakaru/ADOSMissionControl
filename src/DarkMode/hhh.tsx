"use client";

import "./arc.css";

import { TopBar } from "./components/TopBar";
import { IconRail } from "./components/IconRail";
import { TrackManager } from "./components/TrackManager";
import { EventLog } from "./components/EventLog";
import { SentinelPanel } from "./components/sentinel/SentinelPanel";
import { TelemetryPanel } from "./components/telemetry/TelemetryPanel";
import { HyenaPanel } from "./components/hyena/HyenaPanel";
import { ReplayBar } from "./components/ReplayBar";

/**
 * ARC OS · BATTLE MANAGEMENT — SENTINEL screen.
 * Dark-mode radar early-warning / interceptor command surface.
 * All data is dummy (see ./data/dummyData.ts); state lives in ./store/useArcStore.
 */
export default function Hhh() {
  return (
    <div className="arc-root">
      <div className="app">
        <TopBar />

        <div className="body" style={{ position: "relative" }}>
          <IconRail />

          <aside className="left">
            <TrackManager />
            <EventLog />
          </aside>

          <SentinelPanel />
          <TelemetryPanel />

          <HyenaPanel />
        </div>

        <ReplayBar />
      </div>
    </div>
  );
}
