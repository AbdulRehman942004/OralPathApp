import { attemptsFor } from "../utils/storage.js";
import { Link } from "../utils/router.js";
import { ACHIEVEMENTS, computeAchievements } from "../utils/achievements.js";
import { Donut, LineChart } from "../components/Charts.jsx";

export default function Results({ user }) {
  const attempts = attemptsFor(user.email);
  const earned = computeAchievements(user.email);

  if (!attempts.length) {
    return (
      <section className="container section">
        <h2 className="section__title">My results</h2>
        <div className="notice">No attempts yet. Take a quiz to see your scores here.</div>
        <Link to="/quiz"><button className="btn btn--primary mt-12">Take a quiz</button></Link>
      </section>
    );
  }

  const byQuiz = {};
  attempts.forEach(a => {
    if (!byQuiz[a.title]) byQuiz[a.title] = [];
    byQuiz[a.title].push(a);
  });

  const avg = Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length);
  const best = Math.max(...attempts.map(a => a.percent));
  const trend = [...attempts]
    .sort((a, b) => new Date(a.when) - new Date(b.when))
    .map((a, i) => ({ x: `#${i + 1}`, y: a.percent }));

  return (
    <section className="container section fade-in">
      <div className="spread mb-16">
        <div>
          <h2 className="section__title">My results</h2>
          <p className="section__sub">{attempts.length} attempts across {Object.keys(byQuiz).length} quizzes.</p>
        </div>
        <Link to="/quiz"><button className="btn btn--primary">📝 Take another</button></Link>
      </div>

      <div className="grid mb-24" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="chart-card">
          <div className="spread">
            <div>
              <h3>Score over time</h3>
              <p className="muted" style={{ fontSize: 13 }}>Every attempt in chronological order.</p>
            </div>
            <span className="tag">avg {avg}% · best {best}%</span>
          </div>
          <div className="mt-16">
            <LineChart data={trend} height={240} />
          </div>
        </div>
        <div className="chart-card">
          <div className="spread">
            <div>
              <h3>Overall mastery</h3>
              <p className="muted" style={{ fontSize: 13 }}>Average across all attempts.</p>
            </div>
            <Donut value={avg} max={100} color="var(--brand)" />
          </div>
          <div className="row mt-16" style={{ gap: 8, flexWrap: "wrap" }}>
            <span className="tag">{attempts.length} attempts</span>
            <span className="tag tag--accent">best {best}%</span>
            <span className="tag tag--violet">{Object.keys(byQuiz).length} quizzes</span>
          </div>
        </div>
      </div>

      <h3 className="section__title">Performance by quiz</h3>
      <div className="chart-card mb-24">
        <div className="bars">
          {Object.entries(byQuiz).map(([title, list]) => {
            const a = Math.round(list.reduce((s, x) => s + x.percent, 0) / list.length);
            return (
              <div className="bar" key={title}>
                <div style={{ fontSize: 13 }}>{title}</div>
                <div className="bar__track"><div className="bar__fill" style={{ width: `${a}%` }} /></div>
                <div className="bar__val">{a}% · n={list.length}</div>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="section__title">Achievements unlocked</h3>
      <div className="badge-grid mb-24">
        {ACHIEVEMENTS.map(a => (
          <div key={a.id} className={"badge " + (earned[a.id] ? "badge--earned" : "badge--locked")}>
            <div className="badge__icon">{a.icon}</div>
            <h4>{a.title}</h4>
            <p>{a.hint}</p>
          </div>
        ))}
      </div>

      <h3 className="section__title">All attempts</h3>
      <table className="table">
        <thead>
          <tr><th>When</th><th>Quiz</th><th>Score</th><th>Time</th><th>%</th></tr>
        </thead>
        <tbody>
          {attempts.map(a => (
            <tr key={a.id}>
              <td>{new Date(a.when).toLocaleString()}</td>
              <td>{a.title}</td>
              <td>{a.score}/{a.total}</td>
              <td>{a.timeSec ? `${Math.floor(a.timeSec/60)}m ${a.timeSec%60}s` : "—"}</td>
              <td>
                <span className={"tag " + (a.percent >= 70 ? "" : a.percent >= 50 ? "tag--warn" : "tag--danger")}>
                  {a.percent}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
