import { useEffect, useRef, useState } from "react";
import { TOPICS } from "../data/topics.js";
import { askChat, hasApiKey, OpenAIError } from "../utils/openai.js";

// The chatbot has two backends:
//   * OpenAI (gpt-4o-mini) when the user has configured a key in Settings.
//   * A rule-based retrieval fallback over the curated TOPICS otherwise.
// The UI is identical in both cases. The footer chip shows which backend is
// currently active so the user is never surprised.

const corpus = TOPICS.map(t => ({
  id: t.id,
  title: t.title,
  text: [t.title, t.summary, ...t.body].join(" \n").toLowerCase()
}));

const scoreLocal = (q, docText) => {
  const tokens = q.toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3);
  let s = 0;
  for (const t of tokens) {
    if (docText.includes(t)) s += 1 + Math.min(3, (docText.match(new RegExp(t, "g")) || []).length / 4);
  }
  return s;
};

const answerLocal = (q) => {
  const trimmed = q.trim();
  if (!trimmed) return "Ask me about any odontogenic cyst or tumor.";
  const lower = trimmed.toLowerCase();
  if (/\b(hi|hello|hey)\b/.test(lower))
    return "Hi! I'm the OralPath assistant. Try: 'what is an OKC?', 'compare dentigerous cyst vs OKC', 'treatment of ameloblastoma'.";
  if (/\b(thanks|thank you)\b/.test(lower))
    return "You're welcome — good luck with your studies!";
  if (/\b(how to use|help|guide|user guide)\b/.test(lower))
    return "Open the User Guide from the top navigation. It explains login, AR view, quizzes, and faculty PDF upload step by step.";
  if (/\b(ar|augmented reality|3d)\b/.test(lower))
    return "Go to AR → pick a model → use the controls to rotate/zoom. On Android, tap 'View in your space' to place the model in your real environment.";
  if (/\b(quiz|test)\b/.test(lower))
    return "Visit the Quiz page to take a topic-specific or a randomised sample quiz. Your scores are saved on the Results page.";
  if (/\b(login|sign in|register)\b/.test(lower))
    return "Click 'Sign in' in the top right. You can register as a student or faculty member. Sessions are stored locally on your device.";

  const ranked = corpus.map(c => ({ ...c, s: scoreLocal(trimmed, c.text) }))
    .sort((a, b) => b.s - a.s);
  if (ranked[0]?.s >= 2) {
    const top = TOPICS.find(t => t.id === ranked[0].id);
    return `📘 ${top.title}\n${top.summary}\n\nKey points:\n• ${top.body[0]}\n\nOpen the Reading page for the full notes.`;
  }
  return "I couldn't find a confident match. Try keywords like 'dentigerous cyst', 'OKC', 'ameloblastoma', 'odontoma', or 'radicular cyst'.";
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [usingAI, setUsingAI] = useState(hasApiKey());
  const [msgs, setMsgs] = useState([
    { who: "bot", text: "Hi — I'm your OralPath assistant. Ask about any cyst, tumor, or how to use the app." }
  ]);
  const [text, setText] = useState("");
  const bodyRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, open, busy]);

  // Refresh "using AI" status when the panel is opened (user might have set a key in Settings).
  useEffect(() => {
    if (open) setUsingAI(hasApiKey());
  }, [open]);

  const send = async (e) => {
    e?.preventDefault();
    const q = text.trim();
    if (!q || busy) return;
    setMsgs(m => [...m, { who: "user", text: q }]);
    setText("");

    if (!hasApiKey()) {
      setTimeout(() => setMsgs(m => [...m, { who: "bot", text: answerLocal(q) }]), 180);
      return;
    }

    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const reply = await askChat(q, { signal: ac.signal });
      setMsgs(m => [...m, { who: "bot", text: reply }]);
    } catch (err) {
      const friendly = err instanceof OpenAIError
        ? (err.type === "auth"       ? "OpenAI rejected the key (401). Update or remove it in Settings."
         : err.type === "rate_limit" ? "OpenAI rate-limited the request. Try again in a moment."
         : err.type === "network"    ? "Couldn't reach OpenAI. Falling back to the local assistant.\n\n" + answerLocal(q)
         : "OpenAI error: " + err.message + "\n\n" + answerLocal(q))
        : "Unexpected error.\n\n" + answerLocal(q);
      setMsgs(m => [...m, { who: "bot", text: friendly }]);
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  const cancel = () => abortRef.current?.abort();

  return (
    <>
      <button className="chat-fab" aria-label="Open chatbot" onClick={() => setOpen(v => !v)}>
        {open ? "×" : "💬"}
      </button>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="OralPath chatbot">
          <div className="chat-head">
            <div>
              <div style={{ fontWeight: 700 }}>OralPath Assistant</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {usingAI ? "Online · gpt-4o-mini" : "Online · local fallback"}
              </div>
            </div>
            <button className="btn btn--sm" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div ref={bodyRef} className="chat-body">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg--${m.who}`} style={{ whiteSpace: "pre-wrap" }}>
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="chat-msg chat-msg--bot" aria-live="polite">
                <span className="muted">Thinking…</span>
              </div>
            )}
          </div>
          <form className="chat-form" onSubmit={send}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={busy ? "Waiting for response…" : "Ask anything…"}
              aria-label="Type your question"
              disabled={busy}
            />
            {busy ? (
              <button className="btn" type="button" onClick={cancel}>Cancel</button>
            ) : (
              <button className="btn btn--primary" type="submit">Send</button>
            )}
          </form>
        </div>
      )}
    </>
  );
}
