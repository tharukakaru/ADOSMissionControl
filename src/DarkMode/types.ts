// Shared domain types for the ARC OS · SENTINEL screen.

export type Classification =
  | "FRIENDLY"
  | "HOSTILE"
  | "UNKNOWN"
  | "NEUTRAL"
  | "PENDING";

export type TrackIcon = "plane" | "ship" | "drone" | "sub";

export interface Track {
  id: string; // TRK-XXXX
  callsign: string; // e.g. VIPER-01
  platform: string; // e.g. F-35A Lightning II
  icon: TrackIcon;
  classification: Classification;
  threat: number; // 0-100
}

export type EventSource = "SENTINEL" | "FUSION" | "C2";

export interface LogEvent {
  time: string; // HH:MM:SS
  source: EventSource;
  body: string;
}

export interface TewaEntry {
  id: string;
  type: string;
  bearing: string; // e.g. 47°
  range: string; // e.g. 312km
  tti: string; // time-to-intercept, "—" if none
  imminent: boolean; // renders TTI in red
}

export interface Battery {
  name: string;
  role: string; // SAM · Long Range
  ready: number; // numerator
  total: number; // denominator
}

export interface Sensor {
  name: string;
  kind: string; // X-band Radar
  load: number; // 0-100
  online: boolean;
  overloaded: boolean; // renders bar red
}

export interface Gauge {
  label: string;
  value: number;
  max: number;
  display: string; // formatted value shown in center
  color: "lime" | "cyan" | "green" | "amber";
}

export interface BlipSpec {
  id: string;
  bearing: number; // degrees from north
  rangeFraction: number; // 0-1 of scope radius
  color: "red" | "amber" | "cyan";
}

export interface Kinematics {
  heading: number; // degrees
  speed: string;
  altitude: string;
  updated: string;
}

export interface SelectedTrackDetail {
  callsign: string;
  id: string;
  platform: string;
  classification: Classification;
  domain: string; // AIR / SURFACE / SUBSURFACE
  iff: string; // IFF Friend
  threatLevel: string; // 1/100
  idConfidence: number; // 0-100
  kinematics: Kinematics;
}
