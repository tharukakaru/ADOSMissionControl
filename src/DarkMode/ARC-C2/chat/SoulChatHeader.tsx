"use client";

import { Sparkles, Search } from "lucide-react";

export function SoulChatHeader({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <header className="soul-head">
      <div className="soul-head-brand">
        <Sparkles size={11} className="spark" aria-hidden />
        <span className="t1">SOUL 001</span>
        <span className="t2">· NOW Chat with</span>
      </div>
      <div className="soul-search">
        <Search size={12} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Query entity, callsign, or coordinate…"
        />
      </div>
    </header>
  );
}
