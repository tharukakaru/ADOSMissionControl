"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Settings, AlertTriangle, LogOut, CloudOff, Plane, Minimize2, X, Star, BookOpen, Wifi, Sparkles, BatteryMedium } from "lucide-react";
import { useConnectionQuality } from "@/hooks/use-connection-quality";
import { useDroneManager } from "@/stores/drone-manager";
import { useDroneStore } from "@/stores/drone-store";
import { Tooltip } from "@/components/ui/tooltip";
import { CommandNav } from "./CommandNav";
import { DemoProvider } from "./DemoProvider";
import { CommandPalette } from "@/components/shared/command-palette";
import { FailsafeAlertBanner } from "@/components/flight/FailsafeAlertBanner";
import { PluginCrashBanner } from "@/components/plugins/PluginCrashBanner";
import { SlcanModeBanner } from "@/components/shared/SlcanModeBanner";
import { useFleetStore } from "@/stores/fleet-store";
import { useAuthStore } from "@/stores/auth-store";
import { useSettingsStore } from "@/stores/settings-store";
import { LocalStorageBanner } from "@/components/ui/local-storage-banner";
import { useUiStore } from "@/stores/ui-store";
import { SignInModal } from "@/components/auth/SignInModal";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConnectDialog } from "@/components/connect/ConnectDialog";
import { WelcomeModal, DisclaimerGate } from "@/components/onboarding/WelcomeModal";
import { formatSyncTime } from "@/lib/sync";
import { useAutoReconnect } from "@/hooks/use-auto-reconnect";
import { useGcsLocation } from "@/hooks/use-gcs-location";
import { usePlatform } from "@/hooks/use-platform";
import { useDisconnectGuard } from "@/hooks/use-disconnect-guard";
import { DisconnectGuard } from "@/components/fc/shared/DisconnectGuard";
import { ArmedWriteConfirmDialog } from "@/components/indicators/ArmedWriteConfirmDialog";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { C2TopBar } from "@/components/c2/C2TopBar";
import { C2StatusBar } from "@/components/c2/C2StatusBar";
import { useConvexAvailable } from "@/app/ConvexClientProvider";
import { cn } from "@/lib/utils";
import { ChangelogNotificationGate } from "@/components/changelog/ChangelogNotificationGate";
import { ChangelogBadge } from "@/components/changelog/ChangelogBadge";
import Link from "next/link";

// MAVLink bridge persists across all tabs — direct import (renders null, no hydration issue)
import { AgentMavlinkBridge } from "@/components/command/AgentMavlinkBridge";
import { MeshToastBridge } from "@/components/command/MeshToastBridge";
import { RoleBadge } from "@/components/command/RoleBadge";
// Agent state bridges + fleet projectors run shell-wide so a drone selected on
// the Dashboard shows live companion-computer data in place (the Command page
// is retired). PairingDialog lives here too so pairing opens from anywhere.
import { AgentBridges } from "@/components/command/AgentBridges";
import { CloudDroneBridge } from "@/components/dashboard/CloudDroneBridge";
import { LocalDroneBridge } from "@/components/dashboard/LocalDroneBridge";

/**
 * User menu with sign-out. Must only mount when ConvexAuthNextjsProvider exists
 * (i.e., when convexAvailable is true), because useAuthActions requires that context.
 */
