"use client";

import { useEffect, useState } from "react";
import { useTelemetryLatest } from "@/hooks/use-telemetry-latest";
import { useConnectionQuality } from "@/hooks/use-connection-quality";

export function C2StatusBar() {
  const pos = useTelemetryLatest("position");
  const { latencyMs } = useConnectionQuality();
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const lat = pos?.lat ?? 0;
  const lon = pos?.lon ?? 0;
  const alt = pos?.alt ?? 0;

  return (
    <div className="h-6 flex items-center justify-between px-3 bg-[#0a0c10] border-t border-border-default text-[9px] font-mono text-text-tertiary shrink-0">
      <div className="flex items-center gap-4">
        <span>LAT {lat.toFixed(6)}°N</span>
        <span>LON {lon.toFixed(5)}°E</span>
        <span>ALT {Math.round(alt * 3.281)}ft</span>
        <span>GRID 430 CC 8421 6390</span>
      </div>
      <div className="flex items-center gap-4">
        <span>PLATFORM MODE</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
          <span className="text-status-success">LINK {latencyMs || 10}ms</span>
        </div>
        <span>{time}</span>
      </div>
    </div>
  );
}
