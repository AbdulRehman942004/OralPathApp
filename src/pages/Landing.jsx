import { Link } from "../utils/router.js";
import { TOPICS } from "../data/topics.js";
import { MODELS } from "../data/models.js";

const FEATURES = [
  { i: "🔬", t: "CV image analysis lab",    d: "Upload a radiograph — grayscale, histogram, Sobel edges, Otsu segmentation, plus optional GPT-4o vision interpretation.", k: "feature" },
  { i: "🦷", t: "Interactive 3D & AR",     d: "Rotate, zoom, pan and project NIH anatomical models into your room with ARCore on Android.", k: "violet" },
  { i: "📖", t: "Curated reading modules", d: "Eight expert-summarised topics covering every major odontogenic cyst and tumour.", k: "warm" },
  { i: "🤖", t: "AI tutor chatbot",        d: "gpt-4o-mini powered Q&A on any lesion — with a knowledge-base fallback when offline.", k: "feature" },
  { i: "✍️", t: "Faculty blog & resources", d: "Teachers publish articles with cover images and PDF attachments; students browse, search and download.", k: "violet" },
  { i: "📝", t: "Smart quiz engine",       d: "Topic, mixed, or PDF-generated quizzes with timer, confetti and instant review.", k: "warm" },
  { i: "📄", t: "PDF → quiz in seconds",   d: "Faculty drop a chapter, the app extracts text in-browser and produces editable MCQs.", k: "feature" },
  { i: "📊", t: "Live performance reports", d: "Class average, pass rate, grade-distribution donut and per-student attempt history.", k: "violet" },
  { i: "💡", t: "Prompting drills",         d: "Clinical vignettes with model answers and keyword-overlap scoring for free-text reasoning.", k: "warm" },
  { i: "🏆", t: "Achievements & streaks",   d: "Spaced practice, learning streak ring and 8 unlockable badges keep motivation high.", k: "feature" }
];

const STATS = [
  { n: TOPICS.length,  l: "Reading modules" },
  { n: MODELS.length,  l: "3D anatomical models" },
  { n: "60+",          l: "MCQs in the bank" },
  { n: "PWA",          l: "Installable, offline-capable" }
];

const FAQ = [
  { q: "Do I need to install anything?", a: "No. OralPath Learn is a Progressive Web App. Open the URL in Chrome or Edge — on Android you can tap Install and add it to your home screen." },
  { q: "How does the AR view work?", a: "We use Google's <model-viewer> custom element which projects glTF models via WebXR / ARCore on supported Android devices and Quick Look on iOS." },
  { q: "Where does the AI come from?", a: "The chatbot and PDF→quiz generator call OpenAI gpt-4o-mini directly from your browser if you provide your own key in Settings — otherwise everything falls back to a local heuristic." },
  { q: "Is any patient data stored?", a: "No. The app is fully client-side: attempts, notes and bookmarks live in your browser's localStorage. There's no backend." }
];

