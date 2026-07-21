// Shared domain types for the ARC OS · C2 battle-management screen. Demo data only.

export type EntityClass = "HYENA" | "SENTINEL" | "HOST" | "FRND" | "NEUT";
export type MarkerKind = "host" | "frnd" | "sent" | "hy";

export interface Entity {
  id: string;
  name: string;
  badge: string;      // small class tag shown after the name (HYENA, SENTINEL, …)
  sub: string;        // descriptor line
  confidence: number; // 0-100
  tone: "hy" | "sent" | "host" | "frnd" | "neut"; // name color
  status: string;     // status dot color (css var)
}

export interface Coa {
  id: string;
  rec?: boolean;
  time: string;       // "3 min" | "—"
  name: string;
  desc: string;
  pct: number;
  dim?: boolean;
}

export interface DataSource {
  label: string;
  icon: "map" | "sheet" | "globe";
  action: "arrow" | "plus";
}

export type MapAffiliation = "FRND" | "HOST" | "UNK" | "NEUT";

export interface BattleMapEntity {
  id: string;
  name: string;
  type: string;
  affiliation: MapAffiliation;
  confidence: string;
  position: [number, number];
}

export type Autonomy = "IN-LOOP" | "ON-LOOP" | "SUPERVISED";

export type AlertSeverity = "critical" | "caution" | "info";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  time: string;
  description: string;
  source: string;
  unread?: boolean;
}

export type AuditEntryKind = "authorised" | "system" | "classification";

export interface AuditEntry {
  id: string;
  kind: AuditEntryKind;
  title: string;
  timestamp: string;
}

export type SoulAction = "handoff" | "classify" | "track" | "engage";

export interface SoulTurnLabelSpec {
  who: string;
  sub?: boolean;
  pill?: string;
  diamondColor?: string;
}

export interface SoulCodeLineSpec {
  key?: string;
  dim?: string;
  value?: string;
  region?: string;
}

export interface SoulCodeDangerRowSpec {
  key?: string;
  pairs?: { label: string; value: string }[];
}

export interface SoulCodeBlockSpec {
  variant?: "default" | "danger";
  lines?: SoulCodeLineSpec[];
  dangerRows?: SoulCodeDangerRowSpec[];
}

export interface SoulNestedTurnSpec {
  labels: SoulTurnLabelSpec[];
  bubble: string;
  bubbleSub?: boolean;
}

export interface SoulActionBlockSpec {
  code: SoulCodeBlockSpec;
  buttonLabel: string;
}

export type SoulChatMessage =
  | {
      id: string;
      role: "operator";
      senderLabel: string;
      text: string;
      variant?: "intro" | "followup";
    }
  | {
      id: string;
      role: "agent";
      label: SoulTurnLabelSpec;
      bubble?: string;
      code?: SoulCodeBlockSpec;
      nested?: SoulNestedTurnSpec;
      action?: SoulActionBlockSpec;
      actionLayout?: boolean;
    };
