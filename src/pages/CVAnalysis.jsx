import { useEffect, useRef, useState } from "react";
import {
  applyThreshold, canvasToBase64, canvasToDataURL, histogram,
  imageToCanvas, loadImage, lumaToCanvas, otsuThreshold,
  renderHistogramSVG, sobel, summariseLuma, toLuma
} from "../utils/cv.js";
import { analyseImageWithOpenAI, hasApiKey, OpenAIError } from "../utils/openai.js";
import { Link } from "../utils/router.js";

const SAMPLES = [
  { name: "Sample · OPG mandible", url: "./assets/sample-opg.svg",     hint: "Synthetic panoramic radiograph illustration." },
  { name: "Sample · intra-oral",   url: "./assets/sample-intraoral.svg", hint: "Illustrative intra-oral photograph (mock)." }
];

const PIPELINE_STEPS = [
  { id: "gray",   label: "1 · Grayscale (Rec. 601 luma)",     desc: "Collapse RGB to a single brightness channel — most diagnostic imaging is intrinsically grayscale." },
  { id: "hist",   label: "2 · Histogram",                      desc: "Distribution of pixel intensities. Bimodal histograms suggest a clear foreground/background split, e.g. tooth vs. background." },
  { id: "sobel",  label: "3 · Sobel edge magnitude",           desc: "Convolve 3×3 horizontal and vertical kernels and combine magnitudes. Highlights tooth outlines, root tips and cyst margins." },
  { id: "otsu",   label: "4 · Otsu binarisation",              desc: "Automatically pick the global threshold that maximises between-class variance. Useful for segmenting radiolucent lesions." }
];

