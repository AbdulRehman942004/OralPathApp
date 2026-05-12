import { useEffect, useMemo, useState } from "react";
import { TOPICS } from "../data/topics.js";
import { quizForTopic, sampleQuiz } from "../data/quizzes.js";
import { getMaterials, saveAttempt } from "../utils/storage.js";
import { Link, navigate, useRoute } from "../utils/router.js";

export default function Quiz({ user }) {
  const { params } = useRoute();
  const facultyQuizId = params.material; // optional faculty-generated quiz id
  const topicId = params.topic;

  const quiz = useMemo(() => {
    if (facultyQuizId) {
      const mat = getMaterials().find(m => m.id === facultyQuizId);
      if (mat?.generatedQuiz?.length) {
        return { title: mat.title || "Generated quiz", questions: mat.generatedQuiz };
      }
    }
    if (topicId) {
      const t = quizForTopic(topicId);
      if (t) return t;
    }
    return { title: "Sample Quiz — Mixed Topics", questions: sampleQuiz(10) };
  }, [topicId, facultyQuizId]);

  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => { setI(0); setAnswers({}); setDone(false); }, [quiz.title]);

  if (!quiz.questions.length) {
    return (
      <section className="container section">
        <div className="notice notice--warn">No questions found for this quiz.</div>
        <Link to="/quiz"><button className="btn mt-12">Take sample quiz</button></Link>
      </section>
    );
  }

  const q = quiz.questions[i];
  const picked = answers[q.qid ?? i];
  const next = () => setI(Math.min(i + 1, quiz.questions.length - 1));
  const prev = () => setI(Math.max(i - 1, 0));
  const choose = (idx) => setAnswers({ ...answers, [q.qid ?? i]: idx });

  const submit = () => {
    let score = 0;
    quiz.questions.forEach((qq, idx) => {
      if (answers[qq.qid ?? idx] === qq.a) score++;
    });
    const percent = Math.round((score / quiz.questions.length) * 100);
    const attempt = {
      userEmail: user?.email || "guest@local",
      userName: user?.name || "Guest",
      role: user?.role || "guest",
      quizId: topicId || (facultyQuizId ? `material:${facultyQuizId}` : "sample"),
      title: quiz.title,
      score,
      total: quiz.questions.length,
      percent,
      when: new Date().toISOString(),
      answers
    };
    saveAttempt(attempt);
    setDone(attempt);
  };

  if (done) {
    return (
      <section className="container section">
        <div className="quiz">
          <h2 style={{ marginTop: 0 }}>Result · {quiz.title}</h2>
          <div className="stats">
            <div className="stat"><div className="stat__label">Score</div><div className="stat__value">{done.score}/{done.total}</div></div>
            <div className="stat"><div className="stat__label">Percentage</div><div className="stat__value">{done.percent}%</div></div>
            <div className="stat"><div className="stat__label">When</div><div className="stat__value" style={{ fontSize: 16 }}>{new Date(done.when).toLocaleString()}</div></div>
          </div>

          <h3 className="mt-24">Review</h3>
          {quiz.questions.map((qq, idx) => {
            const userIdx = answers[qq.qid ?? idx];
            const correct = userIdx === qq.a;
            return (
              <div key={qq.qid ?? idx} className="card mb-12" style={{ display: "block" }}>
                <div className="row" style={{ gap: 8 }}>
                  <span className="tag">Q{idx + 1}</span>
                  <span className={"tag " + (correct ? "" : "tag--danger")}>{correct ? "Correct" : "Incorrect"}</span>
                </div>
                <p className="mt-12" style={{ color: "var(--text)" }}><b>{qq.q}</b></p>
                <ul className="list" style={{ gap: 6 }}>
                  {qq.opts.map((o, j) => (
                    <li className={
                      "list__item " +
                      (j === qq.a ? "" : (j === userIdx ? "" : ""))
                    } style={{
                      borderColor: j === qq.a ? "rgba(42,157,143,0.6)" :
                                   (j === userIdx ? "rgba(230,57,70,0.6)" : "var(--border)"),
                      background: j === qq.a ? "rgba(42,157,143,0.08)" :
                                  (j === userIdx && userIdx !== qq.a ? "rgba(230,57,70,0.08)" : "var(--panel)")
                    }}>
                      <span>{String.fromCharCode(65 + j)}. {o}</span>
                      {j === qq.a && <span className="tag">Correct</span>}
                      {j === userIdx && userIdx !== qq.a && <span className="tag tag--danger">Your choice</span>}
                    </li>
                  ))}
                </ul>
                {qq.explain && <p className="muted mt-12"><b>Explanation: </b>{qq.explain}</p>}
              </div>
            );
          })}

          <div className="row mt-16" style={{ gap: 10 }}>
            <button className="btn btn--primary" onClick={() => navigate("/results")}>View all results</button>
            <button className="btn" onClick={() => { setI(0); setAnswers({}); setDone(false); }}>Retake</button>
            <Link to="/student"><button className="btn btn--ghost">Back to dashboard</button></Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container section">
      <div className="spread mb-12">
        <div>
          <h2 className="section__title">{quiz.title}</h2>
          <p className="section__sub">Question {i + 1} of {quiz.questions.length}</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {!topicId && !facultyQuizId && (
            <select
              className="field"
              value=""
              onChange={(e) => e.target.value && navigate("/quiz", { topic: e.target.value })}
              style={{ background: "var(--bg-2)", color: "var(--text)", padding: "8px 10px", borderRadius: 10, border: "1px solid var(--border)" }}
            >
              <option value="">Jump to topic quiz…</option>
              {TOPICS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          )}
        </div>
      </div>

      <div className="quiz">
        <div className="quiz__progress">
          <span style={{ width: `${((i + 1) / quiz.questions.length) * 100}%` }}></span>
        </div>

        <p className="quiz__q">{q.q}</p>
        {q.opts.map((o, j) => (
          <label key={j} className="quiz__opt">
            <input type="radio" name={`q-${i}`} checked={picked === j} onChange={() => choose(j)} />
            <span><b>{String.fromCharCode(65 + j)}.</b> {o}</span>
          </label>
        ))}

        <div className="quiz__nav">
          <button className="btn" disabled={i === 0} onClick={prev}>Previous</button>
          {i < quiz.questions.length - 1 ? (
            <button className="btn btn--primary" disabled={picked == null} onClick={next}>Next</button>
          ) : (
            <button className="btn btn--primary" disabled={picked == null} onClick={submit}>Submit</button>
          )}
        </div>
      </div>
    </section>
  );
}
