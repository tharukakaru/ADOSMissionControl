import type {
  Track,
  LogEvent,
  TewaEntry,
  Battery,
  Sensor,
  Gauge,
  BlipSpec,
  SelectedTrackDetail,
} from "../types";

export const TRACKS: Track[] = [
  { id: "TRK-0421", callsign: "VIPER-01", platform: "F-35A Lightning II", icon: "plane", classification: "FRIENDLY", threat: 4 },
  { id: "TRK-0588", callsign: "SEAHAWK", platform: "Cargo Vessel · 184m", icon: "ship", classification: "NEUTRAL", threat: 12 },
  { id: "TRK-0612", callsign: "BANDIT-04", platform: "Su-57 Felon", icon: "plane", classification: "HOSTILE", threat: 88 },
  { id: "TRK-0634", callsign: "GHOST-7", platform: "Unidentified UAS", icon: "drone", classification: "UNKNOWN", threat: 47 },
  { id: "TRK-0701", callsign: "REAPER-12", platform: "MQ-9 Reaper", icon: "plane", classification: "FRIENDLY", threat: 2 },
  { id: "TRK-0744", callsign: "KILO-3", platform: "Kilo-class SSK", icon: "sub", classification: "HOSTILE", threat: 76 },
  { id: "TRK-0769", callsign: "ROOK-2", platform: "DDG-114 Destroyer", icon: "ship", classification: "FRIENDLY", threat: 1 },
  { id: "TRK-0812", callsign: "PENDING", platform: "New Contact · classifying", icon: "plane", classification: "PENDING", threat: 0 },
  { id: "TRK-0833", callsign: "EAGLE-09", platform: "E-3 Sentry AWACS", icon: "plane", classification: "FRIENDLY", threat: 1 },
  { id: "TRK-0901", callsign: "BANDIT-09", platform: "Missile Corvette", icon: "ship", classification: "HOSTILE", threat: 81 },
];

export const DEFAULT_SELECTED_ID = "TRK-0833";

export const EVENTS: LogEvent[] = [
  { time: "17:44:51", source: "SENTINEL", body: "Inbound cruise missile detected · TRK-0612 · ENGAGE authorized" },
  { time: "17:44:39", source: "FUSION", body: "Track TRK-0634 reclassified UNKNOWN → low confidence" },
  { time: "17:44:12", source: "C2", body: "VIPER-01 assigned CAP station ALPHA" },
];

export const TEWA: TewaEntry[] = [
  { id: "TRK-0612", type: "Cruise Missile · KH-101", bearing: "47°", range: "312km", tti: "184s", imminent: false },
  { id: "TRK-0901", type: "Anti-Ship Missile", bearing: "132°", range: "88km", tti: "62s", imminent: true },
  { id: "TRK-0634", type: "Loitering UAS Swarm", bearing: "290°", range: "140km", tti: "—", imminent: false },
  { id: "TRK-0744", type: "Subsurface Contact", bearing: "201°", range: "56km", tti: "—", imminent: false },
];

export const BATTERIES: Battery[] = [
  { name: "PATRIOT PAC-3", role: "SAM · Long Range", ready: 6, total: 8 },
  { name: "NASAMS", role: "SAM · Medium", ready: 4, total: 6 },
  { name: "C-RAM PHALANX", role: "CIWS · Point", ready: 2, total: 2 },
  { name: "THAAD", role: "BMD · Exo-atmo", ready: 6, total: 8 },
];

export const SENSORS: Sensor[] = [
  { name: "AN/TPY-2", kind: "X-band Radar", load: 78, online: true, overloaded: false },
  { name: "SENTINEL A4", kind: "AESA Radar", load: 54, online: true, overloaded: false },
  { name: "ELINT-7", kind: "Signals Intel", load: 91, online: true, overloaded: true },
  { name: "EO/IR MAST", kind: "Electro-Optical", load: 33, online: true, overloaded: false },
  { name: "SOSUS-M", kind: "Hydrophone Array", load: 46, online: true, overloaded: false },
];

export const SCOPE_STATS = [
  { key: "detect", label: "Detect", value: "312 KM" },
  { key: "react", label: "React Time", value: "62 S" },
  { key: "cue", label: "Cue Rate", value: "18/MIN" },
] as const;

export const BLIPS: BlipSpec[] = [
  { id: "0612", bearing: 48, rangeFraction: 0.78, color: "red" },
  { id: "0634", bearing: 290, rangeFraction: 0.42, color: "red" },
  { id: "0744", bearing: 202, rangeFraction: 0.18, color: "amber" },
  { id: "0901", bearing: 150, rangeFraction: 0.22, color: "red" },
];

export const GAUGES: Gauge[] = [
  { label: "TARGETS", value: 29, max: 40, display: "29", color: "lime" },
  { label: "SENSOR LOAD", value: 44.7, max: 100, display: "44.7", color: "cyan" },
  { label: "NET LATENCY", value: 47, max: 120, display: "47", color: "green" },
  { label: "THREAT IDX", value: 10.4, max: 100, display: "10.4", color: "amber" },
];

export const SELECTED_DETAIL: SelectedTrackDetail = {
  callsign: "EAGLE-09",
  id: "TRK-0833",
  platform: "E-3 Sentry AWACS",
  classification: "FRIENDLY",
  domain: "AIR",
  iff: "IFF Friend",
  threatLevel: "1/100",
  idConfidence: 99,
  kinematics: { heading: 150, speed: "360 KTS", altitude: "35,000 FT", updated: "0.4s ago" },
};

export const SUGGESTIONS = [
  { id: "threats", label: "Summarize highest-priority threats", icon: "shield" },
  { id: "bandit", label: "What is BANDIT-04 doing?", icon: "clock" },
  { id: "geometry", label: "Recommend intercept geometry", icon: "line" },
  { id: "confidence", label: "Assess air picture confidence", icon: "check" },
] as const;

export const TABS = ["COP", "SENTINEL", "C2"] as const;
export const FILTERS = ["ALL", "HOSTILE", "UNKNOWN", "FRIENDLY", "NEUTRAL"] as const;
