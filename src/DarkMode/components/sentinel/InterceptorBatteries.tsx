import { Rocket } from "lucide-react";
import { BATTERIES } from "../../data/dummyData";
import { ProgressBar } from "../ui/ProgressBar";

export function InterceptorBatteries() {
  return (
    <div className="card">
      <div className="ch">
        <span className="bar" />
        <span className="ct up">Interceptor Batteries</span>
        <span className="tag tag-eng up">Engagement</span>
      </div>
      <div className="batt-grid">
        {BATTERIES.map((b) => {
          const pct = b.total > 0 ? (b.ready / b.total) * 100 : 0;
          return (
            <div className="batt" key={b.name}>
              <div className="bt-r1">
                <span className="bt-ic">
                  <Rocket />
                </span>
                <span className="bt-nm">{b.name}</span>
                <span className="ready up">Ready</span>
              </div>
              <div className="bt-sub up">{b.role}</div>
              <div className="bt-bar">
                <span className="bt-lbl up">Ready</span>
                <ProgressBar pct={pct} fill="green" />
                <span className="bt-amt mono">
                  {b.ready}/{b.total}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
