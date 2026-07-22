/**
 * @module node-detail/surfaces/drone
 * @description Surfaces for a drone (flight-controller) node, ordered to match
 * the ARC OS HYENA target: Overview → Flights → Calibrate → Parameters →
 * Configure. Radio and the universal companion surfaces (Agent, System, Black
 * Box, Plugins) are intentionally omitted from the C2 rebrand.
 * @license GPL-3.0-only
 */

import { DroneOverviewTab } from "@/components/drone-detail/DroneOverviewTab";
import { DroneFlightsTab } from "@/components/drone-detail/DroneFlightsTab";
import { DroneConfigureTab } from "@/components/drone-detail/DroneConfigureTab";
import { DroneVisionTab } from "@/components/drone-detail/DroneVisionTab";
import { ParametersPanel } from "@/components/fc/parameters/ParametersPanel";
import { CalibrationPanel } from "@/components/fc/calibration/CalibrationPanel";
import { LinkUpPlaceholder } from "@/components/shared/link-up/LinkUpPlaceholder";
import type { SurfaceSpec } from "../surface-types";

export const DRONE_SURFACES: SurfaceSpec[] = [
  {
    id: "overview",
    labelKey: "dronePanel.overview",
    render: (ctx) => <DroneOverviewTab drone={ctx.drone} />,
  },
  {
    id: "flights",
    labelKey: "dronePanel.flights",
    render: (ctx) => <DroneFlightsTab droneId={ctx.droneId} />,
  },
  {
    // Calibrate sits between Flights and Parameters to match the target.
    // CalibrationPanel pulls its own connection state from the drone
    // manager, so it shows the live wizards when linked and an idle state
    // otherwise — no extra gating needed here.
    id: "calibrate",
    labelKey: "dronePanel.calibrate",
    render: () => <CalibrationPanel />,
  },
  {
    id: "parameters",
    labelKey: "dronePanel.parameters",
    render: (ctx) =>
      ctx.isConnected ? (
        <ParametersPanel />
      ) : (
        <LinkUpPlaceholder variant="no-fc-direct" droneName={ctx.displayName} />
      ),
  },
  {
    id: "configure",
    labelKey: "dronePanel.configure",
    render: (ctx) => (
      <DroneConfigureTab
        droneId={ctx.droneId}
        droneName={ctx.displayName}
        isConnected={ctx.isConnected}
        fcLinking={ctx.fcLinking}
      />
    ),
  },
  {
    // Vision stays capability-gated (only appears when a vision peripheral is
    // present). Radio has been removed from the C2 rebrand.
    id: "vision",
    labelKey: "dronePanel.vision",
    when: (ctx) => ctx.visionPresent,
    render: (ctx) => <DroneVisionTab droneId={ctx.droneId} />,
  },
];
