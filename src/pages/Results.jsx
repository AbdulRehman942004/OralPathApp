import { attemptsFor } from "../utils/storage.js";
import { Link } from "../utils/router.js";

export default function Results({ user }) {
  const attempts = attemptsFor(user.email);
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

  return (
    <section className="container section">
      <h2 className="section__title">My results</h2>
      <p className="section__sub">{attempts.length} attempts across {Object.keys(byQuiz).length} quizzes.</p>

      <div className="stats mb-24">
        <div className="stat">
          <div className="stat__label">Best score</div>
          <div className="stat__value">{Math.max(...attempts.map(a => a.percent))}%</div>
        </div>
        <div className="stat">
          <div className="stat__label">Average score</div>
          <div className="stat__value">
            {Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length)}%
          </div>
        </div>
        <div className="stat">
          <div className="stat__label">Total attempts</div>
          <div className="stat__value">{attempts.length}</div>
        </div>
      </div>

      <h3 className="section__title">Performance by quiz</h3>
      <div className="bars mb-24">
        {Object.entries(byQuiz).map(([title, list]) => {
          const avg = Math.round(list.reduce((s, a) => s + a.percent, 0) / list.length);
          return (
            <div className="bar" key={title}>
              <div style={{ fontSize: 13 }}>{title}</div>
              <div className="bar__track"><div className="bar__fill" style={{ width: `${avg}%` }} /></div>
              <div className="bar__val">{avg}%</div>
            </div>
          );
        })}
      </div>

      <h3 className="section__title">All attempts</h3>
      <table className="table">
        <thead>
          <tr><th>When</th><th>Quiz</th><th>Score</th><th>%</th></tr>
        </thead>
        <tbody>
          {attempts.map(a => (
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
    </section>
  );
}
