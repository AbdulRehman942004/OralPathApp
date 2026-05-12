import { useState, useRef, useEffect } from "react";
import { MODELS } from "../data/models.js";

export default function ARView() {
  const [active, setActive] = useState(MODELS[0].id);
  const mvRef = useRef(null);
  const m = MODELS.find(x => x.id === active);

  // Dynamically reposition hotspots once the model loads so they sit
  // at anatomically meaningful spots relative to the real bounding box.
  useEffect(() => {
    const mv = mvRef.current;
    if (!mv) return;

    const placeHotspots = () => {
      try {
        const c = mv.getBoundingBoxCenter();   // {x, y, z}
        const d = mv.getDimensions();          // {x, y, z} — full extents
        if (!c || !d) return;

        const fmt = n => Number(n).toFixed(3);

        // Four spread positions: front-upper, right-mid, rear-lower, left-mid
        const positions = [
          `${fmt(c.x)}                   ${fmt(c.y + d.y * 0.30)} ${fmt(c.z + d.z * 0.35)}`,
          `${fmt(c.x + d.x * 0.42)}     ${fmt(c.y)}               ${fmt(c.z - d.z * 0.10)}`,
          `${fmt(c.x)}                   ${fmt(c.y - d.y * 0.30)} ${fmt(c.z - d.z * 0.25)}`,
          `${fmt(c.x - d.x * 0.42)}     ${fmt(c.y)}               ${fmt(c.z - d.z * 0.10)}`,
        ];

        m.hotspots.forEach((h, i) => {
          if (positions[i]) {
            mv.updateHotspot({ name: `hotspot-${h.id}`, position: positions[i] });
          }
        });
      } catch (_) { /* model not ready yet */ }
    };

    mv.addEventListener("load", placeHotspots);
    // If model was already cached and loaded before effect ran:
    if (mv.loaded) placeHotspots();

    return () => mv.removeEventListener("load", placeHotspots);
  }, [active, m]);

  return (
    <section className="container section">
      <h2 className="section__title">3D &amp; Augmented Reality</h2>
      <p className="section__sub">
        Rotate, pinch-zoom, and orbit the model. On supported Android devices, tap{" "}
        <b>View in your space</b> to project the model into your environment using ARCore.
      </p>

      <div className="grid mb-24" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {MODELS.map(model => (
          <button
            key={model.id}
            className={"card " + (model.id === active ? "" : "")}
            onClick={() => setActive(model.id)}
            style={{
              textAlign: "left",
              cursor: "pointer",
              borderColor: model.id === active ? "var(--brand)" : "var(--border)",
              background: model.id === active ? "var(--panel-2)" : "var(--panel)"
            }}
          >
            <div className="row">{model.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            <h3>{model.title}</h3>
            <p>{model.description}</p>
          </button>
        ))}
      </div>

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
          shadow-intensity="1"
          exposure="1"
          environment-image="neutral"
        >
          {m.hotspots.map(h => (
            <button
              key={h.id}
              className="hotspot"
              slot={`hotspot-${h.id}`}
              data-position="0 0 0"
              data-normal="0 1 0"
              style={{
                background: "rgba(24,169,153,0.95)", color: "#fff",
                border: "0", padding: "6px 10px", borderRadius: 999,
                fontSize: 12, fontWeight: 700, boxShadow: "0 2px 6px rgba(0,0,0,0.4)"
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
            <li><b>View in your space</b> (mobile AR) — requires ARCore on Android</li>
          </ul>

          <div className="notice mt-16">
            All anatomical models are sourced from the NIH 3D Print Exchange and processed
            for interactive clinical education. Use <span className="kbd">View in your space</span> on
            supported Android devices for augmented reality overlay.
          </div>
        </div>
      </div>
    </section>
  );
}
