/**
 * @deprecated Replaced by CSS Grid layout in arc.css — kept for revertibility.
 */
"use client";

import { GripHorizontal, GripVertical } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";

export interface ResizeHandleComponentProps {
  orientation: "vertical" | "horizontal";
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}

export function ResizeHandle({
  orientation,
  onPointerDown,
}: ResizeHandleComponentProps) {
  const vertical = orientation === "vertical";
  const Grip = vertical ? GripVertical : GripHorizontal;

  return (
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={`resize-handle resize-handle--${orientation}`}
      title="Drag to resize"
      onPointerDown={onPointerDown}
    >
      <Grip size={vertical ? 14 : 12} className="resize-handle-grip" aria-hidden />
    </div>
  );
}
