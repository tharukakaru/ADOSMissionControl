"use client";

import { useState } from "react";
import { Home, ArrowDownToLine, Pause, Power, ArrowUpFromLine, XOctagon, Skull, Play } from "lucide-react";
import { useDroneStore } from "@/stores/drone-store";
import { useDroneManager } from "@/stores/drone-manager";
import { useUiStore } from "@/stores/ui-store";
import { FlightModeSelector } from "@/components/shared/flight-mode-selector";
import { ActionDialogs } from "@/components/flight/action-dialogs";
import { cn } from "@/lib/utils";

export function C2BottomActions() {
  const armState = useDroneStore((s) => s.armState);
  const flightMode = useDroneStore((s) => s.flightMode);
  const setFlightMode = useDroneStore((s) => s.setFlightMode);
  const getProtocol = useDroneManager((s) => s.getSelectedProtocol);
  const immersiveMode = useUiStore((s) => s.immersiveMode);
  const enterImmersiveMode = useUiStore((s) => s.enterImmersiveMode);
  const exitImmersiveMode = useUiStore((s) => s.exitImmersiveMode);

  const isArmed = armState === "armed";
  const protocol = getProtocol();

  const [showArmConfirm, setShowArmConfirm] = useState(false);
  const [showDisarmConfirm, setShowDisarmConfirm] = useState(false);
  const [showRthConfirm, setShowRthConfirm] = useState(false);
  const [showTakeoffConfirm, setShowTakeoffConfirm] = useState(false);
  const [showLandConfirm, setShowLandConfirm] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [showKillConfirm, setShowKillConfirm] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [takeoffAlt, setTakeoffAlt] = useState("10");

  return (
    <>
      <div className="border-t border-border-default bg-bg-secondary">
        {/* Row 1: RTH / LAND / PAUSE */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border-default">
          <ActionBtn icon={<Home size={12} />} label="RTH" onClick={() => setShowRthConfirm(true)} />
          <ActionBtn icon={<ArrowDownToLine size={12} />} label="LAND" onClick={() => setShowLandConfirm(true)} />
          <ActionBtn icon={<Pause size={12} />} label="PAUSE" onClick={() => {
            if (protocol) protocol.setFlightMode("LOITER");
            else setFlightMode("LOITER");
          }} />
          {/* Mission stats — centered under the GROUND SPEED gauge */}
          <div className="flex-1" />
          <div className="flex items-center">
            <Stat label="DISTANCE · KM" value="1.204" />
            <Stat label="AIR TIME · MM:SS" value="38:24" />
            <Stat label="HOME · KM" value="0.1" />
            <Stat label="ETA · MM:SS" value="00:25" />
          </div>
          <div className="flex-1" />
        </div>

        {/* Row 2: DISARM / TAKEOFF / FLIGHT MODE / ABORT / KILL / FLY + toggles */}
        <div className="flex items-center gap-1.5 px-3 py-1.5">
          <CriticalBtn label="DISARM" color="red" onClick={() => setShowDisarmConfirm(true)} />
          <CriticalBtn label="TAKEOFF" color="amber" icon={<ArrowUpFromLine size={11} />} onClick={() => setShowTakeoffConfirm(true)} />
          <div className="flex items-center gap-1 px-2 py-1 border border-border-default text-[10px] font-mono text-text-secondary">
            FLIGHT MODE
            <FlightModeSelector
              value={flightMode}
              onChange={(mode) => {
                if (protocol) protocol.setFlightMode(mode);
                else setFlightMode(mode);
              }}
              className="h-6 text-[10px] min-w-[60px]"
            />
          </div>
          <CriticalBtn label="ABORT" color="orange" onClick={() => setShowAbortConfirm(true)} />
          <CriticalBtn label="KILL" color="red" onClick={() => setShowKillConfirm(true)} />
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-arc text-[#0a0c10] text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all"
            onClick={() => {
              if (protocol) protocol.setFlightMode("AUTO");
              else setFlightMode("AUTO");
            }}
          >
            <Play size={11} /> FLY
          </button>

          <div className="flex-1" />

          {/* Right-side toggles */}
          <Toggle label="Follow Me" />
          <Toggle label="Immersive" active={immersiveMode} onClick={() => immersiveMode ? exitImmersiveMode() : enterImmersiveMode()} />
          <div className="px-2 py-1 border border-border-default text-[10px] font-mono text-text-secondary">
            Auto ▾
          </div>
          <div className="px-2 py-1 border border-border-default text-[10px] font-mono text-text-secondary">
            ✓ Pre-Fit 0/10
          </div>
          <button
            onClick={() => isArmed ? setShowDisarmConfirm(true) : setShowArmConfirm(true)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono font-semibold uppercase border transition-colors",
              isArmed
                ? "border-status-success/40 bg-status-success/10 text-status-success"
                : "border-border-default text-text-secondary hover:text-text-primary",
            )}
          >
            <Power size={11} />
            {isArmed ? "DISARM" : "ARM"}
          </button>
        </div>
      </div>

      <ActionDialogs
        showArmConfirm={showArmConfirm} setShowArmConfirm={setShowArmConfirm}
        showDisarmConfirm={showDisarmConfirm} setShowDisarmConfirm={setShowDisarmConfirm}
        showRthConfirm={showRthConfirm} setShowRthConfirm={setShowRthConfirm}
        showTakeoffConfirm={showTakeoffConfirm} setShowTakeoffConfirm={setShowTakeoffConfirm}
        showLandConfirm={showLandConfirm} setShowLandConfirm={setShowLandConfirm}
        showAbortConfirm={showAbortConfirm} setShowAbortConfirm={setShowAbortConfirm}
        showKillConfirm={showKillConfirm} setShowKillConfirm={setShowKillConfirm}
        showChecklist={showChecklist} setShowChecklist={setShowChecklist}
        checklistReady={false}
        takeoffAlt={takeoffAlt}
      />
    </>
  );
}

function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1 border border-border-default text-[10px] font-mono font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors uppercase tracking-wider"
    >
      {icon} {label}
    </button>
  );
}

function CriticalBtn({ label, color, icon, onClick }: { label: string; color: "red" | "amber" | "orange"; icon?: React.ReactNode; onClick: () => void }) {
  const colorMap = {
    red: "border-status-error/50 bg-status-error/15 text-status-error hover:bg-status-error/25",
    amber: "border-status-warning/50 bg-status-warning/15 text-status-warning hover:bg-status-warning/25",
    orange: "border-orange-500/50 bg-orange-500/15 text-orange-400 hover:bg-orange-500/25",
  };
  return (
    <button
      onClick={onClick}
      className={cn("flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border transition-colors", colorMap[color])}
    >
      {icon} {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center px-3">
      <div className="text-sm font-mono font-bold text-text-primary tabular-nums">{value}</div>
      <div className="text-[8px] font-mono text-text-tertiary uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono transition-colors",
        active ? "text-brand-arc" : "text-text-tertiary hover:text-text-secondary",
      )}
    >
      <span className={cn("w-6 h-3 rounded-full border transition-colors relative", active ? "bg-brand-arc/30 border-brand-arc" : "bg-bg-tertiary border-border-default")}>
        <span className={cn("absolute top-0.5 w-2 h-2 rounded-full transition-all", active ? "right-0.5 bg-brand-arc" : "left-0.5 bg-text-tertiary")} />
      </span>
      {label}
    </button>
  );
}
