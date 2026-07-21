"use client";

import "@fontsource/chakra-petch/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "../arc.css";
import "./killchain.css";

import { KillChainTopBar } from "./KillChainTopBar";
import { KillChainRail } from "./KillChainRail";
import { KillChainBoard } from "./KillChainBoard";

export default function KillChainApp() {
  return (
    <div className="arc arc--killchain">
      <div className="kc-shell">
        <div className="kc-main">
          <KillChainTopBar />
          <div className="kc-body">
            <KillChainRail />
            <KillChainBoard />
          </div>
        </div>
      </div>
    </div>
  );
}
