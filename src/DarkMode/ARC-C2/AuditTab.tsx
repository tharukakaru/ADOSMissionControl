"use client";

import { useMemo, type CSSProperties } from "react";
import { Shield } from "lucide-react";
import { AUDIT_ENTRIES } from "./data";
import type { AuditEntry, AuditEntryKind } from "./types";

const KIND_DOT: Record<AuditEntryKind, string> = {
  authorised: "var(--audit-green)",
  system: "var(--alert-teal)",
  classification: "var(--alert-amber)",
};

function sortNewestFirst(entries: AuditEntry[]): AuditEntry[] {
  return [...entries].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function AuditRow({ entry }: { entry: AuditEntry }) {
  return (
    <div
      className="audit-row"
      style={{ "--audit-dot": KIND_DOT[entry.kind] } as CSSProperties}
    >
      <span className="audit-dot" aria-hidden />
      <div className="audit-body">
        <p className="audit-title">{entry.title}</p>
        <p className="audit-sig mono">
          <time>{entry.timestamp}</time>
          <span className="audit-sig-sep"> · </span>
          <span className="audit-signed">signed</span>
        </p>
      </div>
    </div>
  );
}

export function AuditTab() {
  const entries = useMemo(() => sortNewestFirst(AUDIT_ENTRIES), []);

  if (entries.length === 0) {
    return (
      <div className="audit-scroll">
        <div className="audit-empty">No audit entries</div>
      </div>
    );
  }

  return (
    <div className="audit-scroll">
      <div className="audit-header">
        <Shield size={15} className="audit-header-icon" aria-hidden />
        <span className="audit-header-label up">Tamper-evident audit</span>
      </div>
      <div className="audit-log">
        {entries.map((entry) => (
          <AuditRow key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
