import type {
  Entity, Coa, DataSource, BattleMapEntity, Alert, AuditEntry,
  SoulChatMessage,
} from "./types";
import type { HumanAuthorityGate } from "./gate-types";

/* ---- right-panel entity roster ------------------------------------------- */
export const ENTITIES: Entity[] = [
  { id: "mx1", name: "MEGHA X STRIKER 1-1", badge: "HYENA", sub: "HYENA · Autonomous Strike UAV", confidence: 100, tone: "hy", status: "var(--green)" },
  { id: "mx2", name: "MEGHA X STRIKER 1-2", badge: "HYENA", sub: "HYENA · Autonomous Strike UAV", confidence: 100, tone: "hy", status: "var(--green)" },
  { id: "sa", name: "SENTINEL ALPHA", badge: "SENTINEL", sub: "SENTINEL · sentry C2 Radar Node", confidence: 100, tone: "sent", status: "var(--friendly)" },
  { id: "int3", name: "INTERCEPTOR-3", badge: "SENTINEL", sub: "SENTINEL · Node 01 C-UAS Interceptor", confidence: 100, tone: "sent", status: "var(--amber)" },
  { id: "grd7", name: "GUARDIAN-7", badge: "SENTINEL", sub: "SENTINEL · Node 01 C-UAS Interceptor", confidence: 100, tone: "sent", status: "var(--green)" },
  { id: "t552", name: "TRACK 552", badge: "", sub: "Group-3 UAS · Probable", confidence: 82, tone: "host", status: "var(--cyan)" },
  { id: "t553", name: "TRACK 553", badge: "", sub: "Group-3 UAS · Probable", confidence: 77, tone: "host", status: "var(--cyan)" },
  { id: "t559", name: "TRACK 559", badge: "", sub: "Rotary Wing · Unknown", confidence: 53, tone: "host", status: "var(--caution)" },
  { id: "shk", name: "SEAHAWK", badge: "", sub: "Vessel · Data Link", confidence: 93, tone: "frnd", status: "var(--green)" },
  { id: "c4421", name: "CIVIL 4421", badge: "", sub: "Commercial Air · ADS-B", confidence: 99, tone: "neut", status: "var(--cyan)" },
];

export const ENT_FILTERS = [
  { key: "ALL", n: 10 },
  { key: "FRND", n: 5 },
  { key: "HOST", n: 2 },
  { key: "UNK", n: 1 },
  { key: "NEUT", n: 2 },
] as const;

export const COAS: Coa[] = [
  { id: "COA-A", rec: true, time: "3 min", name: "Engage with INTERCEPTOR-3", desc: "Kinetic intercept - positive seeker lock - 3 min to effect", pct: 88 },
  { id: "COA-B", time: "5 min", name: "Cue REAPER 1-1 to shadow", desc: "Maintain custody, defer engagement, collect EO/IR ID", pct: 72 },
  { id: "COA-C", time: "—", name: "Hold & monitor", desc: "No effector committed · re-evaluate at sector boundary", pct: 40, dim: true },
];

/* ---- ALERTS tab rows --------------------------------------------------- */
export const ALERTS: Alert[] = [
  {
    id: "a1",
    severity: "critical",
    title: "Hostile UAS pair inbound",
    time: "00:42",
    description: "TRACK 552 / 553 crossing into protected airspace · authorisation required",
    source: "SENTINEL ALPHA",
    unread: true,
  },
  {
    id: "a2",
    severity: "caution",
    title: "Low fuel — REAPER 1-2",
    time: "02:31",
    description: "Bingo fuel in 18 min at current tasking",
    source: "HYENA",
  },
  {
    id: "a3",
    severity: "info",
    title: "New external sensor online",
    time: "06:14",
    description: "GUARDIAN-7 AEW&C integrated via SDK · feeding air picture",
    source: "ARC C2",
  },
  {
    id: "a4",
    severity: "caution",
    title: "Unknown rotary loitering",
    time: "03:02",
    description: "TRACK 559 holding near sector boundary · classification pending",
    source: "Perception Agent",
  },
];

