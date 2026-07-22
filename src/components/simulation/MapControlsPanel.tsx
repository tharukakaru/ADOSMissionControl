/**
 * @module MapControlsPanel
 * @description Map controls for the 3D simulation viewer: imagery mode toggle,
 * buildings checkbox, terrain exaggeration slider, and path label toggle.
 * Positioned in the top-left corner of the viewer.
 *
 * VISUAL REDESIGN NOTE: restyled to the checkbox-list layout from
 * SIMULATE.png. Two things I deliberately did NOT change, flagged here
 * rather than guessed:
 *  1. The redesign's top toggle reads "3D / 2D" — this viewer is Cesium-3D
 *     only, there's no 2D map mode in the app today. Relabeling the
 *     existing Dark/Satellite imagery toggle to say "3D/2D" would be
 *     mislabeling a real control, so I kept it as Dark/Satellite (same
 *     position/style as the redesign's top toggle). If you actually want a
 *     real 2D (flat map) mode added, that's a real feature, not a style fix.
 *  2. The redesign shows "Terrain" as a plain checkbox. The app's terrain
 *     control is a 1x–5x exaggeration slider (real, useful range). I kept
 *     the slider so you don't lose that control, just restyled it to sit
 *     inline with the other checkbox rows. Say the word if you'd rather it
 *     be a simple on/off.
 * "Buildings" and "Camera triggers" rows aren't in the redesign screenshot;
 * kept them (same functionality) below the redesigned rows so nothing you
 * had before disappears silently.
 * @license GPL-3.0-only
 */

"use client";

import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/stores/settings-store";
import { cn } from "@/lib/utils";

interface MapControlsPanelProps {
  hasIonToken: boolean;
}

export function MapControlsPanel({ hasIonToken }: MapControlsPanelProps) {
  const t = useTranslations("simulate");
  const imageryMode = useSettingsStore((s) => s.cesiumImageryMode);
  const setImageryMode = useSettingsStore((s) => s.setCesiumImageryMode);
  const buildingsEnabled = useSettingsStore((s) => s.cesiumBuildingsEnabled);
  const setBuildingsEnabled = useSettingsStore((s) => s.setCesiumBuildingsEnabled);
  const terrainExaggeration = useSettingsStore((s) => s.terrainExaggeration);
  const setTerrainExaggeration = useSettingsStore((s) => s.setTerrainExaggeration);
  const showLabels = useSettingsStore((s) => s.showPathLabels);
  const setShowLabels = useSettingsStore((s) => s.setShowPathLabels);
  const showCameraTriggers = useSettingsStore((s) => s.showCameraTriggers);
  const setShowCameraTriggers = useSettingsStore((s) => s.setShowCameraTriggers);

  const buildingsDisabled = !hasIonToken;

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2.5 p-3 w-40 bg-[#0a0c10]/90 backdrop-blur-md border border-[var(--redesign-border)] rounded-lg">
      <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider text-center">
        {t("map")}
      </span>

      {/* Imagery toggle (Dark / Satellite — see note above re: "3D/2D") */}
      <div className="flex gap-1">
        <button
          onClick={() => setImageryMode("dark")}
          className={cn(
            "h-6 rounded text-[10px] font-mono font-semibold flex-1 transition-colors cursor-pointer",
            imageryMode === "dark"
              ? "bg-[var(--redesign-yellow)] text-[var(--redesign-bg-black)]"
              : "text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] border border-[var(--redesign-border)]"
          )}
        >
          {t("dark")}
        </button>
        <button
          onClick={() => setImageryMode("satellite")}
          title={t("satelliteImagery")}
          className={cn(
            "h-6 rounded text-[10px] font-mono font-semibold flex-1 transition-colors cursor-pointer",
            imageryMode === "satellite"
              ? "bg-[var(--redesign-yellow)] text-[var(--redesign-bg-black)]"
              : "text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] border border-[var(--redesign-border)]"
          )}
        >
          {t("satelliteShort")}
        </button>
      </div>

      <div className="h-px bg-[var(--redesign-border)]" />

      {/* Satellite imagery quick checkbox — mirrors the toggle above so the
          "Satellite" row from the redesign is present even though imagery
          mode is really a 2-way toggle, not an independent boolean. */}
      <label className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--redesign-text-secondary)] cursor-pointer">
        <input
          type="checkbox"
          checked={imageryMode === "satellite"}
          onChange={(e) => setImageryMode(e.target.checked ? "satellite" : "dark")}
          className="w-3 h-3 rounded accent-[var(--redesign-yellow)]"
        />
        {t("satelliteShort")}
      </label>

      {/* Terrain exaggeration */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--redesign-text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={terrainExaggeration > 1}
              onChange={(e) => setTerrainExaggeration(e.target.checked ? 2 : 1)}
              className="w-3 h-3 rounded accent-[var(--redesign-yellow)]"
            />
            {t("terrain")}
          </label>
          <span className="text-[9px] font-mono text-[var(--redesign-text-secondary)]">{terrainExaggeration}x</span>
        </div>
        {terrainExaggeration > 1 && (
          <input
            type="range"
            min={1}
            max={5}
            step={0.5}
            value={terrainExaggeration}
            onChange={(e) => setTerrainExaggeration(parseFloat(e.target.value))}
            className="w-full h-1 rounded-full appearance-none bg-[var(--redesign-border)] accent-[var(--redesign-yellow)] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--redesign-yellow)]"
          />
        )}
      </div>

      {/* Labels */}
      <label className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--redesign-text-secondary)] cursor-pointer">
        <input
          type="checkbox"
          checked={showLabels}
          onChange={(e) => setShowLabels(e.target.checked)}
          className="w-3 h-3 rounded accent-[var(--redesign-yellow)]"
        />
        {t("labels")}
      </label>

      <div className="h-px bg-[var(--redesign-border)]" />

      {/* Buildings — not shown in the redesign screenshot, kept so the
          feature isn't silently lost */}
      <label
        className={cn(
          "flex items-center gap-1.5 text-[10px] font-mono text-[var(--redesign-text-secondary)] cursor-pointer",
          buildingsDisabled && "opacity-50"
        )}
        title={buildingsDisabled ? t("requiresCesiumIonToken") : t("toggle3dBuildings")}
      >
        <input
          type="checkbox"
          checked={buildingsEnabled}
          disabled={buildingsDisabled}
          onChange={(e) => setBuildingsEnabled(e.target.checked)}
          className="w-3 h-3 rounded accent-[var(--redesign-yellow)]"
        />
        {t("buildings")}
      </label>

      {/* Camera trigger markers — also not in the redesign screenshot, kept */}
      <label className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--redesign-text-secondary)] cursor-pointer">
        <input
          type="checkbox"
          checked={showCameraTriggers}
          onChange={(e) => setShowCameraTriggers(e.target.checked)}
          className="w-3 h-3 rounded accent-[var(--redesign-yellow)]"
        />
        {t("cameraTriggers")}
      </label>
    </div>
  );
}
