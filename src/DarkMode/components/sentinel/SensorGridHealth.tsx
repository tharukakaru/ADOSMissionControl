import { SENSORS } from "../../data/dummyData";
import { ProgressBar } from "../ui/ProgressBar";

export function SensorGridHealth() {
  const online = SENSORS.filter((s) => s.online).length;

  return (
    <div className="sensors">
      <div className="ch" style={{ border: "none", padding: 0 }}>
        <span className="bar" />
        <span className="ct up">Sensor Grid Health</span>
        <span className="tag tag-on up">
          {online}/{SENSORS.length} Online
        </span>
      </div>
      <div className="sgrid">
        {SENSORS.map((s) => (
          <div className="sens" key={s.name}>
            <div className="s-r1">
              <span
                className="dot"
                style={{ background: s.overloaded ? "var(--arc-red-d)" : "var(--arc-green-b)" }}
              />
              <span className="s-nm">{s.name}</span>
            </div>
            <div className="s-sub up">{s.kind}</div>
            <div className="s-load">
              <div className="lr up">
                <span>Load</span>
                <span>{s.load}%</span>
              </div>
              <ProgressBar pct={s.load} fill={s.overloaded ? "red" : "cyan"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