export default function CVAnalysis() {
  const [filename, setFilename] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [outputs, setOutputs] = useState(null); // { gray, sobel, otsu, hist, summary, thresholdT }
  const [aiBusy, setAiBusy] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiErr, setAiErr] = useState("");
  const [manualT, setManualT] = useState(127);
  const sourceRef = useRef(null);

  const runPipeline = async (input) => {
    setBusy(true); setErr(""); setOutputs(null); setAiText(""); setAiErr("");
    try {
      const img = await loadImage(input);
      const src = imageToCanvas(img, 720);
      sourceRef.current = src;

      const luma = toLuma(src);
      const grayC = lumaToCanvas(luma);
      const edges = sobel(luma);
      const edgesC = lumaToCanvas(edges, [0.4, 1.0, 0.95]); // tinted teal
      const t = otsuThreshold(luma.luma);
      const otsuC = lumaToCanvas(applyThreshold(luma, t));
      const summary = summariseLuma(luma);
      const hist = histogram(luma.luma);

      setManualT(t);
      setOutputs({
        sourceUrl: canvasToDataURL(src),
        grayUrl:   canvasToDataURL(grayC),
        sobelUrl:  canvasToDataURL(edgesC),
        otsuUrl:   canvasToDataURL(otsuC),
        histSvg:   renderHistogramSVG(hist, 320, 110, "var(--brand)"),
        summary, thresholdT: t,
        lumaRef: luma
      });
    } catch (e) {
      setErr("Could not read that image. Try a JPG or PNG.");
    } finally {
      setBusy(false);
    }
  };

  // Live re-binarise when the manual slider moves
  useEffect(() => {
    if (!outputs?.lumaRef) return;
    const c = lumaToCanvas(applyThreshold(outputs.lumaRef, manualT));
    setOutputs(o => ({ ...o, otsuUrl: canvasToDataURL(c) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualT]);

  const onFile = (f) => {
    if (!f) return;
    setFilename(f.name);
    runPipeline(f);
  };

  const onSample = (url) => {
    setFilename(url.split("/").pop());
    runPipeline(url);
  };

  const askAI = async () => {
    if (!sourceRef.current || !hasApiKey()) return;
    setAiBusy(true); setAiText(""); setAiErr("");
    try {
      const b64 = canvasToBase64(sourceRef.current);
      const out = await analyseImageWithOpenAI(b64);
      setAiText(out);
    } catch (e) {
      const m = e instanceof OpenAIError
        ? (e.type === "auth"       ? "OpenAI rejected the key (401). Update in Settings."
         : e.type === "rate_limit" ? "Rate limit — try again shortly."
         : e.message)
        : "Unexpected error.";
      setAiErr(m);
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <section className="container section fade-in">
      <div className="spread mb-16">
        <div>
          <span className="hero__chip"><span className="dot" />Computer vision · canvas pipeline</span>
          <h2 className="section__title mt-12">Radiograph &amp; image analysis</h2>
          <p className="section__sub">
            Upload an OPG, periapical, intra-oral photograph or histology slide.
            The app runs a classical CV pipeline entirely in your browser —
            grayscale ⇒ histogram ⇒ Sobel edges ⇒ Otsu binarisation — and can
            optionally hand the image to GPT-4o-mini for a structured educational
            interpretation.
          </p>
        </div>
        {!hasApiKey() && (
          <Link to="/settings"><button className="btn btn--sm">⚙️ Add OpenAI key for AI step</button></Link>
        )}
      </div>

      <div className="grid mb-16" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="drop" onClick={() => document.getElementById("cv-file").click()}>
          <div className="drop__icon">🖼️</div>
          <h3 style={{ margin: "6px 0", fontFamily: "var(--font-display)", fontSize: 20 }}>
            Drop an image or click to choose
          </h3>
          <p>Local-only — your image never leaves the browser unless you press <b>Run AI analysis</b>.</p>
          <input id="cv-file" type="file" accept="image/*" style={{ display: "none" }}
                 onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
        <div className="card" style={{ display: "block" }}>
          <h3 style={{ marginTop: 0 }}>Try a built-in sample</h3>
          <p className="muted" style={{ fontSize: 13 }}>Synthetic illustrations — useful when you don't have a radiograph at hand.</p>
          <div className="row mt-12" style={{ gap: 8, flexWrap: "wrap" }}>
            {SAMPLES.map(s => (
              <button key={s.url} className="btn btn--sm" onClick={() => onSample(s.url)}>{s.name}</button>
            ))}
          </div>
          <p className="muted mt-12" style={{ fontSize: 12 }}>
            Want real radiographs? Use any anonymised image from the public NIH 3D / OpenI dental dataset.
          </p>
        </div>
      </div>

      {err && <div className="notice notice--warn">{err}</div>}
      {busy && <div className="notice">Running pipeline…</div>}

      {outputs && (
        <>
          <h3 className="section__title mt-24">Pipeline output</h3>
          <p className="section__sub">
            File: <span className="kbd">{filename}</span> · contrast: <b>{outputs.summary.contrastClass}</b> ·
            mean luma: <b>{outputs.summary.meanLuma}</b> · std: <b>{outputs.summary.stdLuma}</b> ·
            dark pixels: {outputs.summary.darkRatio}% · bright: {outputs.summary.brightRatio}%
          </p>

          <div className="grid mb-16" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <PipelineCard title="Original" img={outputs.sourceUrl} caption="Input image, resized to ≤720px." />
            <PipelineCard title="1 · Grayscale" img={outputs.grayUrl}
                          caption="Rec.601 luma (0.299R + 0.587G + 0.114B)." />
            <PipelineCard title="3 · Sobel edges" img={outputs.sobelUrl}
                          caption="3×3 horizontal + vertical kernels, magnitude scaled to 0–255." />
            <PipelineCard title={`4 · Threshold @ ${manualT}`} img={outputs.otsuUrl}
                          caption={`Otsu auto-picked ${outputs.thresholdT}. Use the slider to override.`} />
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div className="chart-card">
              <h3>2 · Intensity histogram</h3>
              <p className="muted" style={{ fontSize: 13 }}>
                256-bin distribution of pixel luminance. Bimodal = good candidate
                for global thresholding; unimodal = consider adaptive methods.
              </p>
              <div className="mt-12" dangerouslySetInnerHTML={{ __html: outputs.histSvg }} />
            </div>

            <div className="chart-card">
              <h3>Manual threshold</h3>
              <p className="muted" style={{ fontSize: 13 }}>
                Drag the slider to see how the binarisation responds. The label
                "Otsu" highlights the value that maximises between-class variance.
              </p>
              <div className="row mt-12" style={{ gap: 12 }}>
                <input
                  type="range" min={0} max={255} value={manualT}
                  onChange={(e) => setManualT(+e.target.value)}
                  style={{ flex: 1 }}
                />
                <span className="kbd" style={{ minWidth: 48, textAlign: "center" }}>{manualT}</span>
                <button className="btn btn--sm" onClick={() => setManualT(outputs.thresholdT)}>
                  Otsu ({outputs.thresholdT})
                </button>
              </div>
            </div>
          </div>

          <div className="card mt-24" style={{ display: "block" }}>
            <div className="spread">
              <div>
                <span className="tag tag--violet">AI assistant · GPT-4o-mini vision</span>
                <h3 style={{ margin: "8px 0 4px" }}>Optional · structured educational interpretation</h3>
                <p className="muted" style={{ fontSize: 13 }}>
                  Sends the original image to OpenAI for a structured teaching
                  caption. <b>Educational use only — not a clinical diagnosis.</b>
                </p>
              </div>
              <button
                className="btn btn--primary"
                disabled={!hasApiKey() || aiBusy}
                onClick={askAI}
              >
                {aiBusy ? "Analysing…" : "🧠 Run AI analysis"}
              </button>
            </div>
            {!hasApiKey() && (
              <div className="notice notice--warn mt-12">
                Add an OpenAI key in <Link to="/settings">Settings</Link> to enable the AI step.
              </div>
            )}
            {aiErr && <div className="notice notice--warn mt-12">{aiErr}</div>}
            {aiText && (
              <div className="notice notice--success mt-12" style={{ whiteSpace: "pre-wrap" }}>
                {aiText}
              </div>
            )}
          </div>
        </>
      )}

      <h3 className="section__title mt-32">What this pipeline does &amp; why it matters</h3>
      <div className="grid">
        {PIPELINE_STEPS.map(s => (
          <div className="card" key={s.id}>
            <h3>{s.label}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="notice mt-24">
        🔒 <b>Privacy:</b> classical CV runs entirely in your browser — your
        image never leaves your device. Only the explicit "Run AI analysis"
        button sends data to OpenAI.
      </div>
    </section>
  );
}

const PipelineCard = ({ title, img, caption }) => (
  <div className="card" style={{ display: "block", padding: 14 }}>
    <h3 style={{ fontSize: 14, margin: "0 0 8px" }}>{title}</h3>
    <img src={img} alt={title}
         style={{ width: "100%", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)" }} />
    <p className="muted mt-8" style={{ fontSize: 12 }}>{caption}</p>
  </div>
);
