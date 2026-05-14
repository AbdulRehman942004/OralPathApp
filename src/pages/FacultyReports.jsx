import { useMemo, useState } from "react";
import { getAttempts } from "../utils/storage.js";
import { Donut, LineChart, MultiDonut } from "../components/Charts.jsx";

export default function FacultyReports() {
  const attempts = getAttempts();
  const [filterStudent, setFilterStudent] = useState("");

  const students = useMemo(() => {
    const map = {};
    attempts.forEach(a => {
      if (a.role !== "student") return;
      if (!map[a.userEmail]) map[a.userEmail] = { name: a.userName, email: a.userEmail, attempts: [] };
      map[a.userEmail].attempts.push(a);
    });
    return Object.values(map);
  }, [attempts]);

  const filtered = filterStudent ? attempts.filter(a => a.userEmail === filterStudent) : attempts;

  const byQuiz = useMemo(() => {
    const map = {};
    filtered.forEach(a => {
      if (!map[a.title]) map[a.title] = [];
      map[a.title].push(a);
    });
    return Object.entries(map).map(([title, list]) => ({
      title,
      n: list.length,
      avg: Math.round(list.reduce((s, a) => s + a.percent, 0) / list.length)
    })).sort((a, b) => b.n - a.n);
  }, [filtered]);

  // Trend chart: chronological order
  const trend = useMemo(() => {
    return [...filtered]
      .sort((a, b) => new Date(a.when) - new Date(b.when))
      .map((a, i) => ({ x: `#${i + 1}`, y: a.percent }));
  }, [filtered]);

  // Pass / fail / distinction distribution
  const dist = useMemo(() => {
    const distn  = filtered.filter(a => a.percent >= 80).length;
    const pass   = filtered.filter(a => a.percent >= 50 && a.percent < 80).length;
    const fail   = filtered.filter(a => a.percent < 50).length;
    return [
      { label: "Distinction (≥80%)", value: distn, color: "var(--success)" },
      { label: "Pass (50–79%)",      value: pass,  color: "var(--brand)" },
      { label: "Fail (<50%)",        value: fail,  color: "var(--danger)" }
    ];
  }, [filtered]);

  const avg = filtered.length ? Math.round(filtered.reduce((s, a) => s + a.percent, 0) / filtered.length) : 0;
  const passRate = filtered.length ? Math.round(filtered.filter(a => a.percent >= 50).length / filtered.length * 100) : 0;

  const exportCSV = () => {
    const rows = [["When", "Student", "Email", "Quiz", "Score", "Total", "Percent"]];
    filtered.forEach(a => rows.push([
      new Date(a.when).toISOString(), a.userName, a.userEmail, a.title, a.score, a.total, a.percent
    ]));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `oralpath-attempts-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="container section fade-in">
      <div className="spread mb-16">
        <div>
          <h2 className="section__title">Performance reports</h2>
          <p className="section__sub">
            Every student quiz attempt on this device. In a deployed multi-user build, this would aggregate from a server.
          </p>
        </div>
        <button className="btn" onClick={exportCSV} disabled={!filtered.length}>⤓ Export CSV</button>
      </div>

      <div className="stats mb-24">
        <div className="stat"><div className="stat__icon">📝</div><div className="stat__label">Total attempts</div><div className="stat__value">{filtered.length}</div></div>
        <div className="stat"><div className="stat__icon">👥</div><div className="stat__label">Unique students</div><div className="stat__value">{students.length}</div></div>
        <div className="stat"><div className="stat__icon">📊</div><div className="stat__label">Class average</div><div className="stat__value">{avg}%</div></div>
        <div className="stat"><div className="stat__icon">🎯</div><div className="stat__label">Pass rate (≥50%)</div><div className="stat__value">{passRate}%</div></div>
      </div>

      <div className="row mb-16" style={{ gap: 10, flexWrap: "wrap" }}>
        <label className="muted">Filter by student:</label>
        <select
          value={filterStudent}
          onChange={(e) => setFilterStudent(e.target.value)}
          style={{ background: "var(--bg-2)", color: "var(--text)", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)" }}
        >
          <option value="">All students</option>
          {students.map(s => <option key={s.email} value={s.email}>{s.name} ({s.email})</option>)}
        </select>
      </div>

      <div className="grid mb-24" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="chart-card">
          <h3>Score over time</h3>
          <p className="muted" style={{ fontSize: 13 }}>Chronological view of every attempt currently in scope.</p>
          <div className="mt-16">
            <LineChart data={trend} height={240} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Grade distribution</h3>
          <p className="muted" style={{ fontSize: 13 }}>
            Pass = ≥50% · Distinction = ≥80%.
          </p>
          <div className="donut-wrap mt-16">
            <div className="donut">
              <MultiDonut segments={dist} size={150} />
            </div>
            <div className="donut-legend">
              {dist.map(s => (
                <div key={s.label}>
                  <span className="dot" style={{ background: s.color }}></span>
                  <b>{s.value}</b> · {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h3 className="section__title">Average score per quiz</h3>
      {byQuiz.length ? (
        <div className="chart-card mb-24">
          <div className="bars">
            {byQuiz.map(q => (
              <div className="bar" key={q.title}>
                <div style={{ fontSize: 13 }}>{q.title}</div>
                <div className="bar__track"><div className="bar__fill" style={{ width: `${q.avg}%` }} /></div>
                <div className="bar__val">{q.avg}% · n={q.n}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="notice">No data yet. Ask students to take a quiz to populate this view.</div>
      )}

      <h3 className="section__title">All attempts</h3>
      {filtered.length ? (
        <table className="table">
          <thead><tr><th>When</th><th>Student</th><th>Quiz</th><th>Score</th><th>%</th></tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td>{new Date(a.when).toLocaleString()}</td>
                <td>{a.userName} <span className="muted" style={{ fontSize: 12 }}>{a.userEmail}</span></td>
                <td>{a.title}</td>
                <td>{a.score}/{a.total}</td>
                <td>
                  <span className={"tag " + (a.percent >= 70 ? "" : a.percent >= 50 ? "tag--warn" : "tag--danger")}>
                    {a.percent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="notice">No attempts found for this filter.</div>
      )}
    </section>
  );
}
