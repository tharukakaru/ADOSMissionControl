"use client";

import { useCallback, useRef } from "react";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFirmwareState } from "./useFirmwareState";
import { FirmwareFcWizard } from "./FirmwareFcWizard";
import { FirmwareFlashProgress } from "./FirmwareFlashProgress";
import { ArcOsAgentSection } from "./ArcOsAgentSection";
import { FirmwareApPeriphSection } from "./FirmwareApPeriphSection";
import { flashApPeriph } from "./flashApPeriph";
import { ApPeriphManifest } from "@/lib/protocol/firmware/ap-periph-manifest";
import { useDroneManager } from "@/stores/drone-manager";
import { useToast } from "@/components/ui/toast";
import { FirmwareStackSelector, PreFlashChecklist } from "./FirmwareCommonSections";
import { isArcOsStack, isPeripheralStack, isFcStack } from "./firmware-constants";
import type { ArcOsAgentStack } from "@/lib/protocol/firmware/arcos-agent-manifest";

export function FirmwarePanel() {
  const fw = useFirmwareState();
  const isFc = isFcStack(fw.firmwareStack);
  const isArcOs = isArcOsStack(fw.firmwareStack);
  const isPeripheral = isPeripheralStack(fw.firmwareStack);
  const t = useTranslations("flashTool.arcos");
  const { toast } = useToast();
  const getSelectedProtocol = useDroneManager((s) => s.getSelectedProtocol);
  const apPeriphManifestRef = useRef(new ApPeriphManifest());
  const flashDisposerRef = useRef<null | (() => Promise<void>)>(null);

  const handleApPeriphFlash = useCallback(
    async ({
      targetNodeId,
      board,
      channel,
      transport,
    }: {
      targetNodeId: number;
      board: string;
      channel: string;
      transport: "slcan" | "can-forward";
    }) => {
      const protocol = getSelectedProtocol();
      if (!protocol) {
        toast("Connect a drone before flashing", "warning");
        return;
      }
      if (flashDisposerRef.current) {
        await flashDisposerRef.current().catch(() => undefined);
        flashDisposerRef.current = null;
      }
      try {
        const handle = await flashApPeriph({
          protocol,
          targetNodeId,
          board,
          channel,
          manifest: apPeriphManifestRef.current,
          transport,
        });
        flashDisposerRef.current = handle.dispose;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Flash failed";
        toast(`Flash failed: ${msg}`, "error");
      }
    },
    [getSelectedProtocol, toast],
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-accent-primary" />
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Flash Tool</h1>
            <p className="text-xs text-text-tertiary">
              {isArcOs ? t("subtitle") : "Flash firmware via USB DFU or serial bootloader"}
            </p>
          </div>
        </div>

        <FirmwareStackSelector
          firmwareStack={fw.firmwareStack} setFirmwareStack={fw.setFirmwareStack}
          isFlashing={fw.isFlashing} setUseCustom={fw.setUseCustom}
          droneType={fw.drone?.vehicleInfo.firmwareType}
        />

        {/* Flight-controller stacks: stepped Connect -> Select -> Confirm -> Flash wizard */}
        {isFc && <FirmwareFcWizard fw={fw} />}

        {/* ARCOS companion-computer stacks */}
        {isArcOs && (
          <>
            <details className="bg-bg-secondary border border-border-default">
              <summary className="px-4 py-2.5 text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
                {t("disclosure.pathChoice.summary")}
              </summary>
              <div className="px-4 pb-3 space-y-2 text-[10px] text-text-tertiary">
                <p>{t("disclosure.pathChoice.browserFlash")}</p>
                <p>{t("disclosure.pathChoice.installCommand")}</p>
                <p>{t("disclosure.pathChoice.pickerHint")}</p>
              </div>
            </details>

            <details className="bg-bg-secondary border border-border-default">
              <summary className="px-4 py-2.5 text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
                {t("disclosure.bootrom.summary")}
              </summary>
              <div className="px-4 pb-3 space-y-2 text-[10px] text-text-tertiary">
                <ol className="list-decimal list-inside space-y-1 ml-1">
                  <li>{t("disclosure.bootrom.step1")}</li>
                  <li>{t("disclosure.bootrom.step2")}</li>
                  <li>{t("disclosure.bootrom.step3")}</li>
                  <li>{t("disclosure.bootrom.step4")}</li>
                  <li>{t("disclosure.bootrom.step5")}</li>
                </ol>
                <p className="mt-2">{t("disclosure.bootrom.hint")}</p>
              </div>
            </details>

            {fw.arcosInstallMethod === "web-flash" && !fw.usbSupported && (
              <div className="bg-status-danger/10 border border-status-danger/30 p-4">
                <p className="text-xs text-status-danger font-semibold">{t("webusbWarning.title")}</p>
                <p className="text-[10px] text-text-tertiary mt-1">{t("webusbWarning.body")}</p>
              </div>
            )}

            <ArcOsAgentSection
              stack={fw.firmwareStack as ArcOsAgentStack}
              boards={fw.arcosBoards}
              loading={fw.arcosLoading}
              error={fw.arcosError}
              agentVersion={fw.arcosAgentVersion}
              manifestSource={fw.arcosManifestSource}
              selectedBoardId={fw.selectedArcOsBoardId}
              setSelectedBoardId={fw.setSelectedArcOsBoardId}
              onRetry={fw.loadArcOsManifestRetry}
              allChecked={fw.allChecked}
              usbSupported={fw.usbSupported}
            />

            <PreFlashChecklist
              items={fw.checklistItems}
              checked={fw.checked}
              setChecked={fw.setChecked}
              intro={t("checklist.intro")}
            />

            {fw.progress && (
              <FirmwareFlashProgress progress={fw.progress} isFlashing={fw.isFlashing} onAbort={fw.handleAbort} />
            )}
            {fw.flashMessage && !fw.progress && (
              <div className="bg-bg-secondary border border-border-default p-3">
                <p className="text-[10px] text-text-tertiary font-mono">{fw.flashMessage}</p>
              </div>
            )}
            {fw.currentError && (
              <div className="bg-status-danger/10 border border-status-danger/30 p-3">
                <p className="text-[10px] text-status-danger">{fw.currentError}</p>
              </div>
            )}
          </>
        )}

        {/* AP_Periph (CAN node) stack */}
        {isPeripheral && (
          <>
            <PreFlashChecklist items={fw.checklistItems} checked={fw.checked} setChecked={fw.setChecked} />
            <FirmwareApPeriphSection
              checklistAllChecked={fw.allChecked}
              isFlashing={fw.isFlashing}
              onFlash={handleApPeriphFlash}
            />
          </>
        )}
      </div>
    </div>
  );
}
