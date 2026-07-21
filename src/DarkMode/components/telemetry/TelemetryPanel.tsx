"use client";

import {
  MoreHorizontal,
  Shield,
  Activity,
  ChevronRight,
  Zap,
  Crosshair,
  ArrowRightLeft,
  Check,
} from "lucide-react";
import { GAUGES, SELECTED_DETAIL } from "../../data/dummyData";
import { Gauge } from "./Gauge";
import { AttitudeIndicator } from "./AttitudeIndicator";
import { ProgressBar } from "../ui/ProgressBar";

export function TelemetryPanel() {
  const d = SELECTED_DETAIL;
  const k = d.kinematics;

  const [num, den] = d.threatLevel.split("/").map(Number);
  const threatPct = den ? Math.max((num / den) * 100, 4) : 4;

  return (
    <aside className="tele">
      <div className="th">
        <span className="bar" />
        <span className="ttl up">ARC OS · Telemetry</span>
        <span className="tag tag-tewa up" style={{ marginLeft: "auto" }}>
          COP
        </span>
      </div>

      <div className="gauges">
        {GAUGES.map((g) => (
          <Gauge key={g.label} gauge={g} />
        ))}
      </div>

      <div className="teledetail">
        <div className="dh">
          <div className="dt">
            <span className="dn">{d.callsign}</span>
            <MoreHorizontal style={{ width: 14, color: "var(--arc-mut)" }} />
          </div>
          <div className="dsub">
            {d.id} · {d.platform}
          </div>
          <div className="dbadges">
            <span className="db db-fr up">Friendly</span>
            <span className="db db-air up">Air</span>
            <span className="db db-iff up">IFF Friend</span>
          </div>
        </div>

        <div className="sect assess">
          <div className="sl up">
            <Shield />
            Assessment
          </div>
          <div className="ar">
            <div className="arl">
              <span className="k up">Threat Level</span>
              <span className="v">{d.threatLevel}</span>
            </div>
            <ProgressBar pct={threatPct} fill="lime" />
          </div>
          <div className="ar">
            <div className="arl">
              <span className="k up">ID Confidence</span>
              <span className="v">{d.idConfidence}%</span>
            </div>
            <ProgressBar pct={d.idConfidence} fill="green-b" />
          </div>
        </div>

        <div className="sect">
          <div className="sl up">
            <Activity />
            Kinematics
          </div>
          <div className="kin">
            <div className="adi">
              <AttitudeIndicator heading={k.heading} />
            </div>
            <div className="kvs">
              <div className="kv">
                <span className="k up">Heading</span>
                <span className="v">{k.heading}°</span>
              </div>
              <div className="kv">
                <span className="k up">Speed</span>
                <span className="v">{k.speed}</span>
              </div>
              <div className="kv">
                <span className="k up">Altitude</span>
                <span className="v">{k.altitude}</span>
              </div>
              <div className="kv">
                <span className="k up">Updated</span>
                <span className="v" style={{ color: "var(--arc-green-b)" }}>
                  {k.updated}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="posrow">
          <ChevronRight />
          Position · WGS-84
        </div>
      </div>

      <div className="tele-actions">
        <button type="button" className="tab-act eng up">
          <Zap />
          Engage
        </button>
        <button type="button" className="tab-act up">
          <Crosshair />
          Track
        </button>
        <button type="button" className="tab-act up">
          <ArrowRightLeft />
          Handoff
        </button>
        <button type="button" className="tab-act up">
          <Check />
          Classify
        </button>
      </div>
    </aside>
  );
}
