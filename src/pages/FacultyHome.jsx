import { Link } from "../utils/router.js";
import { getAttempts, getMaterials } from "../utils/storage.js";

export default function FacultyHome({ user }) {
  const materials = getMaterials();
  const attempts = getAttempts();
  const studentCount = new Set(attempts.filter(a => a.role === "student").map(a => a.userEmail)).size;
  const avg = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length)
    : 0;

  return (
    <section className="container section">
      <div className="spread mb-16">
        <div>
          <h2 className="section__title">Welcome, Dr. {user.name?.split(" ").slice(-1)[0] || "Faculty"} 👋</h2>
          <p className="section__sub">Manage materials, generate quizzes from PDFs, and review class performance.</p>
        </div>
        <Link to="/upload"><button className="btn btn--primary">Upload PDF &amp; generate quiz</button></Link>
      </div>

      <div className="stats mb-24">
        <div className="stat"><div className="stat__label">Materials</div><div className="stat__value">{materials.length}</div></div>
        <div className="stat"><div className="stat__label">Total attempts</div><div className="stat__value">{attempts.length}</div></div>
        <div className="stat"><div className="stat__label">Active students</div><div className="stat__value">{studentCount}</div></div>
        <div className="stat"><div className="stat__label">Class average</div><div className="stat__value">{avg}%</div></div>
      </div>

      <h3 className="section__title">Quick actions</h3>
      <div className="grid mb-24">
        <Link to="/upload" className="card">
          <div className="card__icon">📄</div>
          <h3>Upload &amp; generate</h3>
          <p>Upload a PDF chapter and auto-generate a quiz from its content.</p>
        </Link>
        <Link to="/reports" className="card">
          <div className="card__icon">📊</div>
          <h3>Performance reports</h3>
          <p>See per-quiz, per-topic averages and per-student attempt history.</p>
        </Link>
        <Link to="/ar" className="card">
          <div className="card__icon">🦷</div>
          <h3>Preview AR models</h3>
          <p>Check the 3D content available to students.</p>
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
