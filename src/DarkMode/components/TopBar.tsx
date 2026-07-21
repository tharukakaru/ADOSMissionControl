"use client";

import { Search, Radio, Shield, Bell, Settings, ChevronDown } from "lucide-react";
import { useArcStore } from "../store/useArcStore";
import { TABS } from "../data/dummyData";

export function TopBar() {
  const activeTab = useArcStore((s) => s.activeTab);
  const setTab = useArcStore((s) => s.setTab);

  return (
    <header className="topbar">
      <div className="brand">
        <div className="lg">
          <b />
        </div>
        <div>
          <div className="nm">ARC OS</div>
          <div className="sub">Battle Management v9</div>
        </div>
      </div>

      <span className="pill pill-lime">HYENA</span>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`tab up${tab === activeTab ? " on" : ""}`}
            onClick={() => setTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="search">
        <Search size={14} />
        <span className="ph">Query tracks, grid 33.54 -117.6, or ask HYENA AI…</span>
        <span className="kbd">⌘K</span>
      </div>

      <div className="tstrip">
        <div className="tchip">
          <span className="dot" style={{ background: "var(--arc-green-b)" }} />
          LINK-16
        </div>
        <div className="tchip">
          <Radio className="ico" size={15} />
          MESH
        </div>
        <div className="tchip">
          <Shield className="ico" size={15} />
          DEFCON 3
        </div>

        <div className="clock mono">
          <div className="t">
            19:13:56<small>ZULU</small>
          </div>
          <div className="d">26 JUN 2026</div>
        </div>

        <Bell className="ico" size={15} />
        <Settings className="ico" size={15} />

        <div className="user">
          <div className="av">CDR</div>
          <div className="nm">
            <b>CDR. E. VANCE</b>
            <br />
            <span>Watch Officer</span>
          </div>
          <ChevronDown className="ico" size={11} />
        </div>
      </div>
    </header>
  );
}
