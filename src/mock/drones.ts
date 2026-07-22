import type { FleetDrone, DroneStatus, FlightMode } from "@/lib/types";

export interface DemoDroneConfig {
  id: string;
  name: string;
  status: DroneStatus;
  flightMode: FlightMode;
  suiteName?: string;
  homeLat: number;
  homeLon: number;
  homeAlt: number;
  batteryStart: number;
  pathIndex: number; // index into FLIGHT_PATHS
  healthScore: number;
  hasAgent?: boolean;
  /** When set, the engine spawns an INavMockProtocol instead of MockProtocol. */
  firmwareTag?: "inav-copter" | "inav-plane";
}

/**
 * 5 demo drones in Bangalore area (HAL Airport / Whitefield).
 */
export const DEMO_DRONES: DemoDroneConfig[] = [
  {
    id: "alpha-1",
    name: "MEGHA X",
    status: "in_mission",
    flightMode: "AUTO",
    suiteName: "Sentry · grid search N",
    homeLat: 12.950,
    homeLon: 77.668,
    homeAlt: 0,
    batteryStart: 47,
    pathIndex: 0,
    healthScore: 95,
    hasAgent: true,
  },
  {
    id: "bravo-2",
    name: "MEGHA X0",
    status: "online",
    flightMode: "AUTO",
    suiteName: "Survey · standby pad 2",
    homeLat: 12.955,
    homeLon: 77.673,
    homeAlt: 0,
    batteryStart: 88,
    pathIndex: 1,
    healthScore: 88,
    hasAgent: true,
  },
  {
    id: "echo-5",
    name: "MEGHA 1X",
    status: "idle",
    flightMode: "STABILIZE",
    suiteName: "Cargo · maintenance",
    homeLat: 12.940,
    homeLon: 77.683,
    homeAlt: 0,
    batteryStart: 61,
    pathIndex: -1,
    healthScore: 61,
  },
  {
    id: "charlie",
    name: "RAVEN 001",
    status: "in_mission",
    flightMode: "AUTO",
    suiteName: "SAR · corridor sweep",
    homeLat: 12.935,
    homeLon: 77.660,
    homeAlt: 0,
    batteryStart: 73,
    pathIndex: 2,
    healthScore: 73,
    hasAgent: true,
  },
  {
    id: "delta",
    name: "MEGHA X0",
    status: "returning",
    flightMode: "RTL",
    suiteName: "Low battery · returning",
    homeLat: 12.953,
    homeLon: 77.662,
    homeAlt: 0,
    batteryStart: 19,
    pathIndex: 3,
    healthScore: 60,
  },
];

/** Convert config to initial FleetDrone state. */
export function configToFleetDrone(cfg: DemoDroneConfig): FleetDrone {
  return {
    id: cfg.id,
    name: cfg.name,
    status: cfg.status,
    suiteName: cfg.suiteName,
    connectionState: cfg.status === "maintenance" ? "disconnected" : "connected",
    flightMode: cfg.flightMode,
    armState: cfg.status === "in_mission" ? "armed" : "disarmed",
    lastHeartbeat: 1740600000000,
    healthScore: cfg.healthScore,
    hasAgent: cfg.hasAgent,
    position: {
      timestamp: 1740600000000,
      lat: cfg.homeLat,
      lon: cfg.homeLon,
      alt: cfg.status === "in_mission" ? 50 : 0,
      relativeAlt: cfg.status === "in_mission" ? 50 : 0,
      heading: 0,
      groundSpeed: 0,
      airSpeed: 0,
      climbRate: 0,
    },
    battery: {
      timestamp: 1740600000000,
      voltage: 22.2 * (cfg.batteryStart / 100),
      current: cfg.status === "in_mission" ? 12.5 : 0,
      remaining: cfg.batteryStart,
      consumed: (100 - cfg.batteryStart) * 22,
    },
    gps: {
      timestamp: 1740600000000,
      fixType: cfg.status === "maintenance" ? 0 : 3,
      satellites: cfg.status === "maintenance" ? 0 : 17,
      hdop: 1.0,
      lat: cfg.homeLat,
      lon: cfg.homeLon,
      alt: 10,
    },
  };
}
