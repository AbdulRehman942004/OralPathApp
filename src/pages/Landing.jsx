import { Link } from "../utils/router.js";
import { TOPICS } from "../data/topics.js";

export default function Landing() {
  return (
    <>
      <section className="container hero">
        <div>
          <span className="tag">Computer Vision · BSCS · Assignment 3</span>
          <h1 className="mt-12">
            Bridge the gap between textbook theory and clinical practice with{" "}
            <span style={{ color: "var(--brand)" }}>OralPath Learn</span>.
          </h1>
          <p>
            An interactive educational application in odontogenic oral pathology.
            Explore 3D anatomy with augmented reality, read concise modules,
            test yourself with generated quizzes, and ask the in-app assistant
            for help — all in your browser.
          </p>
          <div className="hero__cta">
            <Link to="/login"><button className="btn btn--primary">Get started</button></Link>
            <Link to="/ar"><button className="btn">Try the AR viewer</button></Link>
            <Link to="/guide"><button className="btn btn--ghost">User guide</button></Link>
          </div>
        </div>
        <div className="hero__art">
          <model-viewer
            src="./assets/tooth.glb"
            alt="Molar Tooth 3D model"
            camera-controls auto-rotate
            disable-zoom
            style={{ width: "100%", height: 360, background: "transparent" }}
          ></model-viewer>
          <div className="muted center" style={{ marginTop: 8, fontSize: 12 }}>
            Molar Tooth — rotate &amp; explore in the <span className="kbd">AR Viewer</span>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section__title">Built for dental students &amp; faculty</h2>
        <p className="section__sub">Everything you need for a complete learning loop, in one cross-platform app.</p>
        <div className="grid">
          {[
            { i: "📖", t: "Reading modules", d: "Curated notes on the most common odontogenic cysts and tumors." },
            { i: "🦷", t: "3D / AR viewer",  d: "Rotate, zoom and project anatomical models into your space (Android AR)." },
            { i: "📝", t: "Quizzes",          d: "Topic quizzes + a randomised sample quiz with instant feedback." },
            { i: "🤖", t: "Chatbot",          d: "Ask any question; the assistant searches the knowledge base." },
            { i: "📄", t: "PDF → quiz",       d: "Faculty can upload a PDF and auto-generate a quiz to share." },
            { i: "📊", t: "Performance reports", d: "Faculty view class-wide attempts, scores and topic breakdown." }
          ].map((f, i) => (
            <div className="card" key={i}>
              <div className="card__icon">{f.i}</div>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 className="section__title">Topics in this release</h2>
        <p className="section__sub">{TOPICS.length} curated reading modules with linked quizzes and 3D anatomy.</p>
        <div className="grid">
          {TOPICS.map(t => (
            <div className="card" key={t.id}>
              <div className="row">{t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
              <h3>{t.title}</h3>
              <p>{t.summary}</p>
              <div className="card__row">
                <Link to="/reading" params={{ topic: t.id }}>
                  <button className="btn btn--sm">Read</button>
                </Link>
                <Link to="/quiz" params={{ topic: t.id }}>
                  <button className="btn btn--sm btn--primary">Quiz</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
