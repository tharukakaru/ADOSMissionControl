"use client";

import { Crosshair, Shield, User, Search, History, Bookmark } from "lucide-react";

const RAIL_ITEMS: { icon: typeof Crosshair; label: string; active?: boolean }[] = [
  { icon: Crosshair, label: "Kill Chain", active: true },
  { icon: Shield, label: "ROE" },
  { icon: User, label: "Profile" },
  { icon: Search, label: "Search" },
  { icon: History, label: "History" },
];

export function KillChainRail() {
  return (
    <nav className="rail kc-rail" aria-label="Kill chain navigation">
      {RAIL_ITEMS.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          type="button"
          className={`rbtn${active ? " on" : ""}`}
          title={label}
          aria-label={label}
          aria-current={active ? "page" : undefined}
        >
          <Icon size={15} />
        </button>
      ))}
      <span className="sp" />
      <button type="button" className="rbtn" title="Bookmarks" aria-label="Bookmarks">
        <Bookmark size={15} />
      </button>
    </nav>
  );
}
