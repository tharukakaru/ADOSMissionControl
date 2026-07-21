"use client";

import {
  BookOpen,
  Layers,
  Crosshair,
  Radar,
  Send,
  UserCheck,
  Activity,
  Bookmark,
  BarChart3,
} from "lucide-react";

/** Far-left 48px icon rail. The radar entry is the active module. */
export function IconRail() {
  return (
    <nav className="rail">
      <div className="rbtn">
        <BookOpen />
      </div>
      <div className="rbtn">
        <Layers />
      </div>
      <div className="rbtn">
        <Crosshair />
      </div>
      <div className="rbtn on">
        <Radar />
      </div>
      <div className="rbtn">
        <Send />
      </div>
      <div className="rbtn">
        <UserCheck />
      </div>
      <div className="rbtn">
        <Activity />
      </div>
      <div className="sp" />
      <div className="rbtn">
        <Bookmark />
      </div>
      <div className="rbtn">
        <BarChart3 />
      </div>
    </nav>
  );
}
