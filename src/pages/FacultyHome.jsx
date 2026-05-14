import { Link } from "../utils/router.js";
import { getAttempts, getMaterials } from "../utils/storage.js";
import { Donut, Sparkline } from "../components/Charts.jsx";

export default function FacultyHome({ user }) {
  const materials = getMaterials();
  const attempts = getAttempts();
  const studentCount = new Set(attempts.filter(a => a.role === "student").map(a => a.userEmail)).size;
  const avg = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length)
    : 0;
  const passRate = attempts.length
    ? Math.round(attempts.filter(a => a.percent >= 50).length / attempts.length * 100)
    : 0;

  const recent = attempts.slice(0, 14).reverse().map(a => a.percent);

  return (
    <section className="container section fade-in">
      <div className="spread mb-24">
        <div>
          <span className="hero__chip"><span className="dot" />Faculty dashboard</span>
          <h2 className="section__title mt-12">
            Welcome, Dr. {user.name?.split(" ").slice(-1)[0] || "Faculty"} 👋
          </h2>
          <p className="section__sub">Manage materials, generate quizzes from PDFs, and review class performance.</p>
        </div>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Link to="/upload"><button className="btn btn--primary">📄 Upload PDF &amp; generate quiz</button></Link>
          <Link to="/reports"><button className="btn">📊 Reports</button></Link>
        </div>
      </div>

      <div className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="chart-card fade-in fade-in--d1">
          <div className="spread">
            <div>
              <h3>Class score trend</h3>
              <p className="muted" style={{ fontSize: 13 }}>Most recent {recent.length} attempts in chronological order.</p>
            </div>
            <span className="tag">avg {avg}% · pass {passRate}%</span>
          </div>
          <div className="mt-12">
            <Sparkline values={recent.length ? recent : [0]} width={680} height={130} />
          </div>
        </div>

        <div className="chart-card fade-in fade-in--d2">
          <div className="spread">
            <div>
              <h3>Class average</h3>
              <p className="muted" style={{ fontSize: 13 }}>Across {attempts.length} attempts.</p>
            </div>
            <Donut value={avg} max={100} color="var(--violet)" />
          </div>
        </div>
      </div>

      <div className="stats mb-24">
        <div className="stat"><div className="stat__icon">📚</div><div className="stat__label">Materials</div><div className="stat__value">{materials.length}</div></div>
        <div className="stat"><div className="stat__icon">📝</div><div className="stat__label">Total attempts</div><div className="stat__value">{attempts.length}</div></div>
        <div className="stat"><div className="stat__icon">👥</div><div className="stat__label">Active students</div><div className="stat__value">{studentCount}</div></div>
        <div className="stat"><div className="stat__icon">🎯</div><div className="stat__label">Pass rate (≥50%)</div><div className="stat__value">{passRate}%</div></div>
      </div>

      <h3 className="section__title">Quick actions</h3>
      <div className="grid mb-24">
        <Link to="/upload" className="card card--feature">
          <div className="card__icon">📄</div>
          <h3>Upload &amp; generate</h3>
          <p>Upload a PDF chapter and auto-generate a quiz with AI or the offline heuristic.</p>
        </Link>
        <Link to="/faculty/blog" className="card card--violet">
          <div className="card__icon">✍️</div>
          <h3>Blog manager</h3>
          <p>Compose articles for your students — cover image, body, tags and optional PDF attachment.</p>
        </Link>
        <Link to="/reports" className="card card--warm">
          <div className="card__icon">📊</div>
          <h3>Performance reports</h3>
          <p>Class average, pass rate, grade-distribution donut and per-student attempt history. CSV export.</p>
        </Link>
        <Link to="/cv" className="card">
          <div className="card__icon">🔬</div>
          <h3>CV image lab</h3>
          <p>Run the radiograph analysis pipeline yourself — useful for demos and class showcases.</p>
        </Link>
        <Link to="/ar" className="card">
          <div className="card__icon">🦷</div>
          <h3>Preview AR models</h3>
          <p>Compare normal anatomy vs pathology side-by-side; check what students see in the AR view.</p>
        </Link>
        <Link to="/guide" className="card">
          <div className="card__icon">❓</div>
          <h3>User guide</h3>
          <p>Walkthrough of every feature with annotated screenshots.</p>
        </Link>
      </div>

      <h3 className="section__title">Recent materials</h3>
      {materials.length ? (
        <table className="table">
          <thead><tr><th>Title</th><th>Uploaded</th><th>By</th><th>Quiz</th></tr></thead>
          <tbody>
            {materials.slice(0, 6).map(m => (
              <tr key={m.id}>
                <td>{m.title}</td>
                <td>{new Date(m.when).toLocaleDateString()}</td>
                <td>{m.by}</td>
                <td>
                  <Link to="/quiz" params={{ material: m.id }}>
                    <button className="btn btn--sm">Preview quiz</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="notice">No materials yet. Upload a PDF to auto-generate your first quiz.</div>
      )}
    </section>
  );
}
