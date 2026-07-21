"use client";

import { Menu, Globe, List, Crosshair, Share2, Shield, Layers, Network, History, Bookmark } from "lucide-react";
import type { Ref } from "react";

export function IconRail({
  onMenuClick,
  menuRef,
  menuExpanded,
}: {
  onMenuClick?: () => void;
  menuRef?: Ref<HTMLButtonElement>;
  menuExpanded?: boolean;
}) {
  return (
    <nav className="rail">
      <button
        ref={menuRef}
        type="button"
        className="rbtn rail-menu"
        title="Menu"
        aria-label="Open SOUL panel"
        aria-expanded={menuExpanded ?? false}
        onClick={onMenuClick}
      >
        <Menu size={15} />
      </button>
      <button type="button" className="rbtn on" title="Map"><Globe size={15} /></button>
      <button type="button" className="rbtn" title="Lists"><List size={15} /></button>
      <button type="button" className="rbtn" title="Targets"><Crosshair size={15} /></button>
      <button type="button" className="rbtn" title="Share"><Share2 size={15} /></button>
      <button type="button" className="rbtn" title="ROE"><Shield size={15} /></button>
      <button type="button" className="rbtn" title="Layers"><Layers size={15} /></button>
      <button type="button" className="rbtn" title="Mesh"><Network size={15} /></button>
      <button type="button" className="rbtn" title="History"><History size={15} /></button>
      <span className="sp" />
      <button type="button" className="rbtn" title="Bookmarks"><Bookmark size={15} /></button>
    </nav>
  );
}
