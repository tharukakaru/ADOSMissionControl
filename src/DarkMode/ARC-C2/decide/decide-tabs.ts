import type { ArcTabSpec } from "../shared/ArcPanelTabs";
import type { DecideTab } from "./types";

export const DECIDE_TABS: readonly ArcTabSpec<DecideTab>[] = [
  { id: "DECIDE", label: "DECIDE", badge: 1, tabClass: "dtab-decide" },
  { id: "ALERTS", label: "ALERTS", badge: 2, badgeVariant: "alerts", tabClass: "dtab-alerts" },
  { id: "AUDIT", label: "AUDIT", tabClass: "dtab-audit" },
];
