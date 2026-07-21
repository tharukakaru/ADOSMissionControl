import { AlertTriangle } from "lucide-react";
import { RadarScope } from "./RadarScope";
import { TewaTable } from "./TewaTable";
import { InterceptorBatteries } from "./InterceptorBatteries";
import { SensorGridHealth } from "./SensorGridHealth";

/** Center module: SENTINEL radar early-warning / interceptor. */
export function SentinelPanel() {
  return (
    <main className="center">
      <div className="modhead">
        <div className="badge">
          <AlertTriangle />
        </div>
        <div>
          <h1>SENTINEL</h1>
          <div className="ms">Radar Early-Warning / Interceptor · v1.0</div>
        </div>
      </div>

      <div className="grid2">
        <RadarScope />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <TewaTable />
          <InterceptorBatteries />
        </div>
      </div>

      <SensorGridHealth />
    </main>
  );
}
