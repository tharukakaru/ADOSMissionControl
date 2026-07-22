"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Maximize2 } from "lucide-react";
import { OsdOverlay } from "@/components/flight/OsdOverlay";
import { FlyViewInstrumentStrip } from "@/components/flight/FlyViewInstrumentStrip";
import { FlyRightRail } from "@/components/flight/FlyRightRail";
import { C2HealthPanel } from "@/components/c2/C2HealthPanel";
import { MapHudCard } from "@/components/flight/MapHudCard";
import { ProximityRadar } from "@/components/flight/ProximityRadar";
import { RecordingControls } from "@/components/shared/RecordingControls";
import { useUiStore } from "@/stores/ui-store";
import { useTelemetryLatest } from "@/hooks/use-telemetry-latest";
import { useDroneStore } from "@/stores/drone-store";
import type { FleetDrone } from "@/lib/types";

const OverviewMap = dynamic(
  () => import("@/components/flight/OverviewMap").then((m) => m.OverviewMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#0a0a0a] border border-border-default flex items-center justify-center">
        <span className="text-[10px] font-mono text-text-tertiary">Loading Map...</span>
      </div>
    ),
  }
);

interface DroneOverviewTabProps {
  drone: FleetDrone;
}

type RightPanel = "map" | "fly";

function FeedMiniMap() {
  // NOTE: target shows a street/port map here. Without that map asset we fall
  // back to a darkened crop; swap the <img src> for your map image when ready.
  return (
    <div className="absolute bottom-3 left-3 z-10 w-56 h-36 rounded-xl border border-border-default overflow-hidden shadow-lg pointer-events-none">
      <img src="/c2/thermal-bg.png" alt="" className="w-full h-full object-cover opacity-70" />
      <div className="absolute bottom-3 left-3 text-brand-arc text-lg">↗</div>
    </div>
  );
}

export function DroneOverviewTab({ drone }: DroneOverviewTabProps) {
  const t = useTranslations("droneDetail");
  const [rightPanel, setRightPanel] = useState<RightPanel>("fly");
  const immersiveMode = useUiStore((s) => s.immersiveMode);
  const enterImmersiveMode = useUiStore((s) => s.enterImmersiveMode);
  const pos = useTelemetryLatest("position");
  const vfr = useTelemetryLatest("vfr");
  const gps = useTelemetryLatest("gps");
  const armState = useDroneStore((s) => s.armState);
  const flightMode = useDroneStore((s) => s.flightMode);
  const [mapPaused, setMapPaused] = useState(false);

  const flyMode = rightPanel === "fly";

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Feed (left) + right rail */}
      <div className="flex-1 min-h-0 flex">
        <div className="relative flex-1 min-w-0 overflow-hidden">
          {rightPanel === "map" ? (
            <OverviewMap />
          ) : (
            <>
              {/* Thermal/camera feed — full bleed */}
              <img src="/c2/thermal-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover select-none" draggable={false} />
              <div className="absolute inset-0 bg-[#070a12]/45 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,8,16,0.55)_100%)]" />

              {/* HUD */}
              <div className="absolute inset-0"><OsdOverlay /></div>

              {/* Proximity radar */}
              <div className="absolute inset-0 pointer-events-none"><ProximityRadar /></div>

              {/* Minimap — bottom-left */}
              <FeedMiniMap />
            </>
          )}

          {/* Fly/Map toolbar — floats over the map/video instead of taking
              its own full-width row that pushes content down. This used to
              be a static flex row above the feed/map container (its own
              horizontal strip, full height, pushing everything else down);
              the redesign has it as a translucent bar overlaying the top
              of the viewport instead — fixed by making this `absolute`
              inside the same relative container the map/feed renders in. */}
          {!immersiveMode && (
            <div className="absolute top-2 left-2 right-2 z-20 flex items-center gap-2">
              {/* Bar 1 — Fly / Map (separated into its own floating bar) */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[var(--redesign-bg-panel)]/90 backdrop-blur-sm border border-[var(--redesign-border)] shrink-0">
                <button
                  onClick={() => setRightPanel("fly")}
                  className={flyMode
                    ? "px-3 py-1 text-xs font-mono font-semibold text-[var(--redesign-bg-black)] bg-[var(--redesign-yellow)] rounded shrink-0"
                    : "px-3 py-1 text-xs font-mono text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] transition-colors rounded shrink-0"}
                >
                  {t("fly")}
                </button>
                <button
                  onClick={() => setRightPanel("map")}
                  className={!flyMode
                    ? "px-3 py-1 text-xs font-mono font-semibold text-[var(--redesign-bg-black)] bg-[var(--redesign-yellow)] rounded shrink-0"
                    : "px-3 py-1 text-xs font-mono text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] transition-colors rounded shrink-0"}
                >
                  {t("map")}
                </button>
              </div>

              {/* Bar 2 — telemetry strip + controls */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[var(--redesign-bg-panel)]/90 backdrop-blur-sm border border-[var(--redesign-border)] flex-1 min-w-0">
                <FlyViewInstrumentStrip />
                <button
                  onClick={enterImmersiveMode}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] transition-colors shrink-0"
                  title="Enter immersive mode"
                >
                  <Maximize2 size={12} />
                  {t("immersive")}
                </button>
                <RecordingControls />
              </div>
            </div>
          )}

          {/* Health/loadout card — top-left, below the floating toolbar
              (fly mode only). Shifted down from top-3 to top-14 so it
              doesn't sit underneath the toolbar now that the toolbar
              floats over the same area instead of pushing content down. */}
          {flyMode && (
            <div className="absolute top-14 left-3 z-10 pointer-events-none"><C2HealthPanel /></div>
          )}

          {rightPanel === "map" && (
            <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
              <MapHudCard
                sats={gps?.satellites ?? 0}
                linked={armState !== undefined}
                mode={(flightMode || "AUTO").toUpperCase()}
                alt={pos?.alt ?? vfr?.alt ?? 0}
                speed={vfr?.groundspeed ?? pos?.groundSpeed ?? 0}
                heading={pos?.heading ?? vfr?.heading ?? 0}
                vspeed={vfr?.climb ?? pos?.climbRate ?? 0}
                paused={mapPaused}
                onTogglePause={() => setMapPaused((v) => !v)}
                onExpand={() => setRightPanel("fly")}
              />
            </div>
          )}
        </div>

        {/* Right rail — shown in both Fly and Map modes now. Previously
            gated to `flyMode` only, which is why Map mode used to show just
            the map with no gauges/action buttons/flight logs at all —
            FLY_MAP.png clearly keeps the same right rail visible in Map
            mode, just the main content switches from video feed to map. */}
        {!immersiveMode && <FlyRightRail drone={drone} />}
      </div>
    </div>
  );
}
