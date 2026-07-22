/**
 * @module fc/firmware/firmware-state/use-arcos-agent-firmware
 * @description Owns the ARCOS-agent slice of the firmware picker: the
 * board catalog (network manifest or demo fallback), the loader, the
 * effect that resets the selected board when the drone/ground stack
 * switches, and the derived install method for the selected board.
 * @license GPL-3.0-only
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type ArcOsAgentBoard,
  type ArcOsAgentStack,
} from "@/lib/protocol/firmware/arcos-agent-manifest";
import type { FirmwareStack } from "@/lib/protocol/firmware/types";
import { isDemoMode } from "@/lib/utils";
import { isArcOsStack } from "../firmware-constants";
import { arcosManifest } from "./manifests";
import { DEMO_ARCOS_AGENT_VERSION, DEMO_ARCOS_BOARDS } from "./demo-catalog";

export function useArcOsAgentFirmware(firmwareStack: FirmwareStack) {
  const [arcosBoards, setArcOsBoards] = useState<ArcOsAgentBoard[]>([]);
  const [arcosLoading, setArcOsLoading] = useState(false);
  const [arcosError, setArcOsError] = useState("");
  const [arcosAgentVersion, setArcOsAgentVersion] = useState("");
  const [selectedArcOsBoardId, setSelectedArcOsBoardId] = useState("");
  // Tracks whether the manifest came from the upstream catalog or the
  // embedded baseline. Drives the "offline catalog" pill in the picker.
  const [arcosManifestSource, setArcOsManifestSource] = useState<string | undefined>(undefined);

  async function loadArcOsManifest() {
    setArcOsLoading(true); setArcOsError("");
    // In demo mode the proxy at /api/arcos-manifest may not be reachable
    // (and adds noise to the demo regardless), so seed the picker with a
    // small built-in catalog and skip the network call entirely.
    if (isDemoMode()) {
      setArcOsBoards(DEMO_ARCOS_BOARDS);
      setArcOsAgentVersion(DEMO_ARCOS_AGENT_VERSION);
      setArcOsManifestSource("fallback");
      const stackKey = isArcOsStack(firmwareStack) ? (firmwareStack as ArcOsAgentStack) : "arcos-drone-agent";
      const first = DEMO_ARCOS_BOARDS.find((b) => b.stacks.includes(stackKey));
      if (first) setSelectedArcOsBoardId(first.id);
      setArcOsLoading(false);
      return;
    }
    try {
      const data = await arcosManifest.getManifest();
      setArcOsBoards(data.boards);
      setArcOsAgentVersion(data.agentVersion);
      setArcOsManifestSource(data.source);
      const stackKey = isArcOsStack(firmwareStack) ? (firmwareStack as ArcOsAgentStack) : "arcos-drone-agent";
      const first = data.boards.find((b) => b.stacks.includes(stackKey));
      if (first) setSelectedArcOsBoardId(first.id);
    } catch (err) {
      setArcOsError(err instanceof Error ? err.message : "Failed to load ARCOS agent manifest");
    } finally { setArcOsLoading(false); }
  }

  // When the ARCOS stack switches between drone and ground, the available
  // boards change. Reset the selected board if it no longer supports the
  // active stack so the picker shows a fresh choice.
  useEffect(() => {
    if (!isArcOsStack(firmwareStack) || arcosBoards.length === 0) return;
    const currentBoard = arcosBoards.find((b) => b.id === selectedArcOsBoardId);
    const stackKey = firmwareStack as ArcOsAgentStack;
    if (!currentBoard || !currentBoard.stacks.includes(stackKey)) {
      const next = arcosBoards.find((b) => b.stacks.includes(stackKey));
      setSelectedArcOsBoardId(next?.id ?? "");
    }
  }, [firmwareStack, arcosBoards, selectedArcOsBoardId]);

  // Selected ARCOS board's install method, if any. Used by FirmwarePanel
  // to gate the WebUSB-required warning to web-flash boards only.
  const arcosInstallMethod = useMemo(() => {
    if (!isArcOsStack(firmwareStack)) return null;
    const board = arcosBoards.find((b) => b.id === selectedArcOsBoardId);
    if (!board) return null;
    const stackKey = firmwareStack as ArcOsAgentStack;
    return board.installs[stackKey]?.method ?? null;
  }, [firmwareStack, arcosBoards, selectedArcOsBoardId]);

  return {
    arcosBoards, arcosLoading, arcosError, arcosAgentVersion,
    arcosManifestSource,
    selectedArcOsBoardId, setSelectedArcOsBoardId, arcosInstallMethod,
    loadArcOsManifest,
    loadArcOsManifestRetry: () => { arcosManifest.clearCache(); loadArcOsManifest(); },
  };
}