/* ---- Human Authority Gate (Decide → REVIEW & AUTHORISE) ---------------- */
export const DEMO_AUTHORITY_GATE: HumanAuthorityGate = {
  id: "gate-track-552",
  title: "HUMAN AUTHORITY GATE",
  taskType: "DEFEAT TASK · LETHAL/DEFEAT AUTHORIZATION REQUIRED",
  target: { label: "TRACK 552", sub: "Group-3 UAS · Probable" },
  classification: { label: "HOSTILE", confidence: 88 },
  effector: { label: "SE-204", sub: "INTERCEPTOR-3 · kinetic" },
  predictedIntercept: { label: "3 min", sub: "Positive seeker lock" },
  targetRange: { label: "4.2 km", sub: "WEZ envelope · inbound NW" },
  rationale:
    "Two hostile Group-3 UAS inbound on protected airspace at 96 kts. INTERCEPTOR-3 is the lowest-cost, fastest effector with positive seeker lock. Engagement deconflicted against REAPER 1-1.",
  policyId: "ROE-AIR-DEFENSE-07",
  authoriser: "CDR. VOSS",
  auditSink: "ARC C2 · Tamper-evident audit log",
  roeRules: [
    { id: "roe-1", label: "Positive hostile classification confirmed for TRACK 552" },
    { id: "roe-2", label: "Effector WEZ clear of civil traffic / fratricide risk" },
    { id: "roe-3", label: "Authorising officer holds DEFEAT authority under ROE-AIR-DEFENSE-07" },
    { id: "roe-4", label: "Collateral / ROE proportionality reviewed for this engagement" },
  ],
};

/* ---- AUDIT tab entries ------------------------------------------------- */
export const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "e1",
    kind: "authorised",
    title: "INTERCEPT SE-204 → TRACK 552 (Group-3 UAS) AUTHORISED · CDR. VOSS · ROE-AIR-DEFENSE-07",
    timestamp: "09:01:29Z",
  },
  {
    id: "e2",
    kind: "system",
    title: "GUARDIAN-7 external AEW&C onboarded via integration SDK",
    timestamp: "08:56:11Z",
  },
  {
    id: "e3",
    kind: "classification",
    title: "TRACK 552 reclassified HOSTILE · confidence 0.92 (Perception)",
    timestamp: "08:02:11Z",
  },
  {
    id: "e4",
    kind: "system",
    title: "REAPER 1-1 tasked INVESTIGATE TRACK 559 · authoriser CDR. VOSS",
    timestamp: "08:01:22Z",
  },
];

export const DATA_SOURCES: DataSource[] = [
  { label: "Maps", icon: "map", action: "arrow" },
  { label: "Sheets", icon: "sheet", action: "arrow" },
  { label: "Satellite Imagery", icon: "globe", action: "arrow" },
  { label: "MEGHA ISR | HYENA", icon: "globe", action: "arrow" },
  { label: "Historical Tracks", icon: "globe", action: "arrow" },
];

export const LIVE_LAYERS: DataSource[] = [
  { label: "Live Global Blue Force Tracks (BFT)", icon: "globe", action: "arrow" },
  { label: "Live Global ISR Assets", icon: "globe", action: "arrow" },
  { label: "Live Maritime Data", icon: "globe", action: "plus" },
];

/* ---- map markers (Jaffna, Sri Lanka — uis-master battle overview) -------- */
export const MAP_CENTER: [number, number] = [9.6615, 80.0255];
export const MAP_ZOOM = 11;

