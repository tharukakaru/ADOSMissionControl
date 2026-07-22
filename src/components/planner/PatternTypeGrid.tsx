"use client";

/**
 * @module PatternTypeGrid
 * @description 2x3 icon-button grid for choosing the active flight pattern
 * type — the visual alternative to the plain <Select> dropdown, matching
 * the ARC OS mockup. Five buttons map 1:1 onto a real PlannerTool pattern
 * type (survey / orbit / corridor / a SAR variant / structure scan); the
 * sixth, "Free draw", isn't a pattern type at all — it activates the map's
 * polygon drawing tool directly, the same mechanism GeofenceEditor uses,
 * so the operator can sketch custom geometry instead of generating one of
 * the parametric patterns.
 *
 * The three real SAR pattern types (expandingSquare / sectorSearch /
 * parallelTrack) are intentionally collapsed into one "SAR Grid" button
 * here, since the mockup shows a single SAR entry — it selects Parallel
 * Track, the most common grid-style search pattern. All three remain
 * individually selectable via the detailed config UI rendered below the
 * grid once a SAR type is active (no capability is removed, only the
 * entry point is simplified to one button).
 *
 * @license GPL-3.0-only
 */

import type { ComponentType } from "react";
import {
  Grid3x3,
  Orbit,
  MoveHorizontal,
  Search,
  Building2,
  PenTool,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlannerStore } from "@/stores/planner-store";
import type { PatternType } from "@/stores/pattern-store";

interface PatternTypeButton {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  /** Pattern type to activate, or null for the "Free draw" tool button. */
  patternType: PatternType;
}

const BUTTONS: PatternTypeButton[] = [
  { key: "survey", label: "Survey", icon: Grid3x3, patternType: "survey" },
  { key: "orbit", label: "Orbit", icon: Orbit, patternType: "orbit" },
  {
    key: "corridor",
    label: "Corridor",
    icon: MoveHorizontal,
    patternType: "corridor",
  },
  { key: "sar", label: "SAR Grid", icon: Search, patternType: "parallelTrack" },
  {
    key: "structure",
    label: "Structure",
    icon: Building2,
    patternType: "structureScan",
  },
  { key: "freeDraw", label: "Free draw", icon: PenTool, patternType: null },
];

interface PatternTypeGridProps {
  activeType: PatternType;
  onSelectType: (type: NonNullable<PatternType>) => void;
}

export function PatternTypeGrid({
  activeType,
  onSelectType,
}: PatternTypeGridProps) {
  const setActiveTool = usePlannerStore((s) => s.setActiveTool);
  const activeTool = usePlannerStore((s) => s.activeTool);

  return (
    <div className="grid grid-cols-2 gap-1.5 px-3 pt-2">
      {BUTTONS.map(({ key, label, icon: Icon, patternType }) => {
        const isActive = patternType
          ? activeType === patternType
          : activeTool === "polygon";
        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (patternType) {
                onSelectType(patternType);
              } else {
                // Free draw isn't a pattern type — it hands geometry input
                // straight to the map's polygon tool, same as GeofenceEditor.
                setActiveTool("polygon");
              }
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-mono font-semibold uppercase tracking-wide border transition-colors cursor-pointer",
              isActive
                ? "bg-brand-arc/15 border-brand-arc text-brand-arc"
                : "bg-bg-tertiary border-border-default text-text-secondary hover:bg-bg-tertiary/70 hover:text-text-primary",
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
