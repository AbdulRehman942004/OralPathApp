import { useMemo, useState } from "react";
import { getAttempts } from "../utils/storage.js";

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

  const byQuiz = useMemo(() => {
    const map = {};
    attempts.forEach(a => {
      if (filterStudent && a.userEmail !== filterStudent) return;
      if (!map[a.title]) map[a.title] = [];
      map[a.title].push(a);
    });
    return Object.entries(map).map(([title, list]) => ({
      title,
      n: list.length,
      avg: Math.round(list.reduce((s, a) => s + a.percent, 0) / list.length)
    })).sort((a, b) => b.n - a.n);
  }, [attempts, filterStudent]);

  const filtered = filterStudent ? attempts.filter(a => a.userEmail === filterStudent) : attempts;

  return (
    <section className="container section">
      <h2 className="section__title">Performance reports</h2>
      <p className="section__sub">
        All student quiz attempts on this device. In a deployed multi-user build, this would aggregate from the server.
      </p>

      <div className="stats mb-24">
        <div className="stat"><div className="stat__label">Total attempts</div><div className="stat__value">{attempts.length}</div></div>
        <div className="stat"><div className="stat__label">Unique students</div><div className="stat__value">{students.length}</div></div>
        <div className="stat">
          <div className="stat__label">Class average</div>
          <div className="stat__value">
            {attempts.length ? Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length) : 0}%
          </div>
        </div>
        <div className="stat">
          <div className="stat__label">Pass rate (≥50%)</div>
          <div className="stat__value">
            {attempts.length ? Math.round(attempts.filter(a => a.percent >= 50).length / attempts.length * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="row mb-16" style={{ gap: 10 }}>
        <label className="muted">Filter by student:</label>
        <select
          value={filterStudent}
          onChange={(e) => setFilterStudent(e.target.value)}
          style={{ background: "var(--bg-2)", color: "var(--text)", padding: "8px 10px", borderRadius: 10, border: "1px solid var(--border)" }}
        >
          <option value="">All students</option>
          {students.map(s => <option key={s.email} value={s.email}>{s.name} ({s.email})</option>)}
        </select>
      </div>

      <h3 className="section__title">Average score per quiz</h3>
      {byQuiz.length ? (
        <div className="bars mb-24">
          {byQuiz.map(q => (
            <div className="bar" key={q.title}>
              <div style={{ fontSize: 13 }}>{q.title}</div>
              <div className="bar__track"><div className="bar__fill" style={{ width: `${q.avg}%` }} /></div>
              <div className="bar__val">{q.avg}% · n={q.n}</div>
            </div>
          ))}
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
