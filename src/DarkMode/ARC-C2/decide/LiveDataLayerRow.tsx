"use client";

import Image from "next/image";
import { ChevronRight, Plus } from "lucide-react";
import liveLayerIcon from "../public/avatars/Group (1).png";

export function LiveDataLayerRow({
  label,
  action = "arrow",
}: {
  label: string;
  action?: "arrow" | "plus";
}) {
  return (
    <button type="button" className="drow drow--live">
      <span className="di drow__live-icon" aria-hidden>
        <Image src={liveLayerIcon} alt="" width={10} height={10} />
      </span>
      {label}
      <span className="arr">
        {action === "plus" ? <Plus size={14} /> : <ChevronRight size={14} />}
      </span>
    </button>
  );
}
