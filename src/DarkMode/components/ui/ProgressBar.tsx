type Fill = "green" | "green-b" | "cyan" | "red" | "lime";

const FILL_CLASS: Record<Fill, string> = {
  green: "",
  "green-b": "",
  cyan: "cyan",
  red: "red",
  lime: "lime",
};

const FILL_COLOR: Partial<Record<Fill, string>> = {
  "green-b": "var(--arc-green-b)",
};

/**
 * Thin progress meter (.prog > i). `fill` selects the bar color; defaults to
 * the green readiness color used by interceptor batteries.
 */
export function ProgressBar({
  pct,
  fill = "green",
}: {
  pct: number;
  fill?: Fill;
}) {
  const width = `${Math.max(0, Math.min(100, pct))}%`;
  return (
    <div className="prog">
      <i
        className={FILL_CLASS[fill] || undefined}
        style={{ width, ...(FILL_COLOR[fill] ? { background: FILL_COLOR[fill] } : {}) }}
      />
    </div>
  );
}
