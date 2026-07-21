"use client";

import { useCallback, useState } from "react";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./arc.css";
import "leaflet/dist/leaflet.css";

import { TopBar } from "./TopBar";
import { IconRail } from "./IconRail";
import { SoulChat } from "./SoulChat";
import { DecidePanel } from "./DecidePanel";
import { BattleMap } from "./BattleMap";
import { EntitiesPanel } from "./EntitiesPanel";
import { HumanAuthorityGate } from "./HumanAuthorityGate";
import { useArcC2Shell } from "./useArcC2Shell";
import { DEMO_AUTHORITY_GATE } from "./data";
import type { Autonomy } from "./types";
import type { AuthoriseRecord } from "./gate-types";
import type { MobileTab } from "./useArcC2Shell";

const MOBILE_TABS: { id: MobileTab; label: string }[] = [
  { id: "map", label: "MAP" },
  { id: "soul", label: "SOUL" },
  { id: "decide", label: "DECIDE" },
  { id: "alerts", label: "ALERTS" },
];

/**
 * ARC OS · C2 — BATTLE MANAGEMENT.
 * Demo screen: dummy data, editable inputs, and clickable controls only.
 */
export default function App() {
  const [autonomy, setAutonomy] = useState<Autonomy>("ON-LOOP");
  const [gateOpen, setGateOpen] = useState(false);
  const [gateSession, setGateSession] = useState(0);
  const shell = useArcC2Shell();

  const onSoulAuthorise = () => {
    // Soul CTA stays a demo stub — Decide footer opens the gate.
  };

  const openGate = useCallback(() => {
    setGateSession((n) => n + 1);
    setGateOpen(true);
  }, []);

  const handleAuthorise = useCallback((record: AuthoriseRecord) => {
    // Demo: structured audit payload for a future AuditTab feed.
    console.info("[ARC C2] authorise", record);
    setGateOpen(false);
  }, []);

  const handleAbort = useCallback(() => {
    setGateOpen(false);
  }, []);

  return (
    <div className={`arc ${shell.shellClass}`.trim()}>
      <div className="app">
        <div className="app__main">
          <TopBar autonomy={autonomy} />
          <div className="app__body body">
            <IconRail
              onMenuClick={shell.openDrawer}
              menuRef={shell.drawerTriggerRef}
              menuExpanded={shell.drawerOpen}
            />
            <div className="shell-panel shell-panel--soul">
              <SoulChat onAuthorise={onSoulAuthorise} />
            </div>
            <div className="shell-panel shell-panel--decide">
              <DecidePanel
                autonomy={autonomy}
                setAutonomy={setAutonomy}
                onRequestAuthorise={openGate}
                forceTab={shell.mobileTab === "alerts" ? "ALERTS" : undefined}
              />
            </div>
            <div className="map-zone">
              <BattleMap
                entitiesOpen={shell.entitiesOpen}
                onToggleEntities={shell.toggleEntities}
              />
            </div>
          </div>
        </div>

        <EntitiesPanel />

        <button
          type="button"
          className="shell-drawer-backdrop"
          aria-label="Close panel drawer"
          tabIndex={shell.drawerOpen ? 0 : -1}
          onClick={shell.closeDrawer}
        />

        <nav className="mobile-tabbar" role="tablist" aria-label="ARC C2 views">
          {MOBILE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={shell.mobileTab === tab.id}
              className={`mobile-tab${shell.mobileTab === tab.id ? " on" : ""}`}
              onClick={() => shell.setMobileTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <HumanAuthorityGate
        key={gateSession}
        open={gateOpen}
        gate={DEMO_AUTHORITY_GATE}
        onAuthorise={handleAuthorise}
        onAbort={handleAbort}
      />
    </div>
  );
}
