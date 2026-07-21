"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle, Ban, Check, FileText, Scale, ScrollText, X,
} from "lucide-react";
import { useHoldToAuthorise } from "./useHoldToAuthorise";
import type { AuthoriseRecord, HumanAuthorityGate as GatePayload, RoeRule } from "./gate-types";

type RoeState = RoeRule & { checked: boolean };

type StatTone = "hostile" | "effector" | "safe" | "default";

function StatCard({
  label, value, sub, tone = "default", span,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: StatTone;
  span?: boolean;
}) {
  return (
    <div
      className={`hag-stat${span ? " hag-stat--span" : ""}`}
      style={{ "--hag-val": `var(--val-${tone === "default" ? "default" : tone})` } as CSSProperties}
    >
      <span className="hag-stat-lbl up">{label}</span>
      <span className="hag-stat-val">{value}</span>
      <span className="hag-stat-sub">{sub}</span>
    </div>
  );
}

function InfoCardGrid({ gate }: { gate: GatePayload }) {
  return (
    <div className="hag-grid">
      <StatCard
        label="Target track"
        value={gate.target.label}
        sub={gate.target.sub}
        tone="hostile"
      />
      <StatCard
        label="Classification · confidence"
        value={`${gate.classification.label} · ${gate.classification.confidence}%`}
        sub="Perception-correlated"
        tone="hostile"
      />
      <StatCard
        label="Assigned effector"
        value={gate.effector.label}
        sub={gate.effector.sub}
        tone="effector"
      />
      <StatCard
        label="Predicted intercept"
        value={gate.predictedIntercept.label}
        sub={gate.predictedIntercept.sub}
        tone="default"
      />
      <StatCard
        label="Target range"
        value={gate.targetRange.label}
        sub={gate.targetRange.sub}
        tone="safe"
        span
      />
    </div>
  );
}

