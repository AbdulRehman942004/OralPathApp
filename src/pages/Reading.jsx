import { useEffect, useState } from "react";
import { TOPICS } from "../data/topics.js";
import { Link, navigate, useRoute } from "../utils/router.js";
import { getBookmarks, getNotes, setNoteFor, toggleBookmark } from "../utils/storage.js";

export default function Reading({ user }) {
  const { params } = useRoute();
  const startId = params.topic && TOPICS.some(t => t.id === params.topic) ? params.topic : TOPICS[0].id;
  const [active, setActive] = useState(startId);
  const topic = TOPICS.find(t => t.id === active);
  const email = user?.email || "guest@local";
  const [bookmarks, setBookmarks] = useState(getBookmarks(email));
  const [note, setNote] = useState(getNotes(email)[active] || "");

  useEffect(() => {
    setNote(getNotes(email)[active] || "");
  }, [active, email]);

  const saveNote = (v) => {
    setNote(v);
    setNoteFor(email, active, v);
  };

  const onBookmark = () => setBookmarks(toggleBookmark(email, active));

  return (
    <section className="container section">
      <div className="spread mb-16">
        <div>
          <h2 className="section__title">Reading</h2>
          <p className="section__sub">{TOPICS.length} modules · click any topic to read.</p>
        </div>
        <Link to="/quiz" params={{ topic: active }}>
          <button className="btn btn--primary">Quiz on this topic</button>
        </Link>
      </div>

      <div className="reading">
        <div className="reading__toc">
          {TOPICS.map(t => (
            <button
              key={t.id}
              className={t.id === active ? "active" : ""}
              onClick={() => { setActive(t.id); navigate("/reading", { topic: t.id }); }}
            >
              {bookmarks.includes(t.id) ? "★ " : ""}
              {t.title}
            </button>
          ))}
        </div>

        <article className="reading__content">
          <div className="spread">
            <h2>{topic.title}</h2>
            <button className="btn btn--sm" onClick={onBookmark}>
              {bookmarks.includes(topic.id) ? "★ Bookmarked" : "☆ Bookmark"}
            </button>
          </div>
          <div className="row mt-12">{topic.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
          <p className="muted mt-12"><em>{topic.summary}</em></p>
          {topic.body.map((p, i) => <p key={i}>{p}</p>)}

          <h3 className="mt-24">My notes</h3>
          <textarea
            className="field"
            value={note}
            onChange={(e) => saveNote(e.target.value)}
            placeholder="Type your notes here — saved locally as you type."
            style={{ width: "100%", minHeight: 120, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text)", padding: 12, borderRadius: 10, fontFamily: "inherit" }}
          />
        </article>
      </div>
    </section>
  );
}