export const BATTLE_MAP_ENTITIES: BattleMapEntity[] = [
  { id: "e1", name: "MEGHA X STRIKER 1-1", type: "HYENA - Autonomous Strike UAV", affiliation: "FRND", confidence: "100%", position: [9.6715, 80.0155] },
  { id: "e2", name: "MEGHA X STRIKER 1-2", type: "HYENA - Autonomous Strike UAV", affiliation: "FRND", confidence: "100%", position: [9.6680, 80.0355] },
  { id: "e3", name: "SENTINEL ALPHA", type: "SENTINEL - Sentry C-UAS Node", affiliation: "FRND", confidence: "100%", position: [9.6515, 80.0055] },
  { id: "e4", name: "INTERCEPTOR-3", type: "SENTINEL - Mode 01 C-UAS Interceptor", affiliation: "FRND", confidence: "100%", position: [9.6815, 80.0255] },
  { id: "e5", name: "GUARDIAN-7", type: "SENTINEL Node 01 C-UAS Interceptor", affiliation: "FRND", confidence: "100%", position: [9.6415, 79.9955] },
  { id: "e6", name: "TRACK 552", type: "Group-3 UAS - Probable", affiliation: "HOST", confidence: "92%", position: [9.6915, 79.9655] },
  { id: "e7", name: "TRACK 553", type: "Group-3 UAS - Probable", affiliation: "HOST", confidence: "77%", position: [9.6750, 79.9755] },
  { id: "e8", name: "TRACK 559", type: "Rotary Wing - Unknown", affiliation: "UNK", confidence: "89%", position: [9.6315, 79.9555] },
  { id: "e9", name: "SEAHAWK", type: "Vessel - Data Link", affiliation: "NEUT", confidence: "95%", position: [9.6115, 80.0555] },
  { id: "e10", name: "CIVIL 4421", type: "Commercial Air - ADS-B", affiliation: "NEUT", confidence: "100%", position: [9.6815, 79.9855] },
];

/* ---- SOUL chat (seed thread + compose actions) ------------------------- */
export const SOUL_DEFAULT_REPLY =
  "Command acknowledged. Establishing real-time tracking parameters and redirecting available ISR assets to the designated coordinate bounding box.";

export const SOUL_CHAT_SEED: SoulChatMessage[] = [
  {
    id: "soul-op-1",
    role: "operator",
    variant: "intro",
    senderLabel: "OPERATOR | COMMANDER · ROE-ALPHA ›",
    text: "search the northern Jaffana and report any vehicles",
  },
  {
    id: "soul-ag-1",
    role: "agent",
    label: { who: "SOUL", pill: "GROUND DGX" },
    bubble:
      "Tasking MEGHA X STRIKER 1-1 + STRIKER 1-2 to grid search of the northern ridge. Estimated coverage 4 minutes.",
    code: {
      lines: [
        { key: "search_area", dim: "assets:", value: "STRIKER 1-1, STRIKER 1-2" },
        { dim: "region:", region: "northern_Jaffna" },
      ],
    },
    nested: {
      labels: [
        { who: "SOUL" },
        { who: "HYENA ISR-MEGHA X AGENT", sub: true, diamondColor: "var(--soul-chat-green)" },
      ],
      bubble:
        "SENTINEL ALPHA Radar Mesh Holds Two Low Contacts Inbound Over Jaffna Lagoon, NW Bearing Toward Gajaba HQ. Correlated To TRACK 552 (Group-3 UAS · 82%) And TRACK 553 (Group-3 UAS · 77%). TRACK 552 — Lead Track — 2,400 Ft, Closing. CIVIL 4421 Deconflicted Via ADS-B. Recommend Interceptor Engagement On TRACK 552. Requires Your Authorization.",
      bubbleSub: true,
    },
  },
  {
    id: "soul-ag-2",
    role: "agent",
    actionLayout: true,
    label: { who: "SOUL", pill: "GROUND DGX" },
    bubble:
      "Decision staged. INTERCEPT -> TRACK 552 with INTERCEPTOR-3, effector SE-204, positive seeker lock, 3 min to effect. 88% confidence. Three courses of action posted to DECIDE. Human gate required.",
    action: {
      buttonLabel: "REVIEW & AUTHORISE",
      code: {
        variant: "danger",
        dangerRows: [
          {
            key: "engage_target",
            pairs: [{ label: "target:", value: "TRACK 552" }],
          },
          {
            pairs: [
              { label: "asset:", value: "INTERCEPTOR-3" },
              { label: "effector:", value: "SE-204" },
            ],
          },
        ],
      },
    },
  },
];
