"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import type { Autonomy } from "./types";

type NavTab = "C2" | "HYENA" | "SENTINEL";

export function TopBar({ autonomy = "ON-LOOP" }: { autonomy?: Autonomy }) {
  const [activeTab, setActiveTab] = useState<NavTab>("C2");

  return (
    <header className="topbar">
      <div className="tb-left">
        <span className="tb-brand">
          ARC <span className="tb-mark">O</span>S
        </span>

        <div className="tb-cluster" role="tablist" aria-label="ARC OS sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "C2"}
            className={`tb-mode${activeTab === "C2" ? " on" : ""}`}
            onClick={() => setActiveTab("C2")}
          >
            <span className="tb-mode-c2">
              C<span className="tb-mode-two">2</span>
            </span>
            <span className="tb-mode-label">BATTLE MANAGEMENT</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "HYENA"}
            className={`tb-tab${activeTab === "HYENA" ? " on" : ""}`}
            onClick={() => setActiveTab("HYENA")}
          >
            <span className="tb-tab-word">
              HY<span className="tb-mark">E</span>NA
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "SENTINEL"}
            className={`tb-tab tb-tab--sentinel${activeTab === "SENTINEL" ? " on" : ""}`}
            onClick={() => setActiveTab("SENTINEL")}
          >
            <span className="tb-tab-word">
              SEN<span className="tb-mark">T</span>INEL
            </span>
            <span className="tb-dot tb-dot--live" aria-hidden />
          </button>
        </div>

        <div className="tb-status">
          <span className="tb-stat">
            <span className="tb-dot tb-dot--live" aria-hidden />
            LINK <b>18ms</b>
          </span>
          <span className="tb-stat tb-auto">
            AUTONOMY: <b>{autonomy}</b>
          </span>
        </div>
      </div>

      <div className="tb-right">
        <span className="conf up">CONFIDENTIAL</span>
        <button type="button" className="tb-ico" aria-label="Search">
          <Search size={16} />
        </button>
        <button type="button" className="tb-ico" aria-label="Notifications">
          <Bell size={16} />
          <span className="badge" />
        </button>
        <div className="tb-user">
          <div className="ava">
            <img
              src="/avatars/commander.jpg"
              alt=""
              width={26}
              height={26}
            />
          </div>
          <div className="nm">
            <b>K. Premachandra</b>
            <span>Commander - ROE-Alpha</span>
          </div>
        </div>
      </div>
    </header>
  );
}
