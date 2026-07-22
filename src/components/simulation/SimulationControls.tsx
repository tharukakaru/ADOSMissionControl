/**
 * @module SimulationControls
 * @description Camera mode buttons, quick actions, history, and keyboard
 * shortcuts reference for the simulation panel. Pure presentational; receives
 * data and callbacks from the parent.
 *
 * VISUAL REDESIGN NOTE: Camera modes are now a 2x2 grid (was a 4-across
 * row) and Quick Actions are full-width stacked rows with left-aligned
 * icon + label (was two side-by-side centered buttons), matching
 * SIMULATE.png. History and keyboard-shortcuts sections aren't part of the
 * redesign screenshot — left in place (collapsed by default) but restyled
 * to the new palette so they don't look out of place if expanded.
 * @license GPL-3.0-only
 */

"use client";

import { useTranslations } from "next-intl";
import {
  ChevronRight,
  ChevronDown,
  Clock,
  Trash2,
  Keyboard,
} from "lucide-react";
import { RedesignPlusIcon, RedesignDownloadIcon } from "./RedesignIcons";
import type { SimHistoryEntry } from "@/lib/types";
import type { CameraMode } from "@/stores/simulation-store";
import { formatDuration } from "@/lib/utils";
import { timeAgo } from "@/lib/plan-library";
import { cn } from "@/lib/utils";

interface CameraModeOption {
  id: CameraMode;
  label: string;
  key: string;
  title: string;
}

interface ShortcutEntry {
  key: string;
  action: string;
}

interface SimulationControlsProps {
  cameraModes: CameraModeOption[];
  cameraMode: CameraMode;
  onSetCameraMode: (id: CameraMode) => void;
  onEditInPlanner: () => void;
  onExport: () => void;
  exportDisabled: boolean;
  historyEntries: SimHistoryEntry[];
  historyExpanded: boolean;
  onToggleHistory: () => void;
  onClearHistory: () => void;
  shortcutsExpanded: boolean;
  onToggleShortcuts: () => void;
  shortcuts: ShortcutEntry[];
}

export function SimulationControls({
  cameraModes,
  cameraMode,
  onSetCameraMode,
  onEditInPlanner,
  onExport,
  exportDisabled,
  historyEntries,
  historyExpanded,
  onToggleHistory,
  onClearHistory,
  shortcutsExpanded,
  onToggleShortcuts,
  shortcuts,
}: SimulationControlsProps) {
  const t = useTranslations("simulate");

  return (
    <>
      {/* Camera mode buttons (2x2 grid) */}
      <div className="px-3 py-2.5 border-b border-[var(--redesign-border)]">
        <h3 className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mb-2">
          {t("camera")}
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {cameraModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSetCameraMode(mode.id)}
              title={mode.title}
              className={cn(
                "px-2 py-1.5 text-[11px] font-mono rounded transition-colors cursor-pointer text-center",
                cameraMode === mode.id
                  ? "bg-[var(--redesign-yellow)] text-[var(--redesign-bg-black)] font-semibold"
                  : "text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)]"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions (stacked, full width) */}
      <div className="px-3 py-2.5 border-b border-[var(--redesign-border)]">
        <h3 className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider mb-2">
          {t("quickActions")}
        </h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={onEditInPlanner}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-mono text-[var(--redesign-text-primary)] bg-white/5 hover:bg-white/10 rounded border border-[var(--redesign-border)] transition-colors cursor-pointer"
          >
            <RedesignPlusIcon size={12} />
            Add to Planner
          </button>
          <button
            onClick={onExport}
            disabled={exportDisabled}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-mono text-[var(--redesign-text-primary)] bg-white/5 hover:bg-white/10 rounded border border-[var(--redesign-border)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RedesignDownloadIcon size={12} />
            {t("export")}
          </button>
        </div>
      </div>

      {/* History (collapsible) */}
      {historyEntries.length > 0 && (
        <div className="border-b border-[var(--redesign-border)]">
          <button
            onClick={onToggleHistory}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {historyExpanded ? (
              <ChevronDown size={10} className="text-[var(--redesign-text-secondary)]" />
            ) : (
              <ChevronRight size={10} className="text-[var(--redesign-text-secondary)]" />
            )}
            <h3 className="text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider">
              {t("history", { count: historyEntries.length })}
            </h3>
          </button>

          {historyExpanded && (
            <div className="px-3 pb-2">
              <div className="space-y-1">
                {historyEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2 px-1.5 py-1"
                  >
                    <Clock size={10} className="text-[var(--redesign-text-secondary)] shrink-0" />
                    <span className="text-[10px] font-mono text-[var(--redesign-text-primary)] truncate flex-1">
                      {entry.planName}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--redesign-text-secondary)]">
                      {formatDuration(entry.duration)}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--redesign-text-secondary)]">
                      {timeAgo(entry.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1 mt-2 text-[10px] text-[var(--redesign-text-secondary)] hover:text-status-error transition-colors cursor-pointer"
              >
                <Trash2 size={10} />
                {t("clearHistory")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Keyboard Shortcuts (collapsible) */}
      <div className="px-3 py-2.5">
        <button
          onClick={onToggleShortcuts}
          className="w-full flex items-center gap-2 text-[9px] font-mono text-[var(--redesign-text-secondary)] uppercase tracking-wider hover:text-[var(--redesign-text-secondary)] cursor-pointer"
        >
          <Keyboard size={12} />
          {t("keyboardShortcuts")}
          {shortcutsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        {shortcutsExpanded && (
          <div className="mt-2 space-y-1">
            {shortcuts.map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <kbd className="inline-block min-w-[28px] text-center px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-[var(--redesign-text-secondary)]">
                  {s.key}
                </kbd>
                <span className="text-xs text-[var(--redesign-text-secondary)]">{s.action}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
