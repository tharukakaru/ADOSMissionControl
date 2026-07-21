"use client";

import { useState, type CSSProperties } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { ALERTS } from "./data";
import type { Alert, AlertSeverity } from "./types";

const SEVERITY_COLOR: Record<AlertSeverity, string> = {
  critical: "var(--alert-red)",
  caution: "var(--alert-amber)",
  info: "var(--alert-teal)",
};

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  const color = SEVERITY_COLOR[severity];
  if (severity === "info") {
    return <Info size={16} color={color} aria-hidden />;
  }
  return <AlertTriangle size={16} color={color} aria-hidden />;
}

function AlertRow({
  alert,
  selected,
  onSelect,
}: {
  alert: Alert;
  selected: boolean;
  onSelect: () => void;
}) {
  const accent = SEVERITY_COLOR[alert.severity];
  const unreadClass = alert.unread ? " alert-row--unread" : "";
  const selectedClass = selected ? " alert-row--selected" : "";

  return (
    <button
      type="button"
      className={`alert-row${unreadClass}${selectedClass}`}
      style={{ "--alert-accent": accent } as CSSProperties}
      onClick={onSelect}
    >
      <span className="alert-icon">
        <SeverityIcon severity={alert.severity} />
      </span>
      <div className="alert-body">
        <div className="alert-head">
          <span className="alert-title">{alert.title}</span>
          <time className="alert-time mono">{alert.time}</time>
        </div>
        <p className="alert-desc">{alert.description}</p>
        <span className="alert-source mono up">{alert.source}</span>
      </div>
    </button>
  );
}

export function AlertsTab() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (ALERTS.length === 0) {
    return (
      <div className="alerts-scroll">
        <div className="alerts-empty">No active alerts</div>
      </div>
    );
  }

  return (
    <div className="alerts-scroll">
      {ALERTS.map((alert) => (
        <AlertRow
          key={alert.id}
          alert={alert}
          selected={selectedId === alert.id}
          onSelect={() => setSelectedId(alert.id)}
        />
      ))}
    </div>
  );
}
