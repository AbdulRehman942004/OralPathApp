import { useState, useRef, useEffect } from "react";
import { MODELS } from "../data/models.js";
import { markARVisited } from "../utils/achievements.js";

export default function ARView() {
  const [active, setActive] = useState(MODELS[0].id);
  const [compareId, setCompareId] = useState(null);
  const [mode, setMode] = useState("inspect"); // inspect | compare
  const [bgPattern, setBgPattern] = useState("neutral");
  const mvRef = useRef(null);
  const mv2Ref = useRef(null);
  const m = MODELS.find(x => x.id === active);
  const m2 = compareId ? MODELS.find(x => x.id === compareId) : null;

  useEffect(() => { markARVisited(); }, []);

  // Hotspot positioning helper, attached to either viewer
  const placeHotspots = (mv, model) => {
    if (!mv || !model?.hotspots?.length) return;
    try {
      const c = mv.getBoundingBoxCenter();
      const d = mv.getDimensions();
      if (!c || !d) return;
      const fmt = n => Number(n).toFixed(3);
      const positions = [
        `${fmt(c.x)} ${fmt(c.y + d.y * 0.30)} ${fmt(c.z + d.z * 0.35)}`,
        `${fmt(c.x + d.x * 0.42)} ${fmt(c.y)} ${fmt(c.z - d.z * 0.10)}`,
        `${fmt(c.x)} ${fmt(c.y - d.y * 0.30)} ${fmt(c.z - d.z * 0.25)}`,
        `${fmt(c.x - d.x * 0.42)} ${fmt(c.y)} ${fmt(c.z - d.z * 0.10)}`,
      ];
      model.hotspots.forEach((h, i) => {
        if (positions[i]) mv.updateHotspot({ name: `hotspot-${h.id}`, position: positions[i] });
      });
    } catch (_) {}
  };

  useEffect(() => {
    const mv = mvRef.current;
    if (!mv) return;
    const fn = () => placeHotspots(mv, m);
    mv.addEventListener("load", fn);
    if (mv.loaded) fn();
    return () => mv.removeEventListener("load", fn);
  }, [active, m]);

  useEffect(() => {
    const mv = mv2Ref.current;
    if (!mv || !m2) return;
    const fn = () => placeHotspots(mv, m2);
    mv.addEventListener("load", fn);
    if (mv.loaded) fn();
    return () => mv.removeEventListener("load", fn);
  }, [compareId, m2]);

  const otherModels = MODELS.filter(x => x.id !== active);

  return (
    <section className="container section fade-in">
      <div className="spread mb-16">
        <div>
          <span className="hero__chip"><span className="dot" />3D · WebXR · ARCore</span>
          <h2 className="section__title mt-12">3D &amp; Augmented Reality</h2>
          <p className="section__sub">
            Rotate, pinch-zoom and orbit photoreal NIH 3D models. On supported Android devices, tap{" "}
            <b>View in your space</b> to project the model into your environment using ARCore.
          </p>
        </div>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <button
            className={"btn btn--sm " + (mode === "inspect" ? "btn--primary" : "")}
            onClick={() => { setMode("inspect"); setCompareId(null); }}
          >🔍 Inspect</button>
          <button
            className={"btn btn--sm " + (mode === "compare" ? "btn--primary" : "")}
            onClick={() => { setMode("compare"); if (!compareId) setCompareId(otherModels[0]?.id); }}
          >⇆ Compare</button>
        </div>
      </div>

      <div className="grid mb-24" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {MODELS.map(model => (
          <button
            key={model.id}
            className="card"
            onClick={() => setActive(model.id)}
            style={{
              textAlign: "left",
              cursor: "pointer",
              borderColor: model.id === active ? "var(--brand)" : "var(--border)",
              background: model.id === active ? "rgba(25,211,197,0.08)" : "var(--panel)"
            }}
          >
            <div className="row row--wrap">{model.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            <h3>{model.title}</h3>
            <p>{model.description}</p>
          </button>
        ))}
      </div>

      {mode === "inspect" && (
        <div className="viewer">
          <model-viewer
            ref={mvRef}
            key={m.id}
            src={m.url}
            alt={m.title}
            camera-controls
            auto-rotate
            ar
            ar-modes="webxr scene-viewer quick-look"
            shadow-intensity="0.9"
            exposure="1.05"
            environment-image={bgPattern}
          >
            {m.hotspots.map(h => (
              <button
                key={h.id}
                className="hotspot"
                slot={`hotspot-${h.id}`}
                data-position="0 0 0"
                data-normal="0 1 0"
                style={{
                  background: "linear-gradient(135deg, #19d3c5, #9b7bff)",
                  color: "#06141a",
                  border: 0, padding: "6px 12px", borderRadius: 999,
                  fontSize: 12, fontWeight: 700,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
                  cursor: "pointer"
                }}
              >
                {h.label}
              </button>
            ))}
          </model-viewer>
          <div className="viewer__info">
            <h2>{m.title}</h2>
            <div className="tags">{m.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            <p className="muted">{m.description}</p>

            <h3 className="mt-16">Controls</h3>
            <ul>
              <li><b>Drag</b> to orbit</li>
              <li><b>Pinch</b> / scroll to zoom</li>
              <li><b>Two-finger drag</b> to pan</li>
              <li><b>View in your space</b> (mobile AR) — requires ARCore on Android or Quick Look on iOS</li>
            </ul>

            <h3 className="mt-16">Environment</h3>
            <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
              {["neutral", "legacy"].map(p => (
                <button
                  key={p}
                  className={"btn btn--sm " + (bgPattern === p ? "btn--primary" : "")}
                  onClick={() => setBgPattern(p)}
                >{p}</button>
              ))}
            </div>

            <div className="notice mt-16">
              Models sourced from the NIH 3D Print Exchange. Use{" "}
              <span className="kbd">View in your space</span> on supported Android devices for AR overlay.
            </div>
          </div>
        </div>
      )}

      {mode === "compare" && (
        <>
          <div className="row mb-12" style={{ gap: 10, flexWrap: "wrap" }}>
            <span className="muted">Comparing:</span>
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              style={{ background: "var(--bg-2)", color: "var(--text)", padding: "8px 10px", borderRadius: 10, border: "1px solid var(--border)" }}
            >
              {MODELS.map(model => <option key={model.id} value={model.id}>{model.title}</option>)}
            </select>
            <span className="muted">vs</span>
            <select
              value={compareId || ""}
              onChange={(e) => setCompareId(e.target.value)}
              style={{ background: "var(--bg-2)", color: "var(--text)", padding: "8px 10px", borderRadius: 10, border: "1px solid var(--border)" }}
            >
              {MODELS.filter(x => x.id !== active).map(model => (
                <option key={model.id} value={model.id}>{model.title}</option>
              ))}
            </select>
          </div>

          <div className="viewer viewer--split">
            <div>
              <div className="viewer__toolbar">
                <span className="tag">A</span>
                <b style={{ fontSize: 13 }}>{m.title}</b>
              </div>
              <model-viewer
                ref={mvRef}
                key={`A-${m.id}`}
                src={m.url}
                alt={m.title}
                camera-controls auto-rotate
                shadow-intensity="0.9" exposure="1.05" environment-image="neutral"
              ></model-viewer>
            </div>
            <div>
              <div className="viewer__toolbar">
                <span className="tag tag--violet">B</span>
                <b style={{ fontSize: 13 }}>{m2?.title}</b>
              </div>
              {m2 && (
                <model-viewer
                  ref={mv2Ref}
                  key={`B-${m2.id}`}
                  src={m2.url}
                  alt={m2.title}
                  camera-controls auto-rotate
                  shadow-intensity="0.9" exposure="1.05" environment-image="neutral"
                ></model-viewer>
              )}
            </div>
          </div>
          <p className="muted mt-12" style={{ fontSize: 13 }}>
            Use compare mode to visually correlate <i>normal anatomy</i> with <i>pathology</i> —
            for example, the mandibular third-molar region vs. the same region with an ameloblastoma.
          </p>
        </>
      )}

      <div className="grid mt-24" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div className="card">
          <div className="card__icon">📱</div>
          <h3>How to use AR</h3>
          <p>Open this page on an Android device with ARCore installed. Tap "View in your space" and follow the camera prompts.</p>
        </div>
        <div className="card">
          <div className="card__icon">🧪</div>
          <h3>Clinical correlation</h3>
          <p>Each model is annotated with anatomical hotspots that link to the relevant Reading module.</p>
        </div>
        <div className="card">
          <div className="card__icon">🎓</div>
          <h3>Educational use</h3>
          <p>Models are from the NIH 3D Print Exchange — public domain, suitable for teaching.</p>
        </div>
      </div>
    </section>
  );
}