export default function Landing() {
  return (
    <>
      <div className="bg-orbs" aria-hidden="true" />

      <section className="container hero">
        <div className="hero__copy fade-in">
          <span className="hero__chip"><span className="dot" />Computer Vision · BSCS · Assignment 3</span>
          <h1>
            Make oral pathology
            <br />
            <span className="grad">click, rotate, and stick.</span>
          </h1>
          <p>
            An interactive educational platform for <b>odontogenic oral pathology</b>:
            8 curated reading modules, photoreal 3D anatomy with augmented-reality projection,
            an AI tutor chatbot, PDF-to-quiz generation and class-wide performance analytics —
            all in one installable web app.
          </p>
          <div className="hero__cta">
            <Link to="/login"><button className="btn btn--primary btn--lg">Get started — it's free</button></Link>
            <Link to="/cv"><button className="btn btn--violet btn--lg">🔬 CV Lab</button></Link>
            <Link to="/ar"><button className="btn btn--lg">Try AR demo →</button></Link>
            <Link to="/guide"><button className="btn btn--ghost btn--lg">User guide</button></Link>
          </div>

          <div className="stats mt-32">
            {STATS.map((s, i) => (
              <div className="stat fade-in fade-in--d2" key={i}>
                <div className="stat__label">{s.l}</div>
                <div className="stat__value">{s.n}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__art fade-in fade-in--d1">
          <div className="hero__art-frame">
            <model-viewer
              src="./assets/Maxillary_teeth_w_base_NIH3D.glb"
              alt="Maxillary dental anatomy 3D model"
              camera-controls auto-rotate
              shadow-intensity="0.9" exposure="1.05"
              environment-image="neutral"
              disable-zoom
              style={{ width: "100%", height: 380, background: "transparent" }}
            ></model-viewer>
          </div>
          <div className="muted center mt-12" style={{ fontSize: 12 }}>
            Live preview · maxillary arch — interact with the model above
          </div>
        </div>
      </section>

      <div className="container marquee">
        <div className="marquee__track">
          <span>🦷 Dentigerous cyst</span>
          <span>· OKC (Gorlin syndrome)</span>
          <span>· Ameloblastoma</span>
          <span>· Odontoma · compound &amp; complex</span>
          <span>· Radicular cyst</span>
          <span>· CEOT (Pindborg)</span>
          <span>· Cone-Beam CT correlation</span>
          <span>· Augmented reality with ARCore</span>
          <span>· OpenAI gpt-4o-mini integration</span>
          <span>· Faculty PDF → quiz auto-generation</span>
          <span>🦷 Dentigerous cyst</span>
          <span>· OKC (Gorlin syndrome)</span>
          <span>· Ameloblastoma</span>
          <span>· Odontoma · compound &amp; complex</span>
          <span>· Radicular cyst</span>
          <span>· CEOT (Pindborg)</span>
          <span>· Cone-Beam CT correlation</span>
          <span>· Augmented reality with ARCore</span>
          <span>· OpenAI gpt-4o-mini integration</span>
          <span>· Faculty PDF → quiz auto-generation</span>
        </div>
      </div>

      <section className="container section">
        <h2 className="section__title">Everything a dental learner needs — in one app</h2>
        <p className="section__sub">
          A complete learning loop: read · visualise · practise · assess · iterate.
        </p>
        <div className="grid">
          {FEATURES.map((f, i) => (
            <div className={`card card--${f.k} fade-in`} style={{ animationDelay: `${i * 0.04}s` }} key={i}>
              <div className="card__icon">{f.i}</div>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="spread mb-16">
          <div>
            <h2 className="section__title">Topics in this release</h2>
            <p className="section__sub">
              {TOPICS.length} curated reading modules · linked quizzes · cross-referenced 3D anatomy.
            </p>
          </div>
          <Link to="/reading"><button className="btn">Browse all modules →</button></Link>
        </div>
        <div className="grid">
          {TOPICS.map(t => (
            <div className="card" key={t.id}>
              <div className="row row--wrap">{t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
              <h3>{t.title}</h3>
              <p>{t.summary}</p>
              <div className="card__row">
                <Link to="/reading" params={{ topic: t.id }}>
                  <button className="btn btn--sm">📖 Read</button>
                </Link>
                <Link to="/quiz" params={{ topic: t.id }}>
                  <button className="btn btn--sm btn--primary">📝 Quiz</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 className="section__title">Built on a modern, fully client-side stack</h2>
        <p className="section__sub">No backend, no telemetry, no patient data — everything runs in your browser.</p>
        <div className="grid">
          {[
            { i: "⚛️", t: "React 18",          d: "Hash-based router, tiny custom build with esbuild." },
            { i: "🧊", t: "glTF + model-viewer", d: "Google's <model-viewer> custom element for 3D + WebXR/ARCore AR." },
            { i: "📄", t: "pdf.js",            d: "Mozilla's PDF library extracts text from uploaded chapters in the browser." },
            { i: "🤖", t: "OpenAI API",        d: "gpt-4o-mini powers the chatbot and quiz generation when a key is configured." },
            { i: "💾", t: "localStorage",      d: "Notes, bookmarks, attempts and settings all persist on-device." },
            { i: "📱", t: "PWA + Service Worker", d: "Installable from Chrome; works offline once visited." }
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
        <h2 className="section__title">Frequently asked</h2>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))" }}>
          {FAQ.map((f, i) => (
            <div className="card" key={i}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section center">
        <div className="card" style={{ display: "block", padding: 36, background: "var(--grad-glass)" }}>
          <span className="tag tag--violet">Ready when you are</span>
          <h2 className="section__title mt-12" style={{ fontSize: 30 }}>
            Sign in, take a quiz, and impress your faculty.
          </h2>
          <p className="muted" style={{ maxWidth: 560, margin: "8px auto 24px" }}>
            Demo credentials work — any email and password. Try the AR demo first if you'd rather kick the tyres.
          </p>
          <div className="row" style={{ justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <Link to="/login"><button className="btn btn--primary btn--lg">Sign in or register</button></Link>
            <Link to="/ar"><button className="btn btn--lg">Open AR viewer</button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
