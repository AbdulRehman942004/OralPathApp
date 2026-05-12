import { useState } from "react";
import { askChat, clearApiKey, getApiKey, OpenAIError, setApiKey } from "../utils/openai.js";

export default function Settings() {
  const [key, setKey] = useState(getApiKey());
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { ok, msg }

  const save = (e) => {
    e?.preventDefault();
    if (!key.trim()) return;
    setApiKey(key.trim());
    setSaved(true);
    setTestResult(null);
    setTimeout(() => setSaved(false), 1500);
  };

  const remove = () => {
    if (!confirm("Remove your OpenAI key from this browser?")) return;
    clearApiKey();
    setKey("");
    setTestResult(null);
  };

  const test = async () => {
    if (!getApiKey()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const reply = await askChat("In one sentence, what is a dentigerous cyst?");
      setTestResult({ ok: true, msg: reply });
    } catch (e) {
      const m = e instanceof OpenAIError
        ? (e.type === "auth" ? "Invalid key (401)."
         : e.type === "rate_limit" ? "Rate limit reached (429)."
         : e.message)
        : "Unexpected error.";
      setTestResult({ ok: false, msg: m });
    } finally {
      setTesting(false);
    }
  };

  const masked = (k) => (k && k.length > 12 ? `${k.slice(0, 7)}…${k.slice(-4)}` : k);

  return (
    <section className="container section">
      <h2 className="section__title">Settings</h2>
      <p className="section__sub">
        Configure optional integrations. Keys are stored only in your browser's
        localStorage and are never transmitted except directly to the relevant
        provider.
      </p>

      <div className="card mb-16" style={{ display: "block" }}>
        <div className="row" style={{ gap: 10 }}>
          <span className="card__icon">🤖</span>
          <div>
            <h3 style={{ margin: 0 }}>OpenAI integration</h3>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              Powers the chatbot and the PDF→quiz generator with{" "}
              <span className="kbd">gpt-4o-mini</span>. Without a key, the app
              uses its built-in offline heuristics.
            </p>
          </div>
        </div>

        <form className="form mt-16" onSubmit={save} style={{ maxWidth: 560 }}>
          <div className="field">
            <label>API key</label>
            <div className="row" style={{ gap: 8 }}>
              <input
                type={show ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-..."
                autoComplete="off"
                spellCheck={false}
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn--sm" onClick={() => setShow(s => !s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
            {getApiKey() && !key && (
              <div className="muted" style={{ fontSize: 12 }}>
                Saved key: <span className="kbd">{masked(getApiKey())}</span>
              </div>
            )}
          </div>
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn--primary" type="submit" disabled={!key.trim()}>
              {saved ? "Saved ✓" : "Save key"}
            </button>
            <button className="btn" type="button" onClick={test} disabled={!getApiKey() || testing}>
              {testing ? "Testing…" : "Test connection"}
            </button>
            {getApiKey() && (
              <button className="btn btn--danger" type="button" onClick={remove}>
                Remove key
              </button>
            )}
          </div>
        </form>

        {testResult && (
          <div className={"notice mt-16 " + (testResult.ok ? "" : "notice--warn")}>
            <b>{testResult.ok ? "Connection OK." : "Test failed."}</b>{" "}
            <span style={{ whiteSpace: "pre-wrap" }}>{testResult.msg}</span>
          </div>
        )}

        <div className="notice notice--warn mt-16" style={{ fontSize: 13 }}>
          <b>Security:</b> API keys in browser storage are visible to any script running
          on this origin. This is fine for a single-user demo PWA but is{" "}
          <i>not production-grade</i>. For a real deployment, put the key behind a
          server-side proxy and authenticate users.
        </div>
      </div>

      <div className="card" style={{ display: "block" }}>
        <h3 style={{ marginTop: 0 }}>Where the key is used</h3>
        <ul>
          <li><b>Chatbot</b> — answers any free-form question; falls back to the rule-based assistant if no key.</li>
          <li><b>Faculty PDF→Quiz</b> — produces higher-quality MCQs from uploaded text; the offline heuristic remains available as a fallback.</li>
        </ul>
      </div>
    </section>
  );
}
