import { useEffect, useMemo, useRef, useState } from "react";
import { TOPICS } from "../data/topics.js";
import { Link, navigate, useRoute } from "../utils/router.js";
import { getBookmarks, getNotes, setNoteFor, toggleBookmark } from "../utils/storage.js";

const wordsPerMinute = 220;

export default function Reading({ user }) {
  const { params } = useRoute();
  const startId = params.topic && TOPICS.some(t => t.id === params.topic) ? params.topic : TOPICS[0].id;
  const [active, setActive] = useState(startId);
  const [query, setQuery] = useState("");
  const topic = TOPICS.find(t => t.id === active);
  const email = user?.email || "guest@local";
  const [bookmarks, setBookmarks] = useState(getBookmarks(email));
  const [note, setNote] = useState(getNotes(email)[active] || "");
  const [progress, setProgress] = useState(0);
  const articleRef = useRef(null);

  useEffect(() => {
    setNote(getNotes(email)[active] || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [active, email]);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, total > 0 ? scrolled / total : 0));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  const saveNote = (v) => {
    setNote(v);
    setNoteFor(email, active, v);
  };

  const onBookmark = () => setBookmarks(toggleBookmark(email, active));

  const filteredTopics = useMemo(() => {
    if (!query.trim()) return TOPICS;
    const q = query.toLowerCase();
    return TOPICS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.body.some(p => p.toLowerCase().includes(q))
    );
  }, [query]);

  const wordCount = useMemo(
    () => topic.body.join(" ").split(/\s+/).filter(Boolean).length,
    [topic]
  );
  const readMin = Math.max(1, Math.round(wordCount / wordsPerMinute));

  return (
    <section className="container section fade-in">
      <div
        className="reading__progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
      <div className="spread mb-16">
        <div>
          <span className="hero__chip"><span className="dot" />Reading library</span>
          <h2 className="section__title mt-12">Reading</h2>
          <p className="section__sub">{TOPICS.length} modules · curated from standard oral pathology references.</p>
        </div>
        <Link to="/quiz" params={{ topic: active }}>
          <button className="btn btn--primary">📝 Quiz on this topic</button>
        </Link>
      </div>

      <div className="reading">
        <aside className="reading__toc">
          <div className="field" style={{ marginBottom: 10 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Search topics…"
              style={{ background: "var(--bg-2)" }}
            />
          </div>
          {filteredTopics.map(t => (
            <button
              key={t.id}
              className={t.id === active ? "active" : ""}
              onClick={() => { setActive(t.id); navigate("/reading", { topic: t.id }); }}
            >
              {bookmarks.includes(t.id) && <span className="star">★</span>}
              <span>{t.title}</span>
            </button>
          ))}
          {!filteredTopics.length && (
            <div className="muted center" style={{ padding: 12, fontSize: 13 }}>No matches.</div>
          )}
        </aside>

        <article className="reading__content" ref={articleRef}>
          <div className="spread">
            <div>
              <h2>{topic.title}</h2>
              <div className="row mt-4" style={{ gap: 10, flexWrap: "wrap", fontSize: 12, color: "var(--muted)" }}>
                <span>⏱ ~{readMin} min read</span>
                <span>📝 {wordCount} words</span>
                {topic.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <button className="btn btn--sm" onClick={onBookmark}>
              {bookmarks.includes(topic.id) ? "★ Bookmarked" : "☆ Bookmark"}
            </button>
          </div>
          <p className="muted mt-12" style={{ fontStyle: "italic" }}>{topic.summary}</p>
          {topic.body.map((p, i) => <p key={i}>{p}</p>)}

          <h3 className="mt-24">My notes</h3>
          <textarea
            className="field"
            value={note}
            onChange={(e) => saveNote(e.target.value)}
            placeholder="Type your notes here — saved locally as you type."
            style={{ width: "100%", minHeight: 140, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text)", padding: 14, borderRadius: 12, fontFamily: "inherit", fontSize: 14, lineHeight: 1.6 }}
          />
          <p className="muted mt-8" style={{ fontSize: 12 }}>
            💾 Notes auto-save to your browser and stay private to your device.
          </p>

          <div className="row mt-24" style={{ gap: 10, flexWrap: "wrap" }}>
            <Link to="/quiz" params={{ topic: active }}>
              <button className="btn btn--primary">📝 Quiz on {topic.title}</button>
            </Link>
            <Link to="/ar">
              <button className="btn">🦷 View in 3D / AR</button>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
