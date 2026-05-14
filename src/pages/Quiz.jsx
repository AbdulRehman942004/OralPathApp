import { useEffect, useMemo, useRef, useState } from "react";
import { TOPICS } from "../data/topics.js";
import { quizForTopic, sampleQuiz } from "../data/quizzes.js";
import { getMaterials, saveAttempt } from "../utils/storage.js";
import { Link, navigate, useRoute } from "../utils/router.js";
import { Donut } from "../components/Charts.jsx";
import { burstConfetti } from "../utils/confetti.js";

const SECONDS_PER_Q = 45;

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
  const [secondsLeft, setSecondsLeft] = useState(quiz.questions.length * SECONDS_PER_Q);
  const [started] = useState(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    setI(0); setAnswers({}); setDone(false);
    setSecondsLeft(quiz.questions.length * SECONDS_PER_Q);
  }, [quiz.title]);

  useEffect(() => {
    if (done) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(timerRef.current); submit(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, quiz.title]);

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
  const answeredCount = quiz.questions.filter((qq, idx) => answers[qq.qid ?? idx] != null).length;
  const allAnswered = answeredCount === quiz.questions.length;

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
      timeSec: Math.round((Date.now() - started) / 1000),
      when: new Date().toISOString(),
      answers
    };
    saveAttempt(attempt);
    setDone(attempt);
    clearInterval(timerRef.current);
    if (percent >= 70) burstConfetti(percent >= 90 ? 140 : 90);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const timerCls =
    secondsLeft < 30 ? "quiz__timer quiz__timer--danger" :
    secondsLeft < 60 ? "quiz__timer quiz__timer--warn" :
    "quiz__timer";

  if (done) {
    const verdict =
      done.percent >= 90 ? { tag: "Excellent", color: "var(--success)", msg: "Outstanding — you're ready for clinical scenarios." } :
      done.percent >= 70 ? { tag: "Great work", color: "var(--brand)",   msg: "Solid grasp of the material — review the missed items below." } :
      done.percent >= 50 ? { tag: "Keep going", color: "var(--warn)",    msg: "Foundation is there — re-read the topic and try again." } :
                           { tag: "Needs work",  color: "var(--danger)",  msg: "Start with the Reading module then retake the quiz." };
    return (
      <section className="container section fade-in">
        <div className="quiz">
          <div className="spread">
            <div>
              <span className="tag" style={{ background: "rgba(155,123,255,0.13)", color: "var(--violet)", borderColor: "rgba(155,123,255,0.28)" }}>
                {verdict.tag}
              </span>
              <h2 style={{ marginTop: 8, marginBottom: 0 }}>{quiz.title} · result</h2>
              <p className="muted mt-4">{verdict.msg}</p>
            </div>
            <Donut value={done.percent} max={100} color={verdict.color} size={130} />
          </div>

          <div className="stats mt-24">
            <div className="stat"><div className="stat__label">Score</div><div className="stat__value">{done.score}/{done.total}</div></div>
            <div className="stat"><div className="stat__label">Percentage</div><div className="stat__value">{done.percent}%</div></div>
            <div className="stat"><div className="stat__label">Time</div><div className="stat__value" style={{ fontSize: 22 }}>{Math.floor(done.timeSec/60)}m {done.timeSec%60}s</div></div>
            <div className="stat"><div className="stat__label">When</div><div className="stat__value" style={{ fontSize: 16 }}>{new Date(done.when).toLocaleString()}</div></div>
          </div>

          <h3 className="mt-24">Question-by-question review</h3>
          {quiz.questions.map((qq, idx) => {
            const userIdx = answers[qq.qid ?? idx];
            const correct = userIdx === qq.a;
            return (
              <div key={qq.qid ?? idx} className="card mb-12" style={{ display: "block" }}>
                <div className="row" style={{ gap: 8 }}>
                  <span className="tag">Q{idx + 1}</span>
                  <span className={"tag " + (correct ? "" : "tag--danger")}>{correct ? "✓ Correct" : "✗ Incorrect"}</span>
                </div>
                <p className="mt-12" style={{ color: "var(--text)" }}><b>{qq.q}</b></p>
                <ul className="list" style={{ gap: 6 }}>
                  {qq.opts.map((o, j) => (
                    <li className="list__item" key={j}
                        style={{
                          borderColor: j === qq.a ? "rgba(42,210,156,0.55)" :
                                       (j === userIdx ? "rgba(255,93,108,0.55)" : "var(--border)"),
                          background: j === qq.a ? "rgba(42,210,156,0.08)" :
                                      (j === userIdx && userIdx !== qq.a ? "rgba(255,93,108,0.08)" : "var(--panel)")
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

          <div className="row mt-16" style={{ gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn--primary" onClick={() => navigate("/results")}>📊 View all results</button>
            <button className="btn" onClick={() => { setI(0); setAnswers({}); setDone(false); setSecondsLeft(quiz.questions.length * SECONDS_PER_Q); }}>↻ Retake</button>
            <Link to={user?.role === "faculty" ? "/faculty" : "/student"}><button className="btn btn--ghost">Back to dashboard</button></Link>
          </div>
        </div>
      </section>
    );
  }

  const progressPct = ((i + 1) / quiz.questions.length) * 100;

  return (
    <section className="container section fade-in">
      <div className="spread mb-12">
        <div>
          <span className="tag tag--violet">{topicId ? "Topic quiz" : facultyQuizId ? "Faculty quiz" : "Mixed practice"}</span>
          <h2 className="section__title mt-8" style={{ marginBottom: 4 }}>{quiz.title}</h2>
          <p className="section__sub" style={{ marginBottom: 0 }}>
            Question <b>{i + 1}</b> of {quiz.questions.length} · {answeredCount} answered
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {!topicId && !facultyQuizId && (
            <select
              className="field"
              value=""
              onChange={(e) => e.target.value && navigate("/quiz", { topic: e.target.value })}
              style={{ background: "var(--bg-2)", color: "var(--text)", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)" }}
            >
              <option value="">Jump to topic quiz…</option>
              {TOPICS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          )}
        </div>
      </div>

      <div className="quiz">
        <div className={timerCls} aria-label="Time remaining">⏱ {mm}:{ss}</div>
        <div className="quiz__progress" aria-label="Progress">
          <span style={{ width: `${progressPct}%` }}></span>
        </div>

        <p className="quiz__q">{q.q}</p>
        {q.opts.map((o, j) => (
          <label key={j} className={"quiz__opt" + (picked === j ? " quiz__opt--selected" : "")}>
            <input type="radio" name={`q-${i}`} checked={picked === j} onChange={() => choose(j)} />
            <span><b>{String.fromCharCode(65 + j)}.</b> {o}</span>
          </label>
        ))}

        <div className="quiz__nav">
          <button className="btn" disabled={i === 0} onClick={prev}>← Previous</button>
          {i < quiz.questions.length - 1 ? (
            <button className="btn btn--primary" disabled={picked == null} onClick={next}>Next →</button>
          ) : (
            <button className="btn btn--primary" disabled={!allAnswered} onClick={submit}>✓ Submit</button>
          )}
        </div>
      </div>

      <div className="row mt-16" style={{ gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {quiz.questions.map((qq, idx) => (
          <button
            key={idx}
            className="btn btn--sm"
            style={{
              minWidth: 36,
              background: idx === i ? "var(--grad-brand)" :
                          (answers[qq.qid ?? idx] != null ? "rgba(25,211,197,0.13)" : "var(--panel)"),
              color: idx === i ? "#06141a" : "var(--text)",
              borderColor: idx === i ? "transparent" : "var(--border)"
            }}
            onClick={() => setI(idx)}
            aria-label={`Go to question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
