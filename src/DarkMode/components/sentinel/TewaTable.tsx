import { TEWA } from "../../data/dummyData";

export function TewaTable() {
  return (
    <div className="card tewa">
      <div className="ch">
        <span className="bar" />
        <span className="ct up">Threat Evaluation &amp; Weapon Assignment</span>
        <span className="tag tag-tewa up">TEWA</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>BRG</th>
            <th>RNG</th>
            <th>TTI</th>
          </tr>
        </thead>
        <tbody>
          {TEWA.map((r) => (
            <tr key={r.id}>
              <td className="id">{r.id}</td>
              <td>{r.type}</td>
              <td className="num">{r.bearing}</td>
              <td className="num">{r.range}</td>
              <td className={`num${r.imminent ? " ttired" : ""}`}>{r.tti}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
