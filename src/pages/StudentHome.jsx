import { Link } from "../utils/router.js";
import { TOPICS } from "../data/topics.js";
import { attemptsFor } from "../utils/storage.js";

export default function StudentHome({ user }) {
  const attempts = attemptsFor(user.email);
  const last = attempts[0];
  const avg = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length)
    : 0;

  return (
    <section className="container section">
      <div className="spread mb-16">
        <div>
          <h2 className="section__title">Welcome, {user.name?.split(" ")[0] || "Student"} 👋</h2>
          <p className="section__sub">Pick up where you left off, or start with a sample quiz.</p>
        </div>
        <Link to="/quiz"><button className="btn btn--primary">Take sample quiz</button></Link>
      </div>

      <div className="stats mb-24">
        <div className="stat">
          <div className="stat__label">Attempts</div>
          <div className="stat__value">{attempts.length}</div>
        </div>
        <div className="stat">
          <div className="stat__label">Average score</div>
          <div className="stat__value">{avg}%</div>
        </div>
        <div className="stat">
          <div className="stat__label">Topics available</div>
          <div className="stat__value">{TOPICS.length}</div>
        </div>
        <div className="stat">
          <div className="stat__label">Last attempt</div>
          <div className="stat__value" style={{ fontSize: 18 }}>
            {last ? `${last.title} • ${last.percent}%` : "—"}
          </div>
        </div>
      </div>

      <h3 className="section__title">Study tools</h3>
      <div className="grid mb-24">
        <Link to="/reading" className="card">
          <div className="card__icon">📖</div>
          <h3>Reading</h3>
          <p>Concise notes on every topic in the syllabus.</p>
        </Link>
        <Link to="/prompting" className="card">
          <div className="card__icon">💡</div>
          <h3>Prompting drills</h3>
          <p>Practice clinical vignettes — type your own answer and compare.</p>
        </Link>
        <Link to="/ar" className="card">
          <div className="card__icon">🦷</div>
          <h3>AR anatomy</h3>
          <p>3D models with augmented-reality projection on Android.</p>
        </Link>
        <Link to="/quiz" className="card">
          <div className="card__icon">📝</div>
          <h3>Take a quiz</h3>
          <p>Topic quizzes or a randomised mixed sample.</p>
        </Link>
        <Link to="/results" className="card">
          <div className="card__icon">📈</div>
          <h3>My results</h3>
          <p>Review all your past attempts and trends.</p>
        </Link>
        <Link to="/guide" className="card">
          <div className="card__icon">❓</div>
          <h3>User guide</h3>
          <p>How to use every feature, with annotated screenshots.</p>
        </Link>
      </div>

      <h3 className="section__title">Recent attempts</h3>
      {attempts.length ? (
        <table className="table">
          <thead>
            <tr><th>When</th><th>Quiz</th><th>Score</th><th>Result</th></tr>
          </thead>
          <tbody>
            {attempts.slice(0, 8).map(a => (
              <tr key={a.id}>
                <td>{new Date(a.when).toLocaleString()}</td>
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
        <div className="notice">No attempts yet. Take your first quiz to see results here.</div>
      )}
    </section>
  );
}
