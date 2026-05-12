import { Link } from "../utils/router.js";

const Step = ({ title, children }) => (
  <div className="card mb-12" style={{ display: "block" }}>
    <h3 style={{ margin: 0 }}>{title}</h3>
    <div className="mt-12">{children}</div>
  </div>
);

const Shot = ({ src, caption }) => (
  <figure style={{ margin: "10px 0 0" }}>
    <img
      src={src}
      alt={caption}
      loading="lazy"
      style={{
        width: "100%", maxHeight: 520, objectFit: "contain", objectPosition: "top",
        border: "1px solid var(--border)", borderRadius: 12,
        background: "var(--bg-2)", display: "block"
      }}
    />
    <figcaption className="muted" style={{ fontSize: 12, marginTop: 6, textAlign: "center" }}>
      {caption}
    </figcaption>
  </figure>
);

export default function UserGuide() {
  return (
    <section className="container section">
      <h2 className="section__title">User guide</h2>
      <p className="section__sub">
        End-to-end walkthrough of every feature, for both student and faculty roles.
        All screenshots are real captures from this build, located in{" "}
        <span className="kbd">/screenshots</span>.
      </p>

      <div className="grid mb-24" style={{ gridTemplateColumns: "1fr" }}>
        <Step title="1 · Open the app & install (PWA)">
          <p className="muted">
            Open the deployed URL in Chrome on Android or Edge/Chrome on desktop. Tap the
            <span className="kbd"> Install </span> prompt in the address bar to add the app to your home screen.
          </p>
          <Shot src="./screenshots/landing.png" caption="Landing page — the launch point for install" />
        </Step>

        <Step title="2 · Sign in or register">
          <p className="muted">
            On the <Link to="/login">Sign in</Link> page, choose <b>Student</b> or <b>Faculty</b>.
            New users click <b>Create an account</b> and fill name + email + password.
            Credentials are stored locally for this demo.
          </p>
          <Shot src="./screenshots/login.png" caption="Login screen with role tabs (Student / Faculty)" />
        </Step>

        <Step title="3 · Student — read a topic">
          <p className="muted">
            From the dashboard, open <Link to="/reading">Reading</Link>. Pick a topic from the left list,
            highlight key passages, and use the bookmark / notes panel to keep your study notes per topic.
          </p>
          <Shot src="./screenshots/reading.png" caption="Reading view — left TOC, full content, bookmark + notes" />
        </Step>

        <Step title="4 · Student — explore 3D and AR">
          <p className="muted">
            Open <Link to="/ar">AR</Link>, pick a model, then rotate / zoom with your mouse or finger.
            On a supported Android device, tap <b>View in your space</b> to project the model into your environment.
          </p>
          <Shot src="./screenshots/ar.png" caption="3D viewer with model selector and AR launcher" />
        </Step>

        <Step title="5 · Student — take a quiz">
          <p className="muted">
            Go to <Link to="/quiz">Quiz</Link>. Pick a topic-specific quiz or the sample (mixed) quiz.
            Choose one answer per question and click <b>Submit</b> on the last question to see your score
            and a question-by-question review with explanations.
          </p>
          <Shot src="./screenshots/quiz.png" caption="Quiz question with progress bar and four options" />
        </Step>

        <Step title="6 · Student — prompting drill">
          <p className="muted">
            On <Link to="/prompting">Prompting</Link>, type your differential for each clinical vignette,
            then reveal the model answer. A heuristic 'overlap' score nudges you to include the key terms.
          </p>
          <Shot src="./screenshots/prompting.png" caption="Prompting drill — clinical vignette, answer box, reveal" />
        </Step>

        <Step title="7 · Student — track results">
          <p className="muted">
            <Link to="/results">My Results</Link> shows your average, best score, per-quiz performance bars
            and full attempt history.
          </p>
          <Shot src="./screenshots/results.png" caption="My results — best/average score, per-quiz bars, attempt history" />
        </Step>

        <Step title="8 · Faculty — upload a PDF and generate a quiz">
          <p className="muted">
            From the faculty dashboard, open <Link to="/upload">Upload &amp; Generate</Link>.
            Drop a PDF chapter; the app extracts text in the browser and proposes 8–10 cloze-style MCQs.
            Edit the title and click <b>Save &amp; publish</b> to make it available to students.
          </p>
          <Shot src="./screenshots/faculty-upload.png" caption="Faculty upload — drag-and-drop a PDF, get a generated draft quiz" />
        </Step>

        <Step title="9 · Faculty — read performance reports">
          <p className="muted">
            <Link to="/reports">Reports</Link> aggregates every quiz attempt: total attempts, unique students,
            class average, pass rate, average per quiz, and a filter by individual student.
          </p>
          <Shot src="./screenshots/faculty-reports.png" caption="Faculty reports — class average, pass rate, per-quiz bars, all attempts" />
        </Step>

        <Step title="10 · Chatbot — get help any time">
          <p className="muted">
            Click the green chat bubble (bottom-right) on any screen. Ask things like
            "what is a dentigerous cyst?" or "how do I use AR?".
            The assistant searches the knowledge base and links you to the relevant module.
          </p>
          <Shot src="./screenshots/student-home.png" caption="The chat bubble (bottom-right) is available on every screen" />
        </Step>
      </div>

      <h3 className="section__title">Re-capturing screenshots</h3>
      <ol className="steps">
        <li>Start the server: <span className="kbd">npm start</span></li>
        <li>From the project root: <span className="kbd">node screenshot.mjs</span></li>
        <li>All 12 screens are written into the <span className="kbd">screenshots/</span> folder.</li>
        <li>To regenerate the research report after new screenshots: <span className="kbd">python3 report/build_report.py</span></li>
      </ol>
    </section>
  );
}
