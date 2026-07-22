/**
 * @module PlaybackControls
 * @description Full-width bottom bar for simulation playback: a large
 * altitude-profile chart above a transport row (skip/step/play/scrubber/
 * speed). Previously a small floating pill centered at the bottom of the
 * viewer — restyled as a full-width panel to match the redesign
 * (SIMULATE.png), which shows the altitude chart directly above the
 * transport controls, spanning the width of the map.
 * @license GPL-3.0-only
 */

"use client";

import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
} from "lucide-react";
import { RedesignSkipBackIcon, RedesignSkipForwardIcon } from "./RedesignIcons";
import { useTranslations } from "next-intl";
import { useSimulationStore } from "@/stores/simulation-store";
import { useThrottledElapsed } from "@/hooks/use-throttled-elapsed";
import { formatEta } from "@/lib/simulation-utils";
import type { FlightPlan } from "@/lib/simulation-utils";
import type { Waypoint } from "@/lib/types";
import { AltitudeProfile } from "./AltitudeProfile";
import { cn } from "@/lib/utils";

const SPEED_OPTIONS = [1, 2, 4];

interface PlaybackControlsProps {
  waypoints: Waypoint[];
  flightPlan: FlightPlan;
  totalDuration: number;
}

export function PlaybackControls({ waypoints, flightPlan, totalDuration }: PlaybackControlsProps) {
  const t = useTranslations("simulate");
  const playbackState = useSimulationStore((s) => s.playbackState);
  const playbackSpeed = useSimulationStore((s) => s.playbackSpeed);
  const cameraMode = useSimulationStore((s) => s.cameraMode);
  const followHeadingLocked = useSimulationStore((s) => s.followHeadingLocked);
  const elapsed = useThrottledElapsed();
  const play = useSimulationStore((s) => s.play);
  const pause = useSimulationStore((s) => s.pause);
  const stop = useSimulationStore((s) => s.stop);
  const seek = useSimulationStore((s) => s.seek);
  const stepForward = useSimulationStore((s) => s.stepForward);
  const stepBack = useSimulationStore((s) => s.stepBack);
  const setSpeed = useSimulationStore((s) => s.setSpeed);
  const toggleFollowHeading = useSimulationStore((s) => s.toggleFollowHeading);

  const disabled = waypoints.length < 2;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#0a0c10]/95 backdrop-blur-md border-t border-[var(--redesign-border)]">
      {/* Altitude profile chart */}
      {!disabled && (
        <div className="px-4 pt-2 pb-1">
          <h3 className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mb-1">
            {t("altitudeProfile")}
          </h3>
          <div className="h-16">
            <AltitudeProfile waypoints={waypoints} flightPlan={flightPlan} />
          </div>
        </div>
      )}

      {/* Transport row */}
      <div className="flex items-center gap-2 px-4 py-2">
        <button
          onClick={stop}
          disabled={disabled}
          className="p-1 text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] disabled:opacity-30 cursor-pointer disabled:cursor-default"
          title={t("stopHome")}
        >
          <RedesignSkipBackIcon size={14} />
        </button>

        <button
          onClick={stepBack}
          disabled={disabled}
          className="p-1 text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] disabled:opacity-30 cursor-pointer disabled:cursor-default"
          title={t("stepBackLeft")}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={playbackState === "playing" ? pause : play}
          disabled={disabled}
          className="p-1.5 rounded-full bg-[var(--redesign-yellow)]/20 text-[var(--redesign-yellow)] hover:bg-[var(--redesign-yellow)]/30 disabled:opacity-30 cursor-pointer disabled:cursor-default"
          title={t("playPauseSpace")}
        >
          {playbackState === "playing" ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          onClick={stepForward}
          disabled={disabled}
          className="p-1 text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] disabled:opacity-30 cursor-pointer disabled:cursor-default"
          title={t("stepForwardRight")}
        >
          <ChevronRight size={14} />
        </button>

        <button
          onClick={() => seek(totalDuration)}
          disabled={disabled}
          className="p-1 text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] disabled:opacity-30 cursor-pointer disabled:cursor-default"
          title={t("skipToEndEnd")}
        >
          <RedesignSkipForwardIcon size={14} />
        </button>

        {/* Time display */}
        <span className="text-[11px] font-mono text-[var(--redesign-text-secondary)] w-24 text-center shrink-0">
          {formatEta(elapsed)} / {formatEta(totalDuration)}
        </span>

        {/* Scrubber — fills remaining width */}
        <input
          type="range"
          min={0}
          max={totalDuration || 1}
          step={Math.max(0.1, totalDuration / 1000)}
          value={elapsed}
          onChange={(e) => seek(Number(e.target.value))}
          disabled={disabled}
          className="flex-1 h-1 accent-[var(--redesign-yellow)] cursor-pointer disabled:cursor-default disabled:opacity-30"
          title={t("scrubber")}
        />

        {/* Speed selector — pill buttons instead of a dropdown, matching the redesign */}
        <div className="flex items-center gap-1 shrink-0">
          {SPEED_OPTIONS.map((speed) => (
            <button
              key={speed}
              onClick={() => setSpeed(speed)}
              disabled={disabled}
              className={cn(
                "px-2 py-1 text-[10px] font-mono rounded transition-colors cursor-pointer disabled:cursor-default disabled:opacity-30",
                playbackSpeed === speed
                  ? "bg-[var(--redesign-yellow)] text-[var(--redesign-bg-black)] font-semibold"
                  : "text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)]"
              )}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Follow-camera heading lock toggle (only visible in follow mode) */}
        {cameraMode === "follow" && (
          <button
            onClick={toggleFollowHeading}
            className="p-1 text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] cursor-pointer shrink-0"
            title={followHeadingLocked ? t("unlockCameraHeading") : t("lockCameraHeading")}
          >
            {followHeadingLocked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>
        )}
      </div>
    </div>
  );
}
