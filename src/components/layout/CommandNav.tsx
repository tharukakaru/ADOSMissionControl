"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Route, Play, History } from "lucide-react";
import { cn } from "@/lib/utils";

// Agent management is unified into the Dashboard drone view; there is no
// separate Command tab. /command redirects to the Dashboard for old links.
//
// VISUAL REDESIGN NOTE: labels for the last two tabs were renamed to match
// the redesign copy ("AGENT" / "LOGS" instead of "COMMAND" / "HISTORY").
// Routes (/command, /flight-logs) are unchanged — this is a display-label
// change only. If "Agent" is meant to be a genuinely different page/route
// than /command, flag it and we'll wire that up separately; for now it's
// the same destination with new nav copy, since that's what the redesign
// screenshot shows without indicating any new page content.
const tabs = [
  { icon: LayoutDashboard, labelKey: "dashboard", label: null, href: "/" },
  { icon: Route, labelKey: "plan", label: null, href: "/plan" },
  { icon: Play, labelKey: "simulate", label: null, href: "/simulate" },
  { icon: Play, labelKey: "command", label: "Agent", href: "/command" },
  { icon: History, labelKey: "history", label: "Logs", href: "/flight-logs" },
];

export function CommandNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex items-center gap-0.5 h-full">
      {tabs.map(({ icon: Icon, labelKey, label, href }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors rounded",
              active
                ? "bg-[var(--redesign-yellow)]/15 text-[var(--redesign-yellow)]"
                : "bg-transparent text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)]"
            )}
          >
            <Icon size={12} />
            {label ?? t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
