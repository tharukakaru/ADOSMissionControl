"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MobileTab = "map" | "soul" | "decide" | "alerts";

/** Shell UI state for responsive layout (drawer, entities overlay, mobile tabs). */
export function useArcC2Shell() {
  const [entitiesOpen, setEntitiesOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("map");
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);

  const toggleEntities = useCallback(() => setEntitiesOpen((open) => !open), []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    drawerTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  const shellClass = [
    entitiesOpen ? "arc--entities-open" : "",
    drawerOpen ? "arc--drawer-open" : "",
    `arc--view-${mobileTab}`,
  ].filter(Boolean).join(" ");

  return {
    entitiesOpen,
    toggleEntities,
    drawerOpen,
    openDrawer,
    closeDrawer,
    mobileTab,
    setMobileTab,
    shellClass,
    drawerTriggerRef,
  };
}