function RoeChecklist({
  rules,
  onToggle,
  firstUncheckedRef,
}: {
  rules: RoeState[];
  onToggle: (id: string) => void;
  firstUncheckedRef: RefObject<HTMLInputElement | null>;
}) {
  const firstUncheckedId = rules.find((r) => !r.checked)?.id ?? null;

  return (
    <div className="hag-roe">
      <div className="hag-sec-lbl up">Rules of engagement — operator must confirm</div>
      <ul className="hag-roe-list">
        {rules.map((rule) => (
          <li key={rule.id}>
            <label className={`hag-roe-row${rule.checked ? " on" : ""}`}>
              <input
                ref={rule.id === firstUncheckedId ? firstUncheckedRef : undefined}
                type="checkbox"
                checked={rule.checked}
                onChange={() => onToggle(rule.id)}
              />
              <span className="hag-roe-box" aria-hidden>
                {rule.checked ? <Check size={12} strokeWidth={3} /> : null}
              </span>
              <span className="hag-roe-label">{rule.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Remount with a new `key` from the parent when opening so ROE checks reset.
 */
export function HumanAuthorityGate({
  open,
  gate,
  onAuthorise,
  onAbort,
}: {
  open: boolean;
  gate: GatePayload;
  onAuthorise: (record: AuthoriseRecord) => void;
  onAbort: (gateId: string) => void;
}) {
  const titleId = useId();
  const descId = useId();
  const liveId = useId();
  const [rules, setRules] = useState<RoeState[]>(() =>
    gate.roeRules.map((r) => ({ ...r, checked: false })),
  );
  const [liveMsg, setLiveMsg] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstUncheckedRef = useRef<HTMLInputElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const allConfirmed = useMemo(() => rules.every((r) => r.checked), [rules]);

  const handleAuthoriseComplete = useCallback(() => {
    const record: AuthoriseRecord = {
      gateId: gate.id,
      confirmedRules: rules.filter((r) => r.checked).map((r) => r.id),
      timestamp: new Date().toISOString(),
      operator: gate.authoriser,
      target: gate.target.label,
      confidence: gate.classification.confidence,
    };
    setLiveMsg("Authorised");
    onAuthorise(record);
  }, [gate, rules, onAuthorise]);

  const { progress, holding, start, cancel } = useHoldToAuthorise({
    enabled: allConfirmed && open,
    onComplete: handleAuthoriseComplete,
  });

  const abort = useCallback(() => {
    cancel();
    onAbort(gate.id);
  }, [cancel, onAbort, gate.id]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusId = requestAnimationFrame(() => {
      firstUncheckedRef.current?.focus();
    });

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        abort();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handler);
    return () => {
      cancelAnimationFrame(focusId);
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, abort]);

  const toggleRule = (id: string) => {
    cancel();
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)),
    );
  };

  const onHoldPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!allConfirmed) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    start();
  };

  const onHoldPointerEnd = () => {
    if (progress < 1) cancel();
  };

  const onHoldKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!allConfirmed) return;
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (!holding) start();
  };

  const onHoldKeyUp = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (progress < 1) cancel();
    }
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="arc hag-overlay" role="presentation">
      <div
        ref={dialogRef}
        className="hag-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
      >
        <header className="hag-head">
          <div className="hag-head-main">
            <Scale size={16} className="hag-head-ico" aria-hidden />
            <div className="hag-head-text">
              <h2 id={titleId} className="hag-title up">{gate.title}</h2>
              <p className="hag-sub">Consequential action · human gate</p>
              <p id={descId} className="hag-task up">{gate.taskType}</p>
            </div>
          </div>
          <button
            type="button"
            className="hag-close"
            aria-label="Abort authorisation"
            onClick={abort}
          >
            <X size={14} />
          </button>
        </header>

        <div className="hag-body">
          <InfoCardGrid gate={gate} />

          <div className="hag-rationale">
            <div className="hag-sec-lbl up">SOUL AI rationale</div>
            <p className="hag-rationale-text">{gate.rationale}</p>
          </div>

          <div className="hag-prov">
            <div className="hag-prov-row">
              <FileText size={12} aria-hidden />
              <span>
                Policy <span className="mono">{gate.policyId}</span>
                {" · "}Authoriser <span className="mono">{gate.authoriser}</span>
              </span>
            </div>
            <div className="hag-prov-row">
              <ScrollText size={12} aria-hidden />
              <span>Action logged · {gate.auditSink}</span>
            </div>
          </div>

          <RoeChecklist
            rules={rules}
            onToggle={toggleRule}
            firstUncheckedRef={firstUncheckedRef}
          />
        </div>

        <footer className="hag-foot">
          <div className="hag-actions">
            <button type="button" className="hag-abort up" onClick={abort}>
              <Ban size={14} aria-hidden />
              Abort
            </button>
            <button
              type="button"
              className={`hag-hold${holding ? " holding" : ""}`}
              disabled={!allConfirmed}
              aria-disabled={!allConfirmed}
              aria-describedby={liveId}
              onPointerDown={onHoldPointerDown}
              onPointerUp={onHoldPointerEnd}
              onPointerLeave={onHoldPointerEnd}
              onPointerCancel={onHoldPointerEnd}
              onBlur={() => { if (progress < 1) cancel(); }}
              onKeyDown={onHoldKeyDown}
              onKeyUp={onHoldKeyUp}
              onClick={(e) => e.preventDefault()}
            >
              <span
                className="hag-hold-fill"
                style={{ transform: `scaleX(${progress})` }}
                aria-hidden
              />
              <span className="hag-hold-label up">
                <Check size={14} aria-hidden />
                {holding ? "Holding…" : "Hold to authorise"}
              </span>
            </button>
          </div>
          <p className="hag-disclaimer">
            <AlertTriangle size={12} aria-hidden />
            <span>
              No auto-authorise. Release cancels. Checklist must be complete.
              Authorisation writes a tamper-evident audit record.
            </span>
          </p>
          <span id={liveId} className="sr-only" aria-live="assertive">
            {liveMsg}
          </span>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