function ConvexUserMenu() {
  const { signOut } = useAuthActions();
  const user = useAuthStore((s) => s.user);
  const lastSyncedAt = useAuthStore((s) => s.lastSyncedAt);
  const t = useTranslations("shell");
  const tAuth = useTranslations("auth");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <Tooltip content={user?.email || t("account")} position="bottom">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center text-[10px] font-semibold uppercase"
        >
          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
        </button>
      </Tooltip>
      {menuOpen && (
        <div className="absolute right-0 top-8 bg-bg-secondary border border-border-default shadow-lg z-50 w-48 py-1">
          <div className="px-3 py-2 border-b border-border-default">
            <p className="text-xs text-text-primary font-medium truncate">{user?.name || user?.email}</p>
            <p className="text-[10px] text-text-tertiary truncate">{user?.email}</p>
            {lastSyncedAt && (
              <p className="text-[10px] text-text-tertiary mt-1">
                {t("lastSynced", { time: formatSyncTime(lastSyncedAt) })}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setMenuOpen(false);
              if (signOut) void signOut();
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors"
          >
            <LogOut size={12} />
            {tAuth("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}

export function CommandShell({ children }: { children: React.ReactNode }) {
  // HDMI kiosk / HUD route opts out of the full GCS chrome (navbar, sidebar,
  // auto-reconnect, global dialogs). Root providers (Convex, Locale, Toast)
  // still wrap via app/layout.tsx. See product/specs/08-hdmi-kiosk-mode.md.
  const pathname = usePathname();
  const isHudRoute = pathname?.startsWith("/hud") ?? false;
  if (isHudRoute) {
    return (
      <>
        <SplashScreen />
        {children}
      </>
    );
  }
  return (
    <>
      <SplashScreen />
      <CommandShellInner>{children}</CommandShellInner>
    </>
  );
}

function CommandShellInner({ children }: { children: React.ReactNode }) {
  useAutoReconnect();
  useGcsLocation();

  const t = useTranslations("shell");
  const { isElectron, isWindows, isLinux } = usePlatform();
  const {
    guardOpen,
    commitAndDisconnect,
    discardAndDisconnect,
    cancelDisconnect,
    requestDisconnect,
  } = useDisconnectGuard();

  // Listen for disconnect requests from other components (e.g. ActiveConnections)
  useEffect(() => {
    const handler = (e: Event) => {
      const droneId = (e as CustomEvent<string>).detail;
      if (droneId) requestDisconnect(droneId);
    };
    window.addEventListener("request-disconnect", handler);
    return () => window.removeEventListener("request-disconnect", handler);
  }, [requestDisconnect]);
  const demo = useSettingsStore((s) => s.demoMode);
  const setDemoMode = useSettingsStore((s) => s.setDemoMode);
  const alertCount = useFleetStore((s) => s.alerts.filter((a) => !a.acknowledged).length);

  // Nav-row status badges (moved down from C2TopBar per redesign — see
  // CommandShell header below).
  const { latencyMs, signalStrength } = useConnectionQuality();
  const selectedDroneId = useDroneManager((s) => s.selectedDroneId);
  const managedDrones = useDroneManager((s) => s.drones);
  const droneConnectionState = useDroneStore((s) => s.connectionState);
  const selectedDrone = selectedDroneId ? managedDrones.get(selectedDroneId) : null;

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const convexAvailable = useConvexAvailable();
  const immersiveMode = useUiStore((s) => s.immersiveMode);
  const exitImmersiveMode = useUiStore((s) => s.exitImmersiveMode);
  const [signInOpen, setSignInOpen] = useState(false);

  // Listen for sign-in requests from AuthGate and other components
  useEffect(() => {
    const handler = () => setSignInOpen(true);
    window.addEventListener("open-signin", handler);
    return () => window.removeEventListener("open-signin", handler);
  }, []);

  // Escape key exits immersive mode
  useEffect(() => {
    if (!immersiveMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitImmersiveMode();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [immersiveMode, exitImmersiveMode]);

  return (
    <div className="flex flex-col h-dvh">
      {/* Welcome onboarding modal */}
      <WelcomeModal />

      {/* Disclaimer gate for existing users who haven't accepted yet */}
      <DisclaimerGate />

      {/* Changelog "What's New" notification modal */}
      <ChangelogNotificationGate />

      {/* Armed-state parameter write confirmation dialog */}
      <ArmedWriteConfirmDialog />

      {/* Immersive mode exit button */}
      {immersiveMode && (
        <button
          onClick={exitImmersiveMode}
          className="fixed top-3 right-3 z-50 p-1.5 bg-bg-secondary/80 border border-border-default text-text-tertiary hover:text-text-primary transition-colors backdrop-blur-sm"
          title={t("exitImmersive")}
        >
          <Minimize2 size={14} />
        </button>
      )}

      {/* C2 Command Bar */}
      {!immersiveMode && <C2TopBar />}

      {/* Top bar — HYENA nav */}
      {!immersiveMode && <header
        className={cn(
          "h-10 flex items-center gap-3 px-4 border-b border-[var(--redesign-border)] shrink-0",
          isElectron && isWindows && "pr-[140px]",
          isElectron && !isLinux && "[-webkit-app-region:drag]"
        )}
        style={{ background: "var(--redesign-bg-navrow)" }}
      >
        {/* Left — HYENA branding + mode badges */}
        <div className={cn("flex items-center gap-2", isElectron && !isLinux && "[-webkit-app-region:no-drag]")}>
          <span className="font-display text-sm font-semibold tracking-wider text-[var(--redesign-text-primary)] uppercase">
            HYENA
          </span>
          {demo && (
            <Tooltip content={t("exitDemo")} position="bottom">
              <button
                onClick={() => setDemoMode(false)}
                className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded border border-[var(--redesign-yellow)] text-[var(--redesign-yellow)] bg-transparent hover:bg-[var(--redesign-yellow)]/10 transition-colors"
              >
                pre Alpha
                <X size={9} className="text-[var(--redesign-yellow)]" />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Center — Navigation (inline) */}
        <div className={cn("self-stretch flex", isElectron && !isLinux && "[-webkit-app-region:no-drag]")}>
          <CommandNav />
        </div>

        <div className="flex-1" />

        {/* Right — moved down from C2TopBar per redesign: SOUL/ground pills
            stay as static copy (unchanged from before, just relocated).
            The Alpha-1-style badge is new and wired to real data: the
            currently selected drone's name + live connection state. Label
            reads the actual connectionMeta.type (e.g. SERIAL/WEBSOCKET)
            rather than a hardcoded "NATIVE" — that word's exact meaning is
            still an open question (flagged in GUIDE.md), so this shows the
            truth instead of a guessed label. Badge is hidden entirely when
            no drone is selected/connected, rather than showing fake data. */}
        <div className={cn("flex items-center gap-3", isElectron && !isLinux && "[-webkit-app-region:no-drag]")}>
          <Sparkles size={12} className="text-[var(--redesign-blue)]" />
          <span className="text-[10px] font-mono text-[var(--redesign-text-secondary)]">SOUL 001</span>
          <span className="text-[10px] text-[var(--redesign-text-secondary)]">Chat with MEGHA</span>
          <span className="bg-[var(--redesign-blue)]/20 text-[var(--redesign-blue)] px-2 py-0.5 text-[9px] font-mono font-semibold">
            ground 06X
          </span>
          {/* VISUAL REDESIGN NOTE: you sent a direct crop showing the exact
              text this badge should read — "NATIVE · Connected" — which
              settles the open question from earlier rounds about what
              "NATIVE" means: it's fixed copy, not derived from the drone's
              actual connectionMeta.type (serial/websocket/mqtt-mavlink).
              Connection state is now shown as a simple Connected/
              Disconnected per your example, not the raw armed/flying
              sub-state. */}
          {selectedDrone && (
            <div className="flex items-center gap-2 bg-[var(--redesign-bg-black)] border border-[var(--redesign-border)] px-2 py-1">
              <span className="w-5 h-5 rounded bg-[var(--redesign-yellow)] flex items-center justify-center shrink-0">
                <Plane size={12} className="text-[var(--redesign-bg-black)]" fill="currentColor" />
              </span>
              <div className="leading-tight">
                <div className="text-[var(--redesign-text-primary)] font-semibold text-[10px]">{selectedDrone.name}</div>
                <div
                  className={cn(
                    "text-[9px] uppercase font-mono",
                    droneConnectionState === "disconnected" ? "text-status-error" : "text-status-success"
                  )}
                >
                  NATIVE · {droneConnectionState === "disconnected" ? "Disconnected" : "Connected"}
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1 text-[var(--redesign-green)]">
            <BatteryMedium size={13} className="text-[var(--redesign-text-secondary)]" />
            <span className="text-[10px] font-mono text-[var(--redesign-text-secondary)]">{Math.round(signalStrength)}%</span>
            <Wifi size={12} />
            <span className="text-[10px] font-mono">{latencyMs || 10}ms</span>
          </div>
          <Settings size={12} className="text-[var(--redesign-text-secondary)] cursor-pointer hover:text-[var(--redesign-text-primary)]" />
        </div>
      </header>}

      {/* Local storage warning banner */}
      {!immersiveMode && <LocalStorageBanner onSignIn={() => setSignInOpen(true)} />}

      {/* Sign-in modal */}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />

      {/* Connect dialog */}
      <ConnectDialog />

      {/* Disconnect guard — warns about uncommitted param writes */}
      <DisconnectGuard
        open={guardOpen}
        onCommitAndDisconnect={commitAndDisconnect}
        onDiscardAndDisconnect={discardAndDisconnect}
        onCancel={cancelDisconnect}
      />

      {/* Body */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <DemoProvider />
        <CommandPalette />
        <FailsafeAlertBanner />
        <SlcanModeBanner />
        {!immersiveMode && <PluginCrashBanner />}
        {children}
        <AgentMavlinkBridge />
        <MeshToastBridge />
        <AgentBridges />
        <CloudDroneBridge />
        <LocalDroneBridge />
      </main>

      {/* C2 Status Bar */}
      {!immersiveMode && <C2StatusBar />}
    </div>
  );
}
