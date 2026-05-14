import { useRef, useState } from "react";
import {
  getBlogPosts, removeBlogPost, saveBlogPost
} from "../utils/storage.js";
import { Link } from "../utils/router.js";

const blank = () => ({
  id: null, title: "", body: "", tags: "", coverDataUrl: "", pdfDataUrl: "", pdfName: ""
});

const readFile = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = (e) => res(e.target.result);
  r.onerror = rej;
  r.readAsDataURL(file);
});

export default function FacultyBlog({ user }) {
  const [list, setList] = useState(getBlogPosts());
  const [draft, setDraft] = useState(blank());
  const [savedTick, setSavedTick] = useState(false);
  const [err, setErr] = useState("");
  const coverRef = useRef(null);
  const pdfRef   = useRef(null);

  const onCover = async (f) => {
    setErr("");
    if (!f) return;
    if (f.size > 2.5 * 1024 * 1024) { setErr("Cover image must be under 2.5 MB."); return; }
    setDraft(d => ({ ...d, coverDataUrl: "" }));
    try { const url = await readFile(f); setDraft(d => ({ ...d, coverDataUrl: url })); }
    catch { setErr("Could not read the cover image."); }
  };

  const onPdf = async (f) => {
    setErr("");
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setErr("Attachment must be a PDF file."); return;
    }
    if (f.size > 6 * 1024 * 1024) {
      setErr("PDF must be under 6 MB (browser storage limit)."); return;
    }
    try {
      const url = await readFile(f);
      setDraft(d => ({ ...d, pdfDataUrl: url, pdfName: f.name }));
    } catch { setErr("Could not read the PDF."); }
  };

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!draft.title.trim() || !draft.body.trim()) {
      setErr("Title and body are required."); return;
    }
    const saved = saveBlogPost({
      id: draft.id || null,
      title: draft.title.trim(),
      body: draft.body,
      tags: draft.tags.split(",").map(t => t.trim()).filter(Boolean),
      coverDataUrl: draft.coverDataUrl || "",
      pdfDataUrl: draft.pdfDataUrl || "",
      pdfName: draft.pdfName || "",
      by: user.name || user.email,
      byEmail: user.email
    });
    setList(getBlogPosts());
    setDraft(blank());
    if (coverRef.current) coverRef.current.value = "";
    if (pdfRef.current)   pdfRef.current.value   = "";
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 1500);
  };

  const edit = (p) => {
    setDraft({
      id: p.id, title: p.title, body: p.body,
      tags: (p.tags || []).join(", "),
      coverDataUrl: p.coverDataUrl || "",
      pdfDataUrl: p.pdfDataUrl || "",
      pdfName: p.pdfName || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = (id) => {
    if (!confirm("Delete this blog post?")) return;
    removeBlogPost(id);
    setList(getBlogPosts());
  };

  const reset = () => {
    setDraft(blank());
    if (coverRef.current) coverRef.current.value = "";
    if (pdfRef.current)   pdfRef.current.value   = "";
  };

  return (
    <section className="container section fade-in">
      <div className="spread mb-16">
        <div>
          <span className="hero__chip"><span className="dot" />Faculty content manager</span>
          <h2 className="section__title mt-12">Blog &amp; teaching resources</h2>
          <p className="section__sub">
            Publish articles for your students. Each post can carry a cover image, free-text body
            (Markdown-friendly), tags and an optional PDF attachment they can read in-browser.
          </p>
        </div>
        <Link to="/blog"><button className="btn">👁️ View as student</button></Link>
      </div>

      <form className="card mb-24" style={{ display: "block", padding: 22 }} onSubmit={submit}>
        <div className="spread">
          <h3 style={{ marginTop: 0 }}>
            {draft.id ? "Edit post" : "Compose a new post"}
            {savedTick && <span className="tag tag--violet" style={{ marginLeft: 10 }}>Saved ✓</span>}
          </h3>
          {draft.id && <button type="button" className="btn btn--sm" onClick={reset}>Clear</button>}
        </div>

        <div className="grid mt-16" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
          <div className="field">
            <label>Title</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
              placeholder="e.g. Differential diagnosis of multilocular radiolucencies"
            />
          </div>
          <div className="field">
            <label>Tags (comma separated)</label>
            <input
              value={draft.tags}
              onChange={(e) => setDraft(d => ({ ...d, tags: e.target.value }))}
              placeholder="OKC, ameloblastoma, OPG"
            />
          </div>
        </div>

        <div className="field mt-12">
          <label>Body</label>
          <textarea
            value={draft.body}
            onChange={(e) => setDraft(d => ({ ...d, body: e.target.value }))}
            placeholder={`Write your article here.\n\nMarkdown-light: use **bold**, *italic*, double newlines to start a new paragraph,\nand • or - to bullet a list.`}
            style={{ minHeight: 220 }}
          />
        </div>

        <div className="grid mt-12" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field">
            <label>Cover image (optional · ≤2.5 MB)</label>
            <input ref={coverRef} type="file" accept="image/*" onChange={(e) => onCover(e.target.files?.[0])} />
            {draft.coverDataUrl && (
              <img src={draft.coverDataUrl} alt="cover preview"
                   style={{ marginTop: 8, maxHeight: 130, borderRadius: 10, border: "1px solid var(--border)" }} />
            )}
          </div>
          <div className="field">
            <label>PDF attachment (optional · ≤6 MB)</label>
            <input ref={pdfRef} type="file" accept="application/pdf" onChange={(e) => onPdf(e.target.files?.[0])} />
            {draft.pdfName && (
              <div className="row mt-8" style={{ gap: 8 }}>
                <span className="tag">📄 {draft.pdfName}</span>
                <button type="button" className="btn btn--sm btn--danger"
                        onClick={() => setDraft(d => ({ ...d, pdfDataUrl: "", pdfName: "" }))}>
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {err && <div className="notice notice--warn mt-16">{err}</div>}

        <div className="row mt-16" style={{ gap: 10 }}>
          <button className="btn btn--primary" type="submit">
            {draft.id ? "💾 Save changes" : "📨 Publish post"}
          </button>
          <button className="btn" type="button" onClick={reset}>Reset form</button>
          {draft.coverDataUrl || draft.pdfDataUrl
            ? <span className="muted" style={{ fontSize: 12 }}>Attachments are stored in localStorage on this device.</span>
            : null}
        </div>
      </form>

      <div className="spread mb-12">
        <h3 className="section__title" style={{ margin: 0 }}>Published posts ({list.length})</h3>
        <Link to="/blog"><button className="btn btn--sm">Open student blog →</button></Link>
      </div>

      {list.length === 0 ? (
        <div className="notice">No posts yet — write your first article above.</div>
      ) : (
        <div className="grid">
          {list.map(p => (
            <div className="card" key={p.id} style={{ display: "block" }}>
              {p.coverDataUrl && (
                <img src={p.coverDataUrl} alt="" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 12, marginBottom: 10 }} />
              )}
              <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                {(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                {p.pdfName && <span className="tag tag--accent">📄 PDF</span>}
              </div>
              <h3 className="mt-8">{p.title}</h3>
              <p className="muted" style={{ fontSize: 12 }}>
                {new Date(p.when).toLocaleString()} · by {p.by} · {p.views || 0} view{p.views === 1 ? "" : "s"}
              </p>
              <div className="row mt-12" style={{ gap: 8 }}>
                <Link to="/blog" params={{ post: p.id }}><button className="btn btn--sm">Preview</button></Link>
                <button className="btn btn--sm" onClick={() => edit(p)}>✎ Edit</button>
                <button className="btn btn--sm btn--danger" onClick={() => del(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
