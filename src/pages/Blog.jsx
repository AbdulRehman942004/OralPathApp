import { useEffect, useMemo, useState } from "react";
import { getBlogPost, getBlogPosts, incrementBlogView } from "../utils/storage.js";
import { Link, navigate, useRoute } from "../utils/router.js";

// Tiny markdown-ish renderer — just enough for paragraphs, **bold**, *italic*
// and bullet lists. Keeps a sandboxed output (no HTML pass-through).
const renderBody = (text) => {
  if (!text) return null;
  const escape = (s) => s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return blocks.map((b, idx) => {
    if (/^[-•]/.test(b)) {
      const items = b.split(/\n/).map(l => l.replace(/^[-•]\s*/, "")).filter(Boolean);
      return (
        <ul key={idx}>
          {items.map((l, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(escape(l)) }} />
          ))}
        </ul>
      );
    }
    return <p key={idx} dangerouslySetInnerHTML={{ __html: inline(escape(b)) }} />;
  });
};
const inline = (s) =>
  s
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\*([^*]+)\*/g, "<i>$1</i>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br />");

export default function Blog({ user }) {
  const { params } = useRoute();
  const postId = params.post;
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [posts, setPosts] = useState(getBlogPosts());

  useEffect(() => {
    if (postId) {
      incrementBlogView(postId);
      setPosts(getBlogPosts());
    }
  }, [postId]);

  const active = postId ? getBlogPost(postId) : null;
  const allTags = useMemo(() => {
    const set = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return [...set].sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(p => {
      if (tag && !(p.tags || []).includes(tag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, tag]);

  if (active) {
    return (
      <section className="container section fade-in">
        <div className="row mb-12" style={{ gap: 8 }}>
          <button className="btn btn--sm" onClick={() => navigate("/blog")}>← All posts</button>
          {user?.role === "faculty" && (
            <Link to="/faculty/blog"><button className="btn btn--sm">✎ Edit in faculty manager</button></Link>
          )}
        </div>
        <article className="reading__content" style={{ padding: 28 }}>
          {active.coverDataUrl && (
            <img src={active.coverDataUrl} alt=""
                 style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 14, marginBottom: 16 }} />
          )}
          <div className="row" style={{ gap: 6, flexWrap: "wrap", fontSize: 12 }}>
            {(active.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
            {active.pdfName && <span className="tag tag--accent">📄 PDF</span>}
            <span className="muted">· {new Date(active.when).toLocaleString()} · by {active.by} · {active.views || 0} views</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", margin: "12px 0 14px", fontSize: 30 }}>
            {active.title}
          </h2>
          <div style={{ fontSize: 16, lineHeight: 1.75, color: "var(--text-soft)" }}>
            {renderBody(active.body)}
          </div>

          {active.pdfDataUrl && (
            <div className="card mt-24" style={{ display: "block" }}>
              <div className="spread">
                <div>
                  <span className="tag tag--accent">PDF attachment</span>
                  <h3 style={{ margin: "8px 0 0" }}>{active.pdfName}</h3>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <a href={active.pdfDataUrl} download={active.pdfName} className="btn btn--sm">⤓ Download</a>
                  <a href={active.pdfDataUrl} target="_blank" rel="noreferrer" className="btn btn--sm btn--primary">↗ Open</a>
                </div>
              </div>
              <iframe
                src={active.pdfDataUrl}
                title={active.pdfName}
                style={{ width: "100%", height: 600, marginTop: 14, borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-2)" }}
              />
            </div>
          )}
        </article>
      </section>
    );
  }

  return (
    <section className="container section fade-in">
      <div className="spread mb-16">
        <div>
          <span className="hero__chip"><span className="dot" />Articles by your faculty</span>
          <h2 className="section__title mt-12">Resources &amp; blog</h2>
          <p className="section__sub">
            Curated articles written by your teachers. Filter by tag, search the
            body, or download attached PDFs for offline reading.
          </p>
        </div>
        {user?.role === "faculty" && (
          <Link to="/faculty/blog"><button className="btn btn--primary">✎ New post</button></Link>
        )}
      </div>

      <div className="row mb-16" style={{ gap: 10, flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search posts…"
          style={{ flex: 1, minWidth: 220, background: "var(--bg-2)", color: "var(--text)", padding: "10px 12px", borderRadius: 12, border: "1px solid var(--border)" }}
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          style={{ background: "var(--bg-2)", color: "var(--text)", padding: "10px 12px", borderRadius: 12, border: "1px solid var(--border)" }}
        >
          <option value="">All tags</option>
          {allTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="notice">
          {posts.length === 0
            ? "No articles yet. Faculty: open the blog manager to publish your first post."
            : "No posts match the current filter."}
        </div>
      ) : (
        <div className="grid">
          {filtered.map(p => (
            <Link key={p.id} to="/blog" params={{ post: p.id }} className="card" style={{ display: "block", padding: 0, overflow: "hidden" }}>
              {p.coverDataUrl ? (
                <img src={p.coverDataUrl} alt=""
                     style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ height: 160, background: "var(--grad-brand)", display: "grid", placeItems: "center", color: "#06141a", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22 }}>
                  📖 OralPath
                </div>
              )}
              <div style={{ padding: 18 }}>
                <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                  {(p.tags || []).slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                  {p.pdfName && <span className="tag tag--accent">📄 PDF</span>}
                </div>
                <h3 className="mt-8">{p.title}</h3>
                <p className="muted" style={{ fontSize: 12 }}>
                  {new Date(p.when).toLocaleDateString()} · by {p.by} · {p.views || 0} view{p.views === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
