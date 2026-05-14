import { Link } from "../utils/router.js";
import { TOPICS } from "../data/topics.js";
import { attemptsFor } from "../utils/storage.js";
import { ACHIEVEMENTS, attemptsByDay, computeAchievements, computeStreak } from "../utils/achievements.js";
import { Donut, Heatmap, Sparkline } from "../components/Charts.jsx";

export default function StudentHome({ user }) {
  const attempts = attemptsFor(user.email);
  const last = attempts[0];
  const avg = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length)
    : 0;
  const best = attempts.length ? Math.max(...attempts.map(a => a.percent)) : 0;
  const trend = attempts.slice(0, 12).reverse().map(a => a.percent);
  const streak = computeStreak(user.email);
  const days = attemptsByDay(user.email);
  const earned = computeAchievements(user.email);
  const earnedCount = Object.values(earned).filter(Boolean).length;

  return (
    <section className="container section fade-in">
      <div className="spread mb-24">
        <div>
          <span className="hero__chip"><span className="dot" />Student dashboard</span>
          <h2 className="section__title mt-12">
            Welcome back, {user.name?.split(" ")[0] || "Student"} 👋
          </h2>
          <p className="section__sub">
            Pick up where you left off, take a quick quiz, or explore anatomy in 3D.
          </p>
        </div>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Link to="/quiz"><button className="btn btn--primary">📝 Take sample quiz</button></Link>
          <Link to="/ar"><button className="btn">🦷 Explore AR</button></Link>
        </div>
      </div>

      <div className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="chart-card fade-in fade-in--d1">
          <div className="spread">
            <div>
              <h3>Recent score trend</h3>
              <p className="muted" style={{ fontSize: 13 }}>Last {trend.length || 0} attempts · higher is better.</p>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span className="tag">avg {avg}%</span>
              <span className="tag tag--accent">best {best}%</span>
            </div>
          </div>
          <div className="mt-12" style={{ width: "100%" }}>
            <Sparkline values={trend.length ? trend : [0]} width={680} height={120} />
          </div>
        </div>

        <div className="chart-card fade-in fade-in--d2">
          <div className="spread">
            <div>
              <h3>Mastery</h3>
              <p className="muted" style={{ fontSize: 13 }}>Average across all attempts.</p>
            </div>
            <Donut value={avg} max={100} color="var(--brand)" />
          </div>
          {streak > 0 ? (
            <div className="streak mt-16">
              <div>
                <div className="streak__num">{streak}</div>
                <div className="streak__label">day streak 🔥</div>
                <div className="streak__sub">Keep going — take a quiz today.</div>
              </div>
            </div>
          ) : (
            <div className="notice mt-16">Take a quiz today to start a learning streak.</div>
          )}
        </div>
      </div>

      <div className="stats mb-24">
        <div className="stat"><div className="stat__icon">📝</div><div className="stat__label">Attempts</div><div className="stat__value">{attempts.length}</div></div>
        <div className="stat"><div className="stat__icon">⭐</div><div className="stat__label">Best score</div><div className="stat__value">{best}%</div></div>
        <div className="stat"><div className="stat__icon">📊</div><div className="stat__label">Average</div><div className="stat__value">{avg}%</div></div>
        <div className="stat"><div className="stat__icon">📚</div><div className="stat__label">Topics</div><div className="stat__value">{TOPICS.length}</div></div>
        <div className="stat">
          <div className="stat__icon">🏆</div>
          <div className="stat__label">Achievements</div>
          <div className="stat__value">{earnedCount}/{ACHIEVEMENTS.length}</div>
        </div>
      </div>

      <h3 className="section__title">Study tools</h3>
      <div className="grid mb-24">
        <Link to="/reading" className="card card--feature">
          <div className="card__icon">📖</div>
          <h3>Reading</h3>
          <p>Concise notes on every topic in the syllabus, with bookmarks and per-topic notes.</p>
        </Link>
        <Link to="/cv" className="card card--violet">
          <div className="card__icon">🔬</div>
          <h3>CV image lab</h3>
          <p>Upload a radiograph and explore grayscale, histogram, Sobel edges and segmentation in-browser.</p>
        </Link>
        <Link to="/prompting" className="card card--warm">
          <div className="card__icon">💡</div>
          <h3>Prompting drills</h3>
          <p>Clinical vignettes — type your answer and compare against the model response.</p>
        </Link>
        <Link to="/ar" className="card">
          <div className="card__icon">🦷</div>
          <h3>3D / AR anatomy</h3>
          <p>Photoreal NIH 3D models with augmented-reality projection on Android.</p>
        </Link>
        <Link to="/quiz" className="card">
          <div className="card__icon">📝</div>
          <h3>Take a quiz</h3>
          <p>Topic-targeted or randomised mixed quizzes with instant feedback.</p>
        </Link>
        <Link to="/blog" className="card">
          <div className="card__icon">✍️</div>
          <h3>Faculty blog</h3>
          <p>Articles and supplementary PDFs published by your teachers.</p>
        </Link>
        <Link to="/results" className="card">
          <div className="card__icon">📈</div>
          <h3>My results</h3>
          <p>Review your trends, per-quiz averages and every attempt.</p>
        </Link>
        <Link to="/guide" className="card">
          <div className="card__icon">❓</div>
          <h3>User guide</h3>
          <p>Every feature, with annotated screenshots.</p>
        </Link>
      </div>

      <div className="grid mb-24" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <div className="chart-card">
          <div className="spread">
            <div>
              <h3>Achievements</h3>
              <p className="muted" style={{ fontSize: 13 }}>{earnedCount} of {ACHIEVEMENTS.length} unlocked — keep practising to fill the set.</p>
            </div>
            <span className="tag tag--accent">+{earnedCount * 10} XP</span>
          </div>
          <div className="badge-grid mt-16">
            {ACHIEVEMENTS.map(a => (
              <div key={a.id} className={"badge " + (earned[a.id] ? "badge--earned" : "badge--locked")}>
                <div className="badge__icon">{a.icon}</div>
                <h4>{a.title}</h4>
                <p>{a.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="spread">
            <div>
              <h3>Activity (last 84 days)</h3>
              <p className="muted" style={{ fontSize: 13 }}>One dot per day. Darker = more attempts.</p>
            </div>
          </div>
          <div className="mt-16">
            <Heatmap days={84} values={days} max={5} />
          </div>
          <div className="row mt-16" style={{ gap: 10, fontSize: 12, color: "var(--muted)" }}>
            <span>Less</span>
            {["var(--bg-2)", "rgba(25,211,197,0.25)", "rgba(25,211,197,0.45)", "rgba(25,211,197,0.70)", "var(--brand)"].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c, border: "1px solid var(--border)" }} />
            ))}
            <span>More</span>
          </div>
        </div>
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
