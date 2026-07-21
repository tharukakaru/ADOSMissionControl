"use client";

import { useState } from "react";
import { ArcPanelTabs } from "./shared/ArcPanelTabs";
import { AlertsTab } from "./AlertsTab";
import { AuditTab } from "./AuditTab";
import {
  DECIDE_TABS,
  DecideMainTab,
  AutonomyFooter,
  type DecideTab,
} from "./decide";
import type { Autonomy } from "./types";

export function DecidePanel({
  autonomy,
  setAutonomy,
  onRequestAuthorise,
  forceTab,
}: {
  autonomy: Autonomy;
  setAutonomy: (a: Autonomy) => void;
  onRequestAuthorise: () => void;
  forceTab?: DecideTab;
}) {
  const [tab, setTab] = useState<DecideTab>("DECIDE");
  const [coa, setCoa] = useState("COA-A");

  const activeTab = forceTab ?? tab;
  const themed = activeTab === "ALERTS" || activeTab === "AUDIT";
  const sectionClass = ["decide", themed ? "decide--themed" : ""].filter(Boolean).join(" ");

  return (
    <section className={sectionClass}>
      <ArcPanelTabs
        tabs={DECIDE_TABS}
        active={activeTab}
        onChange={setTab}
        ariaLabel="Decide panel views"
      />

      <div className="dec-body">
        {activeTab === "DECIDE" && (
          <DecideMainTab
            selectedCoa={coa}
            onSelectCoa={setCoa}
            onRequestAuthorise={onRequestAuthorise}
          />
        )}
        {activeTab === "ALERTS" && <AlertsTab />}
        {activeTab === "AUDIT" && <AuditTab />}
      </div>

      <AutonomyFooter autonomy={autonomy} onChange={setAutonomy} />
    </section>
  );
}
