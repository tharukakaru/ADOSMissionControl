"use client";

export interface ArcTabSpec<T extends string = string> {
  id: T;
  label: string;
  badge?: number | string;
  badgeVariant?: "default" | "alerts";
  tabClass?: string;
}

export function ArcPanelTabs<T extends string>({
  tabs,
  active,
  onChange,
  ariaLabel,
}: {
  tabs: readonly ArcTabSpec<T>[];
  active: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div className="dec-tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={[
            "dtab",
            tab.tabClass ?? "",
            active === tab.id ? "on" : "",
          ].filter(Boolean).join(" ")}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.badge != null ? (
            <span
              className={[
                "cbadge",
                tab.badgeVariant === "alerts" ? "cbadge-alerts" : "",
              ].filter(Boolean).join(" ")}
            >
              {tab.badge}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
